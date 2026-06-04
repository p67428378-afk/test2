from fastapi import APIRouter, Query, Path
from typing import List, Optional
import uuid
from server.schemas.weather import NWPModelOutput, ForecastGrid, ForecastGridUpdate

router = APIRouter()

@router.get("/nwp-models", response_model=List[NWPModelOutput])
async def get_nwp_models(
    models: str = Query(..., description="comma-separated, e.g., 'GFS,ECMWF'"),
    region: Optional[str] = Query(None),
    variable: str = Query(..., description="e.g., 'temperature_2m'")
):
    # Mock data
    return []

@router.get("/grids", response_model=List[ForecastGrid])
async def list_forecast_grids():
    # Mock data
    return []

@router.put("/grids/{grid_id}")
async def update_forecast_grid(
    grid_id: uuid.UUID = Path(...),
    update: ForecastGridUpdate = ...
):
    return {"id": grid_id, "status": "updated"}
