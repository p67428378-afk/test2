from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.medication import Medication
from server.schemas.medication import MedicationCreate, MedicationResponse

router = APIRouter()


@router.post(
    "/medications",
    response_model=MedicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_medication(medication_in: MedicationCreate, db: Session = Depends(get_db)):
    db_medication = Medication(
        name=medication_in.name,
        code=medication_in.code,
        description=medication_in.description,
        price=medication_in.price,
        stock_quantity=medication_in.stock_quantity,
    )
    db.add(db_medication)
    db.commit()
    db.refresh(db_medication)
    return db_medication


@router.get("/medications", response_model=List[MedicationResponse])
def list_medications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return (
        db.query(Medication)
        .order_by(Medication.name.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )
