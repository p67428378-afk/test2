from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Resume, WorkExperience, EducationEntry, ResumeSkill
from server.schemas import ResumeCreate, ResumeUpdate, ResumeResponse
from server.pdf_generator import generate_resume_pdf

router = APIRouter()


@router.post(
    "",
    response_model=ResumeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new resume profile"
)
def create_resume(payload: ResumeCreate, db: Session = Depends(get_db)):
    resume = Resume(
        title=payload.title,
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        summary=payload.summary,
    )
    db.add(resume)
    db.flush()

    for exp in payload.experiences:
        work_exp = WorkExperience(
            resume_id=resume.id,
            company_name=exp.company_name,
            role=exp.role,
            start_date=exp.start_date,
            end_date=exp.end_date,
            is_current=exp.is_current,
            description=exp.description,
        )
        db.add(work_exp)

    for edu in payload.education:
        edu_entry = EducationEntry(
            resume_id=resume.id,
            institution=edu.institution,
            degree=edu.degree,
            start_date=edu.start_date,
            end_date=edu.end_date,
        )
        db.add(edu_entry)

    for skill in payload.skills:
        skill_name = skill if isinstance(skill, str) else skill.skill_name
        skill_record = ResumeSkill(
            resume_id=resume.id,
            skill_name=skill_name,
        )
        db.add(skill_record)

    db.commit()
    db.refresh(resume)
    return resume


@router.get(
    "",
    response_model=List[ResumeResponse],
    summary="List paginated resumes"
)
def list_resumes(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    resumes = db.query(Resume).offset(skip).limit(limit).all()
    return resumes


@router.get(
    "/{id}",
    response_model=ResumeResponse,
    summary="Fetch detailed resume profile by UUID"
)
def get_resume(id: str, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume with id '{id}' not found"
        )
    return resume


@router.put(
    "/{id}",
    response_model=ResumeResponse,
    summary="Update existing resume profile"
)
def update_resume(id: str, payload: ResumeUpdate, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume with id '{id}' not found"
        )

    if payload.title is not None:
        resume.title = payload.title
    if payload.full_name is not None:
        resume.full_name = payload.full_name
    if payload.email is not None:
        resume.email = payload.email
    if payload.phone is not None:
        resume.phone = payload.phone
    if payload.summary is not None:
        resume.summary = payload.summary

    if payload.experiences is not None:
        # Clear existing experiences and insert new
        db.query(WorkExperience).filter(WorkExperience.resume_id == resume.id).delete()
        for exp in payload.experiences:
            work_exp = WorkExperience(
                resume_id=resume.id,
                company_name=exp.company_name,
                role=exp.role,
                start_date=exp.start_date,
                end_date=exp.end_date,
                is_current=exp.is_current,
                description=exp.description,
            )
            db.add(work_exp)

    if payload.education is not None:
        # Clear existing education and insert new
        db.query(EducationEntry).filter(EducationEntry.resume_id == resume.id).delete()
        for edu in payload.education:
            edu_entry = EducationEntry(
                resume_id=resume.id,
                institution=edu.institution,
                degree=edu.degree,
                start_date=edu.start_date,
                end_date=edu.end_date,
            )
            db.add(edu_entry)

    if payload.skills is not None:
        # Clear existing skills and insert new
        db.query(ResumeSkill).filter(ResumeSkill.resume_id == resume.id).delete()
        for skill in payload.skills:
            skill_name = skill if isinstance(skill, str) else skill.skill_name
            skill_record = ResumeSkill(
                resume_id=resume.id,
                skill_name=skill_name,
            )
            db.add(skill_record)

    db.commit()
    db.refresh(resume)
    return resume


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete resume record"
)
def delete_resume(id: str, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume with id '{id}' not found"
        )
    db.delete(resume)
    db.commit()
    return None


@router.get(
    "/{id}/export",
    summary="Generate and stream PDF document"
)
def export_resume_pdf(id: str, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume with id '{id}' not found"
        )

    pdf_bytes = generate_resume_pdf(resume)
    headers = {
        "Content-Disposition": f'attachment; filename="Resume_{resume.id}.pdf"'
    }
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
