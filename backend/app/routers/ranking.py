import json
from typing import List
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.portfolio import RankingJob, RankedResume
from app.schemas.portfolio import RankingJobResponse, RankedResumeItem
from app.services import pdf_parser, ranking_service
from app.auth import get_current_user

router = APIRouter()

@router.post("/rank", response_model=RankingJobResponse)
async def rank_resumes(
    job_description: str = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Bulk upload resumes and rank them against a job description."""
    if not files:
        raise HTTPException(400, "No files provided")

    # 1. Create the Ranking Job
    job = RankingJob(
        user_id=user_id,
        job_description=job_description
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    results = []

    # 2. Process each file
    for file in files:
        if file.content_type != "application/pdf" and not file.filename.lower().endswith(".pdf"):
            print(f"Skipping {file.filename}: Invalid content type '{file.content_type}'")
            continue # Skip non-PDFs

        file_bytes = await file.read()
        try:
            raw_text = pdf_parser.extract_text(file_bytes)
            rank_result = await ranking_service.rank_resume(raw_text, job_description)
            
            # Save the individual result
            ranked_resume = RankedResume(
                job_id=job.id,
                filename=file.filename,
                score=rank_result.score,
                feedback=json.dumps(rank_result.feedback),
                raw_text=raw_text
            )
            db.add(ranked_resume)
            db.flush()
            
            results.append(RankedResumeItem(
                id=str(ranked_resume.id),
                filename=file.filename,
                score=rank_result.score,
                feedback=rank_result.feedback
            ))
        except Exception as e:
            print(f"Failed to process {file.filename}: {str(e)}")
            continue

    db.commit()

    return RankingJobResponse(
        id=job.id,
        job_description=job.job_description,
        created_at=job.created_at.isoformat() if job.created_at else "",
        results=results
    )

@router.get("/jobs", response_model=List[RankingJobResponse])
async def get_ranking_jobs(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Retrieve all ranking jobs for the current user."""
    jobs = db.query(RankingJob).filter(RankingJob.user_id == user_id).order_by(RankingJob.created_at.desc()).all()
    
    response = []
    for job in jobs:
        ranked_resumes = db.query(RankedResume).filter(RankedResume.job_id == job.id).all()
        results = [
            RankedResumeItem(
                id=r.id,
                filename=r.filename,
                score=r.score,
                feedback=json.loads(r.feedback)
            ) for r in ranked_resumes
        ]
        response.append(RankingJobResponse(
            id=job.id,
            job_description=job.job_description,
            created_at=job.created_at.isoformat() if job.created_at else "",
            results=results
        ))
    
    return response
