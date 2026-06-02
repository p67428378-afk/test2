
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.schemas.water_usage import WaterUsage
from server.crud import water_usage as crud_water_usage
from server.database import get_db
from uuid import UUID
from datetime import datetime
from typing import List

router = APIRouter()

@router.get("/{user_id}", response_model=List[WaterUsage])
def read_water_usage(
    user_id: UUID,
    start_date: datetime,
    end_date: datetime,
    db: Session = Depends(get_db)
):
    db_user = crud_water_usage.get_water_usage(db, user_id=user_id, start_date=start_date, end_date=end_date)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
