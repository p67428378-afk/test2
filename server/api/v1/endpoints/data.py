
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.weather import VisualizationData

router = APIRouter()

@router.get("/data/visualization", response_model=VisualizationData)
def get_visualization_data(db: Session = Depends(get_db), data_types: str = '', region: str = '', timestamp: str = ''):
    # Mocked response
    return {
        "radar": {"type": "FeatureCollection", "features": []},
        "satellite": {"type": "FeatureCollection", "features": []},
        "sensors": {"type": "FeatureCollection", "features": []}
    }
