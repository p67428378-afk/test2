from fastapi import APIRouter, Query
from typing import Optional
from server.schemas.weather import VisualizationData

router = APIRouter()

@router.get("/visualization", response_model=VisualizationData)
async def get_visualization_data(
    data_types: str = Query(..., description="comma-separated list, e.g., 'radar,satellite,sensors'"),
    region: Optional[str] = Query(None, description="e.g., 'CONUS'"),
    timestamp: Optional[str] = Query(None, description="ISO 8601")
):
    # Mock data for demonstration
    return {
        "radar": {"type": "FeatureCollection", "features": []},
        "satellite": {"type": "FeatureCollection", "features": []},
        "sensors": {"type": "FeatureCollection", "features": []}
    }
