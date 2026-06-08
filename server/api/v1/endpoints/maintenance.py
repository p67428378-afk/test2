from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.get("/maintenance", response_model=List[schemas.MaintenanceResponse])
def read_maintenance_orders(db: Session = Depends(get_db)):
    crud.seed_db(db)
    return crud.get_maintenance_orders(db)

@router.post("/maintenance", response_model=schemas.MaintenanceResponse)
def create_maintenance_order(order: schemas.MaintenanceCreateRequest, db: Session = Depends(get_db)):
    crud.seed_db(db)
    # Check if pipeline exists
    pipeline = crud.get_pipeline(db, order.pipeline_id)
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    # Check for scheduling conflict or invalid input data (e.g. empty description or assigned_to)
    if not order.description.strip() or not order.assigned_to.strip():
        raise HTTPException(status_code=400, detail="Invalid input data")
        
    return crud.create_maintenance_order(db, order)

@router.put("/maintenance/{id}", response_model=schemas.MaintenanceResponse)
def update_maintenance_order(id: UUID, update_data: schemas.MaintenanceUpdateRequest, db: Session = Depends(get_db)):
    crud.seed_db(db)
    order = crud.get_maintenance_order(db, id)
    if not order:
        raise HTTPException(status_code=404, detail="Work order not found")
        
    updated_order = crud.update_maintenance_order(db, id, update_data)
    return updated_order
