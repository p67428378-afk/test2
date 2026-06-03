from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database import get_db
from server.crud import tds_crud
from server.schemas.tds import TDSConfiguration, TDSConfigurationCreate, TDSConfigurationUpdate, TDSConfigurationsResponse
import uuid

router = APIRouter()

@router.get("/configurations", response_model=TDSConfigurationsResponse)
def read_tds_configurations(db: Session = Depends(get_db)):
    configurations = tds_crud.get_tds_configurations(db)
    return {"configurations": configurations}

@router.put("/configurations/{config_id}", response_model=TDSConfiguration)
def update_tds_configuration(config_id: uuid.UUID, tds_configuration: TDSConfigurationUpdate, db: Session = Depends(get_db)):
    db_tds_configuration = tds_crud.update_tds_configuration(db, config_id=config_id, tds_configuration=tds_configuration)
    if db_tds_configuration is None:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return db_tds_configuration
