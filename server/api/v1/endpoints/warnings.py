from fastapi import APIRouter, Query, Path
from typing import List, Optional
import uuid
from server.schemas.weather import Warning, WarningCreate, WarningUpdate

router = APIRouter()

@router.get("", response_model=List[Warning])
async def get_warnings(
    limit: Optional[int] = Query(None),
    status: Optional[str] = Query(None, description="e.g., 'active,expired'")
):
    # Mock data
    return []

@router.post("")
async def issue_warning(warning: WarningCreate):
    return {"id": uuid.uuid4(), "status": "issued", "dissemination_status": "pending"}

@router.put("/{warning_id}")
async def update_warning(
    warning_id: uuid.UUID = Path(...),
    update: WarningUpdate = ...
):
    return {"id": warning_id, "status": update.action}
