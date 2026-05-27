
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.post("/low-balance", response_model=schemas.AlertRuleResponse)
def create_low_balance_alert(alert: schemas.AlertRuleCreate, db: Session = Depends(get_db)):
    """
    Endpoint to set up a low balance alert.

    - Validates threshold amount (100 <= amount <= 10000).
    - Checks for existing alert rule for the account.
    - Creates a new alert rule.
    """
    if not (100 <= alert.threshold_amount <= 10000):
        raise HTTPException(status_code=400, detail="Threshold amount must be between 100 and 10,000.")

    db_alert_rule = crud.get_alert_rule_by_account_number(db, account_number=alert.account_number)
    if db_alert_rule:
        # For simplicity, we'll update the existing rule. 
        # A real-world app might have more complex logic.
        db_alert_rule.threshold_amount = alert.threshold_amount
        db_alert_rule.delivery_channel = alert.delivery_channel
        db.commit()
        db.refresh(db_alert_rule)
        created_rule = db_alert_rule
    else:
        created_rule = crud.create_alert_rule(db=db, alert_rule=alert)

    return schemas.AlertRuleResponse(
        status=created_rule.status,
        confirmed_threshold=created_rule.threshold_amount,
        delivery_channel=created_rule.delivery_channel
    )
