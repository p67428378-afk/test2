
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.weather import ForecastGrid, ForecastGridCreate
from server.models.weather import ForecastGrid as ForecastGridModel
from server.services.auth import get_current_active_user
from server.schemas.user import User
import uuid

router = APIRouter()

@router.get("/forecasts/nwp-models")
def get_nwp_models(db: Session = Depends(get_db), models: str = '', region: str = '', variable: str = ''):
    # Mocked response
    return []

@router.get("/forecasts/grids", response_model=list[ForecastGrid])
def list_forecast_grids(db: Session = Depends(get_db)):
    return db.query(ForecastGridModel).all()

@router.put("/forecasts/grids/{grid_id}")
def update_forecast_grid(grid_id: uuid.UUID, grid: ForecastGridCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_grid = db.query(ForecastGridModel).filter(ForecastGridModel.id == grid_id).first()
    if not db_grid:
        raise HTTPException(status_code=404, detail="Grid not found")
    
    update_data = grid.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_grid, key, value)
    
    db.add(db_grid)
    db.commit()
    db.refresh(db_grid)
    return {"id": str(grid_id), "status": "updated"}
