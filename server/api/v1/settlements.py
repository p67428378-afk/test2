from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas import SettlementResponse
from server.services.settlement_service import SettlementService

router = APIRouter(tags=["Settlements"])


@router.get("/groups/{group_id}/settlements", response_model=SettlementResponse)
def get_group_settlements(group_id: str, db: Session = Depends(get_db)):
    settlement_data = SettlementService.calculate_group_settlements(
        db=db, group_id=group_id
    )
    return settlement_data
