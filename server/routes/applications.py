from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from server.database import get_db
from server.models import AdoptionApplication, Pet
from server.schemas import (
    ApplicationCreate,
    ApplicationResponse,
    AdminApplicationList,
    AdminApplicationItem,
    ApplicationStatusUpdate,
)
from server.auth import get_current_admin

router = APIRouter()


@router.post(
    "", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED
)
def submit_application(app_in: ApplicationCreate, db: Session = Depends(get_db)):
    pet = db.query(Pet).filter(Pet.id == app_in.pet_id).first()
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found"
        )

    # Convert date to datetime for storage
    visit_dt = datetime.combine(app_in.visit_date, datetime.min.time())

    new_app = AdoptionApplication(
        pet_id=app_in.pet_id,
        applicant_name=app_in.applicant_name,
        applicant_email=app_in.applicant_email,
        applicant_phone=app_in.applicant_phone,
        reason=app_in.reason,
        has_other_pets=app_in.has_other_pets,
        visit_date=visit_dt,
        visit_time=app_in.visit_time,
        status="Pending",
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app


@router.get("/admin/applications", response_model=AdminApplicationList)
def list_applications(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    apps = db.query(AdoptionApplication).all()
    items = []
    for app in apps:
        items.append(
            AdminApplicationItem(
                id=app.id,
                applicant_name=app.applicant_name,
                pet_name=app.pet.name if app.pet else "Unknown",
                status=app.status,
                visit_date=app.visit_date.date(),
            )
        )
    return {"items": items}


@router.put("/admin/applications/{app_id}", response_model=ApplicationResponse)
def update_application_status(
    app_id: uuid.UUID,
    status_in: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    app = db.query(AdoptionApplication).filter(AdoptionApplication.id == app_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Application not found"
        )
    app.status = status_in.status
    db.commit()
    db.refresh(app)
    return app
