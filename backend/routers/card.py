
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.schemas import BlockCardRequest, BlockCardResponse
from backend.services import card_service
from backend.database import get_db

router = APIRouter(
    prefix="/cards",
    tags=["cards"],
)

@router.post("/block", response_model=BlockCardResponse)
def block_card(request: BlockCardRequest, db: Session = Depends(get_db)):
    try:
        response = card_service.block_card(db, request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
