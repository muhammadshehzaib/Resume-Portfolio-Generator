import json
import re
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.portfolio import Portfolio
from app.schemas.portfolio import PortfolioResponse, ParsedResume, CustomColors, PortfolioSettings, TailorRequest, TailorResult
from app.services import pdf_parser, ai_extractor, ats_scorer, tailor_service
from app.auth import get_current_user
from app.config import settings

router = APIRouter()

@router.get("/portfolio/{portfolio_id}/meta", response_model=PortfolioResponse)
async def get_portfolio_meta(portfolio_id: str, db: Session = Depends(get_db)):
    """Retrieve portfolio metadata without incrementing view count."""
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(404, "Portfolio not found")
    return _to_response(portfolio)

@router.get("/p/{slug}/meta", response_model=PortfolioResponse)
async def get_portfolio_meta_by_slug(slug: str, db: Session = Depends(get_db)):
    """Retrieve portfolio metadata by slug without incrementing view count."""
    portfolio = db.query(Portfolio).filter(Portfolio.slug == slug).first()
    if not portfolio:
        raise HTTPException(404, "Portfolio not found")
    return _to_response(portfolio)

def _to_response(portfolio: Portfolio) -> PortfolioResponse:
    """Convert ORM model to API response."""
    parsed_data = json.loads(portfolio.parsed_data)
    parsed_resume = ParsedResume.model_validate(parsed_data)
    ats_feedback = json.loads(portfolio.ats_feedback)

    # Deserialize custom_colors if present
    custom_colors = None
    if portfolio.custom_colors:
        try:
            colors_data = json.loads(portfolio.custom_colors)
            custom_colors = CustomColors.model_validate(colors_data)
        except Exception:
            pass

    # Deserialize section_order if present
    section_order = None
    if portfolio.section_order:
        try:
            section_order = json.loads(portfolio.section_order)
        except Exception:
            pass

    return PortfolioResponse(
        id=portfolio.id,
        parsed_data=parsed_resume,
        ats_score=portfolio.ats_score,
        ats_feedback=ats_feedback,
        template=portfolio.template,
        created_at=portfolio.created_at.isoformat() if portfolio.created_at else "",
        photo_url=portfolio.photo_url,
        custom_colors=custom_colors,
        section_order=section_order,
        dark_mode=bool(portfolio.dark_mode),
        available_for_hire=bool(portfolio.available_for_hire),
        slug=portfolio.slug,
        view_count=portfolio.view_count or 0
    )

