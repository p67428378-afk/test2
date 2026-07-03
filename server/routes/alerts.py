from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Alert, SolarSystem, User
from server.schemas import AlertResponse
from server.auth import get_current_user

router = APIRouter()


@router.get("/alerts", response_model=List[AlertResponse])
def get_alerts(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if current_user.role == "technician":
        # Technicians can see all alerts
        alerts = db.query(Alert).all()
    else:
        # Owners see alerts for their systems
        alerts = (
            db.query(Alert)
            .join(SolarSystem)
            .filter(SolarSystem.user_id == current_user.id)
            .all()
        )

    return alerts
