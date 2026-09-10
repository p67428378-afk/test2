import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import ResumeModel
from server.schemas import (
    ResumeCreate,
    ResumeUpdate,
    ResumeResponse,
    ExportPdfRequest,
    TemplateInfo,
)
from server.services.pdf_service import (
    AVAILABLE_TEMPLATES,
    generate_resume_pdf,
    sanitize_filename,
)

router = APIRouter(prefix="/api/v1", tags=["Resumes"])


@router.get("/templates", response_model=List[TemplateInfo])
@router.get("/resumes/templates", response_model=List[TemplateInfo])
def list_templates():
    """List all available resume templates."""
    return list(AVAILABLE_TEMPLATES.values())


@router.post(
    "/resumes",
    response_model=ResumeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create and persist a new resume"
)
def create_resume(payload: ResumeCreate, db: Session = Depends(get_db)):
    """Create a new resume in the database."""
    # Basic email check
    if "@" not in payload.email or "." not in payload.email.split("@")[-1]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address format"
        )

    resume_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    db_resume = ResumeModel(
        id=resume_id,
        user_name=payload.user_name,
        email=payload.email,
        phone=payload.phone,
        portfolio_url=payload.portfolio_url,
        template_id=payload.template_id or "classic",
        experiences=[exp.model_dump() for exp in payload.experiences],
        education=[edu.model_dump() for edu in payload.education],
        skills=payload.skills,
        created_at=now,
        updated_at=now,
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume


@router.get(
    "/resumes",
    response_model=List[ResumeResponse],
    summary="List all stored resumes with pagination"
)
def list_resumes(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Max records to return"),
    db: Session = Depends(get_db)
):
    """Retrieve a paginated list of resumes."""
    resumes = db.query(ResumeModel).offset(skip).limit(limit).all()
    return resumes


@router.get(
    "/resumes/{resume_id}",
    response_model=ResumeResponse,
    summary="Get resume by UUID"
)
def get_resume(resume_id: str, db: Session = Depends(get_db)):
    """Retrieve a single resume by its UUID."""
    resume = db.query(ResumeModel).filter(ResumeModel.id == resume_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume with specified ID not found"
        )
    return resume


@router.put(
    "/resumes/{resume_id}",
    response_model=ResumeResponse,
    summary="Update an existing resume"
)
def update_resume(
    resume_id: str,
    payload: ResumeUpdate,
    db: Session = Depends(get_db)
):
    """Update resume fields."""
    resume = db.query(ResumeModel).filter(ResumeModel.id == resume_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume with specified ID not found"
        )

    if payload.user_name is not None:
        resume.user_name = payload.user_name
    if payload.email is not None:
        if "@" not in payload.email or "." not in payload.email.split("@")[-1]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email address format"
            )
        resume.email = payload.email
    if payload.phone is not None:
        resume.phone = payload.phone
    if payload.portfolio_url is not None:
        resume.portfolio_url = payload.portfolio_url
    if payload.template_id is not None:
        resume.template_id = payload.template_id
    if payload.experiences is not None:
        resume.experiences = [exp.model_dump() for exp in payload.experiences]
    if payload.education is not None:
        resume.education = [edu.model_dump() for edu in payload.education]
    if payload.skills is not None:
        resume.skills = payload.skills

    resume.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(resume)
    return resume


@router.delete(
    "/resumes/{resume_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a resume"
)
def delete_resume(resume_id: str, db: Session = Depends(get_db)):
    """Delete a resume by UUID."""
    resume = db.query(ResumeModel).filter(ResumeModel.id == resume_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume with specified ID not found"
        )
    db.delete(resume)
    db.commit()
    return None


@router.post(
    "/resumes/export-pdf",
    summary="Export resume as downloadable vector PDF"
)
def export_resume_pdf(
    payload: ExportPdfRequest,
    db: Session = Depends(get_db)
):
    """Render structured resume data into vector PDF and return as attachment."""
    # Scenario A: Stored resume ID referenced
    if payload.resume_id:
        resume = db.query(ResumeModel).filter(ResumeModel.id == payload.resume_id).first()
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume with specified ID not found"
            )
        resume_data = {
            "user_name": payload.user_name or resume.user_name,
            "email": payload.email or resume.email,
            "phone": payload.phone if payload.phone is not None else resume.phone,
            "portfolio_url": payload.portfolio_url if payload.portfolio_url is not None else resume.portfolio_url,
            "template_id": payload.template_id or resume.template_id,
            "experiences": [exp.model_dump() for exp in payload.experiences] if payload.experiences is not None else resume.experiences,
            "education": [edu.model_dump() for edu in payload.education] if payload.education is not None else resume.education,
            "skills": payload.skills if payload.skills is not None else resume.skills,
        }
    else:
        # Scenario B: Direct on-the-fly export
        if not payload.user_name or not payload.email:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Both 'user_name' and 'email' are required for PDF export."
            )
        if "@" not in payload.email or "." not in payload.email.split("@")[-1]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email address format"
            )

        resume_data = {
            "user_name": payload.user_name,
            "email": payload.email,
            "phone": payload.phone,
            "portfolio_url": payload.portfolio_url,
            "template_id": payload.template_id or "classic",
            "experiences": [exp.model_dump() for exp in payload.experiences] if payload.experiences else [],
            "education": [edu.model_dump() for edu in payload.education] if payload.education else [],
            "skills": payload.skills or [],
        }

    template_id = resume_data.get("template_id", "classic")
    try:
        pdf_bytes = generate_resume_pdf(resume_data, template_id=template_id)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF rendering failed: {str(exc)}"
        )

    filename = sanitize_filename(resume_data.get("user_name", "Resume"))
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"',
        "Content-Type": "application/pdf"
    }

    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
