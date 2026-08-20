from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Apiary
from server.schemas import ApiaryCreate, ApiaryResponse

router = APIRouter(prefix="/api/v1/apiaries", tags=["Apiaries"])


@router.get("", response_model=List[ApiaryResponse])
def list_apiaries(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    apiaries = db.query(Apiary).offset(skip).limit(limit).all()
    return apiaries


@router.post(
    "",
    response_model=ApiaryResponse,
    status_code=status.HTTP_211_CREATED
    if hasattr(status, "HTTP_211_CREATED")
    else status.HTTP_201_CREATED,
)
def create_apiary(apiary_in: ApiaryCreate, db: Session = Depends(get_db)):
    apiary = Apiary(
        name=apiary_in.name, location=apiary_in.location, notes=apiary_in.notes
    )
    db.add(apiary)
    db.commit()
    db.refresh(apiary)
    return apiary


@router.get("/{apiary_id}", response_model=ApiaryResponse)
def get_apiary(apiary_id: str, db: Session = Depends(get_db)):
    apiary = db.query(Apiary).filter(Apiary.id == apiary_id).first()
    if not apiary:
        raise HTTPException(
            status_code=404, detail=f"Apiary with ID '{apiary_id}' not found."
        )
    return apiary
