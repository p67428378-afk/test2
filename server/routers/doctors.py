from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.doctor import Doctor
from server.schemas.doctor import DoctorCreate, DoctorResponse

router = APIRouter()


@router.post(
    "/doctors", response_model=DoctorResponse, status_code=status.HTTP_201_CREATED
)
def create_doctor(doctor_in: DoctorCreate, db: Session = Depends(get_db)):
    db_doctor = Doctor(
        name=doctor_in.name,
        specialty=doctor_in.specialty,
        phone=doctor_in.phone,
        email=doctor_in.email,
    )
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor


@router.get("/doctors", response_model=List[DoctorResponse])
def list_doctors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return (
        db.query(Doctor)
        .order_by(Doctor.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
