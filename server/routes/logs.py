from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from server.database import get_db
from server.models import ValidationLog
from server.schemas import ValidationLogResponse

router = APIRouter()


@router.get("/validation-logs", response_model=List[ValidationLogResponse])
def get_validation_logs(db: Session = Depends(get_db)):
    return db.query(ValidationLog).order_by(ValidationLog.timestamp.desc()).all()
