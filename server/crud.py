from sqlalchemy.orm import Session
from server import models, schemas

def create_alert_rule(db: Session, alert_rule: schemas.AlertRuleCreate):
    db_alert_rule = models.AlertRule(**alert_rule.model_dump())
    db.add(db_alert_rule)
    db.commit()
    db.refresh(db_alert_rule)
    return db_alert_rule
