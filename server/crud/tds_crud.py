from sqlalchemy.orm import Session
from server.models.tds_configuration import TDSConfiguration
from server.schemas.tds import TDSConfigurationCreate, TDSConfigurationUpdate
import uuid

def create_tds_configuration(db: Session, tds_configuration: TDSConfigurationCreate):
    db_tds_configuration = TDSConfiguration(**tds_configuration.dict())
    db.add(db_tds_configuration)
    db.commit()
    db.refresh(db_tds_configuration)
    return db_tds_configuration

def get_tds_configurations(db: Session):
    return db.query(TDSConfiguration).all()

def get_tds_configuration(db: Session, config_id: uuid.UUID):
    return db.query(TDSConfiguration).filter(TDSConfiguration.id == config_id).first()

def update_tds_configuration(db: Session, config_id: uuid.UUID, tds_configuration: TDSConfigurationUpdate):
    db_tds_configuration = get_tds_configuration(db, config_id)
    if db_tds_configuration:
        update_data = tds_configuration.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_tds_configuration, key, value)
        db.commit()
        db.refresh(db_tds_configuration)
    return db_tds_configuration
