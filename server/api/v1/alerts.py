from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.post("/low-balance", response_model=schemas.AlertRuleResponse)
def create_low_balance_alert(
    alert: schemas.AlertRuleCreate, db: Session = Depends(get_db)
):
    if not (100 <= alert.threshold_amount <= 10000):
        raise HTTPException(status_code=400, detail="Invalid input (e.g., threshold out of range)")

    try:
        created_rule = crud.create_alert_rule(db=db, alert_rule=alert)
        return schemas.AlertRuleResponse(
            status="ACTIVE",
            confirmed_threshold=created_rule.threshold_amount,
            delivery_channel=created_rule.delivery_channel,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