@router.post("/upload", response_model=PortfolioResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Upload PDF resume, extract info, score ATS, and create portfolio."""
    if file.content_type != "application/pdf":
        raise HTTPException(400, "Only PDF files are accepted")

    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(400, "File exceeds 10 MB limit")

    try:
        raw_text = pdf_parser.extract_text(file_bytes)
    except ValueError as e:
        raise HTTPException(422, str(e))

    try:
        parsed = await ai_extractor.extract(raw_text)
        ats = await ats_scorer.score(raw_text)
    except ValueError as e:
        raise HTTPException(500, f"AI processing failed: {str(e)}")

    portfolio = Portfolio(
        user_id=user_id,
        raw_text=raw_text,
        parsed_data=parsed.model_dump_json(),
        ats_score=ats.score,
        ats_feedback=json.dumps(ats.feedback),
        template="minimal"
    )
    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)

    return _to_response(portfolio)

@router.get("/portfolio/{portfolio_id}", response_model=PortfolioResponse)
async def get_portfolio(portfolio_id: str, db: Session = Depends(get_db)):
    """Retrieve portfolio by UUID."""
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(404, "Portfolio not found")
    # Increment view count
    portfolio.view_count = (portfolio.view_count or 0) + 1
    db.commit()
    db.refresh(portfolio)
    return _to_response(portfolio)

@router.patch("/portfolio/{portfolio_id}", response_model=PortfolioResponse)
async def update_portfolio(
    portfolio_id: str,
    data: ParsedResume,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Update portfolio with edited data. Keep same UUID."""
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(404, "Portfolio not found")

    # Check ownership
    if portfolio.user_id != user_id:
        raise HTTPException(403, "You do not have permission to edit this portfolio")

    # Update parsed data
    portfolio.parsed_data = data.model_dump_json()
    db.commit()
    db.refresh(portfolio)

    return _to_response(portfolio)

@router.post("/portfolio/{portfolio_id}/photo", response_model=PortfolioResponse)
async def upload_photo(
    portfolio_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Upload a profile photo for the portfolio."""
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(404, "Portfolio not found")

    # Check ownership
    if portfolio.user_id != user_id:
        raise HTTPException(403, "You do not have permission to edit this portfolio")

    # Validate content type
    if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(400, "Only JPEG, PNG, and WebP images are accepted")

    file_bytes = await file.read()
    if len(file_bytes) > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(400, "Photo exceeds 5 MB limit")

    # Upload to Cloudinary
    try:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
        )

        result = cloudinary.uploader.upload(
            file_bytes,
            public_id=f"portfolio-photos/{portfolio_id}",
            overwrite=True,
            resource_type="image",
        )
        photo_url = result["secure_url"]
    except Exception as e:
        raise HTTPException(500, f"Photo upload failed: {str(e)}")

    # Update portfolio with photo URL
    portfolio.photo_url = photo_url
    db.commit()
    db.refresh(portfolio)

    return _to_response(portfolio)

@router.patch("/portfolio/{portfolio_id}/settings", response_model=PortfolioResponse)
async def update_settings(
    portfolio_id: str,
    settings: PortfolioSettings,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Update portfolio settings (template, colors, order, mode, badge, slug)."""
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(404, "Portfolio not found")

    # Check ownership
    if portfolio.user_id != user_id:
        raise HTTPException(403, "You do not have permission to edit this portfolio")

    # Update template if provided
    if settings.template is not None:
        portfolio.template = settings.template

    # Update custom colors if provided
    if settings.custom_colors is not None:
        portfolio.custom_colors = json.dumps(settings.custom_colors.model_dump())

    # Update section order if provided
    if settings.section_order is not None:
        portfolio.section_order = json.dumps(settings.section_order)

    # Update dark mode if provided
    if settings.dark_mode is not None:
        portfolio.dark_mode = int(settings.dark_mode)

    # Update available for hire if provided
    if settings.available_for_hire is not None:
        portfolio.available_for_hire = int(settings.available_for_hire)

    # Update slug if provided
    if settings.slug is not None:
        # Validate slug format: 3-50 chars, lowercase alphanumeric + hyphens
        slug_regex = r"^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$"
        if not re.match(slug_regex, settings.slug):
            raise HTTPException(422, "Slug must be 3-50 chars, lowercase alphanumeric and hyphens only")

        # Check uniqueness (slug can't be used by another portfolio)
        existing = db.query(Portfolio).filter(
            Portfolio.slug == settings.slug,
            Portfolio.id != portfolio_id
        ).first()
        if existing:
            raise HTTPException(409, "Slug already taken")

        portfolio.slug = settings.slug

    db.commit()
    db.refresh(portfolio)

    return _to_response(portfolio)

@router.post("/portfolio/{portfolio_id}/tailor", response_model=TailorResult)
async def tailor_portfolio(
    portfolio_id: str,
    data: TailorRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Tailor portfolio summary and skills to a specific job description."""
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(404, "Portfolio not found")

    # Check ownership
    if portfolio.user_id != user_id:
        raise HTTPException(403, "You do not have permission to access this portfolio")

    parsed = ParsedResume.model_validate(json.loads(portfolio.parsed_data))

    try:
        result = await tailor_service.tailor(
            summary=parsed.summary or "",
            skills=parsed.skills,
            job_description=data.job_description
        )
    except ValueError as e:
        raise HTTPException(500, f"AI processing failed: {str(e)}")

    return result

@router.get("/p/{slug}", response_model=PortfolioResponse)
async def get_portfolio_by_slug(slug: str, db: Session = Depends(get_db)):
    """Retrieve portfolio by slug."""
    portfolio = db.query(Portfolio).filter(Portfolio.slug == slug).first()
    if not portfolio:
        raise HTTPException(404, "Portfolio not found")
    # Increment view count
    portfolio.view_count = (portfolio.view_count or 0) + 1
    db.commit()
    db.refresh(portfolio)
    return _to_response(portfolio)
