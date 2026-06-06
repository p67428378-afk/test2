
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas
from server.database import get_db
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[schemas.ExpiryAlert])
def get_expiry_alerts(db: Session = Depends(get_db)):
    alerts = crud.get_expiry_alerts(db)
    response_alerts = []
    for alert in alerts:
        alert.snack_name = alert.snack.name
        time_left = alert.expiry_date - datetime.utcnow()
        alert_status = "Expired"
        if time_left.days > 0:
            alert_status = f"{time_left.days} days left"
        response_alert = schemas.ExpiryAlert(
            **alert.__dict__,
            alert_status=alert_status
        )
        response_alerts.append(response_alert)
    return response_alerts
