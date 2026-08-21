from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from server.database import get_db
from server.models import LearningItem
from server.schemas import LearningItemResponse

router = APIRouter(prefix="/api/v1/learning-items", tags=["learning"])


@router.get("", response_model=List[LearningItemResponse])
def get_learning_items(db: Session = Depends(get_db)):
    items = db.query(LearningItem).all()
    return items
