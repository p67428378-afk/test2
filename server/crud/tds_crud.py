
from sqlalchemy.orm import Session
from server.models.tds_configuration import TDSConfiguration
from server.schemas.tds import TDSConfigurationUpdate
from uuid import UUID

def get_tds_configurations(db: Session):
    return db.query(TDSConfiguration).all()

def get_tds_configuration(db: Session, config_id: UUID):
    return db.query(TDSConfiguration).filter(TDSConfiguration.id == config_id).first()

def update_tds_configuration(db: Session, config_id: UUID, tds_configuration: TDSConfigurationUpdate):
    db_tds_configuration = get_tds_configuration(db, config_id)
    if db_tds_configuration:
        db_tds_configuration.min_interest_threshold = tds_configuration.min_interest_threshold
        db_tds_configuration.tds_rate = tds_configuration.tds_rate
        db_tds_configuration.effective_date = tds_configuration.effective_date
        db.commit()
        db.refresh(db_tds_configuration)
    return db_tds_configuration
