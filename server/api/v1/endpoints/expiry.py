from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/", response_model=list[schemas.ExpiryAlert])
def read_expiry_alerts(db: Session = Depends(get_db)):
    expiry_items = crud.get_expiry_alerts(db)
    alerts = []
    for item in expiry_items:
        alerts.append(
            schemas.ExpiryAlert(
                id=item.id,
                snack_name=item.snack.name,
                quantity=item.quantity,
                location=item.location,
                expiry_date=item.expiry_date,
                alert_status="critical" if item.expiry_date else "normal",
            )
        )
    return alerts
