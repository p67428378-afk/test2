from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/stats", response_model=schemas.StatsResponse)
def read_stats(db: Session = Depends(get_db)):
    try:
        stats = crud.get_stats(db)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
