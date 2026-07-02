from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from server.app.database import get_db
from server.app.models import SLA
from server.app.schemas import SLACreate, SLAResponse

router = APIRouter()


@router.post("/slas", response_model=SLAResponse, status_code=status.HTTP_201_CREATED)
def create_sla(sla_in: SLACreate, db: Session = Depends(get_db)):
    existing_sla = db.query(SLA).filter(SLA.priority == sla_in.priority).first()
    if existing_sla:
        # Update existing SLA
        existing_sla.response_time = sla_in.response_time
        existing_sla.resolution_time = sla_in.resolution_time
        db.commit()
        db.refresh(existing_sla)
        return existing_sla

    db_sla = SLA(
        priority=sla_in.priority,
        response_time=sla_in.response_time,
        resolution_time=sla_in.resolution_time,
    )
    db.add(db_sla)
    db.commit()
    db.refresh(db_sla)
    return db_sla


@router.get("/slas", response_model=List[SLAResponse])
def list_slas(db: Session = Depends(get_db)):
    return db.query(SLA).order_by(SLA.priority).all()
