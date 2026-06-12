from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

from server import schemas, crud
from server.database import get_db

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/plant-batches", response_model=List[schemas.PlantBatchResponse])
def list_plant_batches(db: Session = Depends(get_db)):
    try:
        batches = crud.get_plant_batches(db)
        response_batches = []
        for batch in batches:
            flower = crud.get_flower_by_id(db, batch.flower_id)
            flower_type = flower.flower_type if flower else "Unknown"
            
            latest_sensor = crud.get_latest_sensor_data(db, batch.batch_id)
            latest_sensor_data = None
            if latest_sensor:
                latest_sensor_data = schemas.LatestSensorData(
                    humidity=latest_sensor.humidity,
                    light_intensity=latest_sensor.light_intensity,
                    soil_moisture=latest_sensor.soil_moisture,
                    temperature=latest_sensor.temperature,
                    timestamp=latest_sensor.timestamp
                )
            
            response_batches.append(
                schemas.PlantBatchResponse(
                    batch_id=batch.batch_id,
                    flower_id=batch.flower_id,
                    flower_type=flower_type,
                    growth_stage=batch.growth_stage,
                    latest_sensor_data=latest_sensor_data,
                    created_at=batch.created_at,
                    updated_at=batch.updated_at
                )
            )
        return response_batches
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.post("/plant-batches", response_model=schemas.PlantBatchCreateResponse, status_code=status.HTTP_201_CREATED)
def create_plant_batch(batch: schemas.PlantBatchCreate, db: Session = Depends(get_db)):
    flower = crud.get_flower_by_id(db, batch.flower_id)
    if not flower:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid flower_id"
        )
    try:
        return crud.create_plant_batch(db, batch)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.put("/plant-batches/{batch_id}", response_model=schemas.PlantBatchCreateResponse)
def update_plant_batch(batch_id: str, batch_update: schemas.PlantBatchUpdate, db: Session = Depends(get_db)):
    db_batch = crud.get_plant_batch(db, batch_id)
    if not db_batch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plant batch not found"
        )
    try:
        return crud.update_plant_batch(db, db_batch, batch_update)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.post("/sensor-data", response_model=schemas.SensorDataResponse, status_code=status.HTTP_201_CREATED)
def submit_sensor_data(data: schemas.SensorDataCreate, db: Session = Depends(get_db)):
    batch = crud.get_plant_batch(db, data.batch_id)
    if not batch:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid batch_id"
        )
    
    # Check for low soil moisture alert
    if data.soil_moisture < 30.0:
        alert_msg = f"ALERT: Low soil moisture ({data.soil_moisture}%) detected for plant batch {data.batch_id}!"
        logger.warning(alert_msg)
        print(alert_msg)  # Ensure it's printed to stdout as well
        
    try:
        return crud.create_sensor_data(db, data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
