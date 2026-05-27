
from sqlalchemy.orm import Session
from server import models, schemas

def get_alert_rule_by_account_number(db: Session, account_number: str):
    return db.query(models.AlertRule).filter(models.AlertRule.account_number == account_number).first()

def create_alert_rule(db: Session, alert_rule: schemas.AlertRuleCreate):
    db_alert_rule = models.AlertRule(
        account_number=alert_rule.account_number,
        threshold_amount=alert_rule.threshold_amount,
        delivery_channel=alert_rule.delivery_channel
    )
    db.add(db_alert_rule)
    db.commit()
    db.refresh(db_alert_rule)
    return db_alert_rule
