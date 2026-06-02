
from sqlalchemy.orm import Session
from server.models.water_usage import WaterUsage
from server.schemas.water_usage import WaterUsageCreate
from datetime import datetime, timedelta
import uuid

def create_water_usage(db: Session, usage: WaterUsageCreate):
    db_usage = WaterUsage(**usage.dict())
    db.add(db_usage)
    db.commit()
    db.refresh(db_usage)
    return db_usage

def get_water_usage(db: Session, user_id: uuid.UUID, start_date: datetime, end_date: datetime):
    return db.query(WaterUsage).filter(
        WaterUsage.user_id == user_id,
        WaterUsage.timestamp >= start_date,
        WaterUsage.timestamp <= end_date
    ).all()
