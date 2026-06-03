
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database import get_db
from server.crud import tds_crud
from server.schemas import tds as tds_schema
from uuid import UUID

router = APIRouter()

@router.get("/configurations", response_model=tds_schema.TDSConfigurationsResponse)
def read_tds_configurations(db: Session = Depends(get_db)):
    configurations = tds_crud.get_tds_configurations(db)
    return {"configurations": configurations}

@router.put("/configurations/{config_id}", response_model=tds_schema.TDSConfiguration)
def update_tds_configuration(
    config_id: UUID, tds_configuration: tds_schema.TDSConfigurationUpdate, db: Session = Depends(get_db)
):
    db_tds_configuration = tds_crud.update_tds_configuration(
        db, config_id=config_id, tds_configuration=tds_configuration
    )
    if db_tds_configuration is None:
        raise HTTPException(status_code=404, detail="TDS Configuration not found")
    return db_tds_configuration
