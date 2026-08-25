from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from server.database import get_db
from server.models import Application, Job, User
from server.schemas import (
    ApplicationResponse,
    ApplicationStatusUpdate,
    ApplicationWithSeekerResponse,
)
from server.routers.auth import get_current_job_seeker, get_current_employer
from server.services.storage import storage_service
from server.services.notifications import notification_service

router = APIRouter(tags=["Applications"])


@router.post(
    "/api/v1/jobs/{job_id}/apply",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def apply_for_job(
    job_id: str,
    cover_letter: Optional[str] = Form(None),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_seeker: User = Depends(get_current_job_seeker),
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job posting not found"
        )
    if not job.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This job posting is no longer active",
        )

    # Check if already applied
    existing_app = (
        db.query(Application)
        .filter(
            Application.job_id == job_id, Application.job_seeker_id == current_seeker.id
        )
        .first()
    )
    if existing_app:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied for this job",
        )

    # Save resume
    resume_url = storage_service.save_resume(resume)

    # Create application
    new_app = Application(
        job_id=job_id,
        job_seeker_id=current_seeker.id,
        cover_letter=cover_letter,
        resume_url=resume_url,
        status="Applied",
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    # Send notifications
    try:
        notification_service.send_application_confirmation(
            current_seeker.email, job.title
        )
        # Fetch employer email
        employer = db.query(User).filter(User.id == job.employer_id).first()
        if employer:
            notification_service.send_employer_alert(
                employer.email, current_seeker.email, job.title
            )
    except Exception:
        # Don't fail the request if notification fails
        pass

    return new_app


@router.get(
    "/api/v1/jobs/{job_id}/applications",
    response_model=List[ApplicationWithSeekerResponse],
)
def list_applications(
    job_id: str,
    db: Session = Depends(get_db),
    current_employer: User = Depends(get_current_employer),
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job posting not found"
        )
    if job.employer_id != current_employer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view applications for this job posting",
        )

    # Use joinedload to avoid N+1 queries as required by the database-engineering-skill
    applications = (
        db.query(Application)
        .options(joinedload(Application.job_seeker))
        .filter(Application.job_id == job_id)
        .order_by(Application.created_at.desc())
        .all()
    )

    return applications


@router.patch(
    "/api/v1/applications/{application_id}/status", response_model=ApplicationResponse
)
def update_application_status(
    application_id: str,
    status_update: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_employer: User = Depends(get_current_employer),
):
    application = (
        db.query(Application)
        .options(joinedload(Application.job), joinedload(Application.job_seeker))
        .filter(Application.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Application not found"
        )

    if application.job.employer_id != current_employer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to manage this application",
        )

    application.status = status_update.status
    db.commit()
    db.refresh(application)

    # Send notification
    try:
        notification_service.send_status_update_notification(
            application.job_seeker.email, application.job.title, application.status
        )
    except Exception:
        pass

    return application
