
from sqlalchemy.orm import Session
from server.models.water_usage import WaterUsage
from server.schemas.water_usage import WaterUsageCreate
from uuid import UUID
from datetime import datetime

def get_water_usage(db: Session, user_id: UUID, start_date: datetime, end_date: datetime):
    return db.query(WaterUsage).filter(
        WaterUsage.user_id == user_id,
        WaterUsage.timestamp >= start_date,
        WaterUsage.timestamp <= end_date
    ).all()

def create_water_usage(db: Session, water_usage: WaterUsageCreate):
    db_water_usage = WaterUsage(**water_usage.dict())
    db.add(db_water_usage)
    db.commit()
    db.refresh(db_water_usage)
    return db_water_usage
