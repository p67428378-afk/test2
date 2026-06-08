from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.get("/pipelines", response_model=List[schemas.PipelineResponse])
def read_pipelines(db: Session = Depends(get_db)):
    # Seed database if empty
    crud.seed_db(db)
    return crud.get_pipelines(db)

@router.get("/pipelines/{id}/sensors", response_model=List[schemas.SensorResponse])
def read_pipeline_sensors(id: UUID, db: Session = Depends(get_db)):
    crud.seed_db(db)
    pipeline = crud.get_pipeline(db, id)
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    sensors = crud.get_sensors_by_pipeline(db, id)
    # For each sensor, we can populate readings_24h
    response_sensors = []
    for sensor in sensors:
        # Get readings for this sensor
        readings = sensor.pressure_readings
        # Sort readings by timestamp
        readings_sorted = sorted(readings, key=lambda r: r.timestamp)
        
        sensor_data = schemas.SensorResponse(
            id=sensor.id,
            pipeline_id=sensor.pipeline_id,
            type=sensor.type,
            location=sensor.location,
            current_reading=sensor.current_reading,
            status=sensor.status,
            readings_24h=[schemas.PressureReadingSchema(timestamp=r.timestamp, value=r.value) for r in readings_sorted]
        )
        response_sensors.append(sensor_data)
        
    return response_sensors
