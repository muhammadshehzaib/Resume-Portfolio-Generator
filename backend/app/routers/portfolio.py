import hashlib
import json
import re
from typing import Optional
from datetime import datetime, timedelta
import httpx
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.portfolio import Portfolio, PortfolioView
from app.schemas.portfolio import (
    PortfolioResponse, ParsedResume, CustomColors, PortfolioSettings, 
    TailorRequest, TailorResult, SuggestionResult, AnalyticsResponse,
    GeographicStat, TimeSeriesStat
)
from app.services import pdf_parser, ai_extractor, ats_scorer, tailor_service, suggestion_service, pdf_generator
from app.auth import get_current_user
from app.config import settings

router = APIRouter()

async def record_view(portfolio_id: str, request: Request, db: Session):
    """Helper to record a detailed portfolio view with GeoIP resolution."""
    # 1. Get IP address
    ip_address = request.client.host if request.client else "unknown"
    
    # 2. Hash IP for privacy and uniqueness tracking
    ip_hash = hashlib.sha256(ip_address.encode()).hexdigest()
    
    # 3. Resolve Geo (if not previously resolved recently or just do it simple for now)
    country, city = None, None
    if ip_address != "127.0.0.1" and ip_address != "unknown":
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(f"http://ip-api.com/json/{ip_address}", timeout=2.0)
                if res.status_code == 200:
                    data = res.json()
                    country = data.get("country")
                    city = data.get("city")
        except Exception:
            pass # Fail silently
            
    # 4. Save to DB
    new_view = PortfolioView(
        portfolio_id=portfolio_id,
        ip_hash=ip_hash,
        country=country,
        city=city
    )
    db.add(new_view)
    
    # Also increment the legacy counter for quick stats
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if portfolio:
        portfolio.view_count = (portfolio.view_count or 0) + 1
        
    db.commit()

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
    portfolio = db.query(Portfolio).filter(
        (Portfolio.slug == slug) | (Portfolio.id == slug)
    ).first()
    if not portfolio:
        raise HTTPException(404, "Portfolio not found")
    return _to_response(portfolio)

def _to_response(portfolio: Portfolio) -> PortfolioResponse:
    """Convert ORM model to API response."""
    # Parse main portfolio data with error handling
    try:
        parsed_data = json.loads(portfolio.parsed_data)
    except json.JSONDecodeError as e:
        raise HTTPException(500, f"Corrupted portfolio data: unable to parse resume information")

    try:
        parsed_resume = ParsedResume.model_validate(parsed_data)
    except ValueError as e:
        raise HTTPException(500, f"Invalid portfolio data format: {str(e)}")

    try:
        ats_feedback = json.loads(portfolio.ats_feedback)
    except json.JSONDecodeError as e:
        raise HTTPException(500, f"Corrupted ATS feedback data in portfolio")

    # Deserialize custom_colors if present - use safe default on error
    custom_colors = None
    if portfolio.custom_colors:
        try:
            colors_data = json.loads(portfolio.custom_colors)
            custom_colors = CustomColors.model_validate(colors_data)
        except Exception as e:
            # Log but don't crash - use None as default (templates handle this)
            print(f"Warning: Could not parse custom_colors for portfolio {portfolio.id}: {str(e)}")
            custom_colors = None

    # Deserialize section_order if present - use None on error
    section_order = None
    if portfolio.section_order:
        try:
            section_order = json.loads(portfolio.section_order)
        except Exception as e:
            # Log but don't crash - templates will use default order
            print(f"Warning: Could not parse section_order for portfolio {portfolio.id}: {str(e)}")
            section_order = None

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
    """Retrieve portfolio by UUID without incrementing view count (Studio View)."""
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(404, "Portfolio not found")
    return _to_response(portfolio)

