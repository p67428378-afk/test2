
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.crud import water_usage as crud_water_usage
from server.schemas import water_usage as schema_water_usage
from server.database import get_db
import uuid
from datetime import date
from typing import List

router = APIRouter()

@router.get("/usage/{user_id}", response_model=List[schema_water_usage.WaterUsage])
def read_water_usage(
    user_id: uuid.UUID,
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db)
):
    usage_data = crud_water_usage.get_water_usage(
        db,
        user_id=user_id,
        start_date=start_date,
        end_date=end_date
    )
    if not usage_data:
        raise HTTPException(status_code=404, detail="User not found")
    return usage_data
