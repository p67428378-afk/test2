
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.weather import Warning, WarningCreate, WarningUpdate
from server.models.weather import WarningPolygon as WarningModel
from server.services.auth import get_current_active_user
from server.schemas.user import User
# from geoalchemy2.shape import from_shape
# from shapely.geometry import Polygon
import uuid

router = APIRouter()

@router.get("/warnings", response_model=list[Warning])
def get_warnings(db: Session = Depends(get_db), limit: int = 10, status: str = 'active'):
    statuses = status.split(',')
    return db.query(WarningModel).filter(WarningModel.status.in_(statuses)).limit(limit).all()

@router.post("/warnings", response_model=Warning)
def issue_warning(warning: WarningCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # polygon = Polygon(warning.polygon_coords)
    db_warning = WarningModel(
        user_id=current_user.id,
        warning_type=warning.warning_type,
        severity=warning.severity,
        # polygon=from_shape(polygon, srid=4326),
        issued_at=warning.start_time,
        expires_at=warning.end_time
    )
    db.add(db_warning)
    db.commit()
    db.refresh(db_warning)
    return db_warning

@router.put("/warnings/{warning_id}")
def update_warning(warning_id: uuid.UUID, warning_update: WarningUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_warning = db.query(WarningModel).filter(WarningModel.id == warning_id).first()
    if not db_warning:
        raise HTTPException(status_code=404, detail="Warning not found")

    if warning_update.action == 'cancel':
        db_warning.status = 'cancelled'
    elif warning_update.action == 'extend' and warning_update.new_end_time:
        db_warning.expires_at = warning_update.new_end_time
    
    db.add(db_warning)
    db.commit()
    db.refresh(db_warning)
    return {"id": str(warning_id), "status": db_warning.status}