@router.get("/portfolio/{portfolio_id}/pdf")
async def get_portfolio_pdf(portfolio_id: str, db: Session = Depends(get_db)):
    """Generate and return a PDF of the portfolio."""
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(404, "Portfolio not found")
        
    try:
        pdf_bytes = await pdf_generator.generate_portfolio_pdf(portfolio_id)
        
        # Determine a nice filename
        parsed_data = json.loads(portfolio.parsed_data)
        name = parsed_data.get("name", "Portfolio").replace(" ", "_")
        filename = f"{name}_Resume.pdf"
        
        return StreamingResponse(
            iter([pdf_bytes]),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
    except Exception as e:
        print(f"PDF Generation Error: {str(e)}")
        raise HTTPException(500, f"Failed to generate PDF: {str(e)}")

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

@router.post("/portfolio/{portfolio_id}/suggestions", response_model=SuggestionResult)
async def get_suggestions(
    portfolio_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Get AI-powered suggestions for improving the portfolio."""
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(404, "Portfolio not found")

    # Check ownership
    if portfolio.user_id != user_id:
        raise HTTPException(403, "You do not have permission to access this portfolio")

    try:
        parsed = ParsedResume.model_validate(json.loads(portfolio.parsed_data))
    except json.JSONDecodeError:
        raise HTTPException(500, "Corrupted portfolio data")

    portfolio_data = {
        "name": parsed.name or "Not provided",
        "summary": parsed.summary or "Not provided",
        "experience_count": len(parsed.experiences),
        "experiences": [f"{e.title} at {e.company}: {'; '.join(e.description)}" for e in parsed.experiences],
        "education": [f"{e.degree} from {e.institution}" for e in parsed.education],
        "skills": ", ".join(parsed.skills),
        "projects": [p.name for p in parsed.projects],
        "has_photo": bool(portfolio.photo_url),
        "available_for_hire": bool(portfolio.available_for_hire),
        "ats_score": portfolio.ats_score,
    }

    try:
        return await suggestion_service.analyze(portfolio_data)
    except ValueError as e:
        raise HTTPException(500, f"AI analysis failed: {str(e)}")

@router.get("/p/{slug}", response_model=PortfolioResponse)
async def get_portfolio_by_slug(slug: str, request: Request, db: Session = Depends(get_db)):
    """Retrieve portfolio by slug and record a detailed view."""
    portfolio = db.query(Portfolio).filter(
        (Portfolio.slug == slug) | (Portfolio.id == slug)
    ).first()
    if not portfolio:
        raise HTTPException(404, "Portfolio not found")
    
    # Record detailed view asynchronously (effectively)
    await record_view(portfolio.id, request, db)
    
    return _to_response(portfolio)

@router.get("/portfolio/{portfolio_id}/analytics", response_model=AnalyticsResponse)
async def get_portfolio_analytics(
    portfolio_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Retrieve aggregated analytics for a portfolio."""
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(404, "Portfolio not found")
    if portfolio.user_id != user_id:
        raise HTTPException(403, "Access denied")

    # 1. Total & Unique
    total_views = db.query(PortfolioView).filter(PortfolioView.portfolio_id == portfolio_id).count()
    unique_visitors = db.query(func.count(func.distinct(PortfolioView.ip_hash))).filter(PortfolioView.portfolio_id == portfolio_id).scalar()

    # 2. Geographic Stats
    geo_stats = db.query(
        PortfolioView.country, 
        func.count(PortfolioView.id).label("count")
    ).filter(
        PortfolioView.portfolio_id == portfolio_id,
        PortfolioView.country.isnot(None)
    ).group_by(PortfolioView.country).order_by(func.count(PortfolioView.id).desc()).limit(10).all()
    
    geographic_stats = [GeographicStat(country=row[0], count=row[1]) for row in geo_stats]

    # 3. Time Series (Last 7 Days)
    time_series = []
    today = datetime.now()
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_str = day.strftime("%Y-%m-%d")
        
        day_views = db.query(PortfolioView).filter(
            PortfolioView.portfolio_id == portfolio_id,
            func.date(PortfolioView.timestamp) == day.date()
        ).count()
        
        day_uniques = db.query(func.count(func.distinct(PortfolioView.ip_hash))).filter(
            PortfolioView.portfolio_id == portfolio_id,
            func.date(PortfolioView.timestamp) == day.date()
        ).scalar()
        
        time_series.append(TimeSeriesStat(date=day_str, views=day_views, uniques=day_uniques))

    return AnalyticsResponse(
        total_views=total_views,
        unique_visitors=unique_visitors or 0,
        geographic_stats=geographic_stats,
        time_series=time_series
    )

@router.get("/slug/check")
async def check_slug_availability(
    slug: str,
    exclude_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Check if a slug is available. Pass exclude_id to ignore the current portfolio."""
    query = db.query(Portfolio).filter(Portfolio.slug == slug)
    if exclude_id:
        query = query.filter(Portfolio.id != exclude_id)
    taken = query.first() is not None
    return {"available": not taken}
