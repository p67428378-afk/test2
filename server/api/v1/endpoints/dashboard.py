from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from server import schemas, crud
from server.database import get_db

router = APIRouter()

@router.get("/dashboard/kpis", response_model=schemas.DashboardKPIsResponse)
def get_dashboard_kpis(db: Session = Depends(get_db)):
    try:
        return crud.get_kpis(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard/skus", response_model=schemas.SKUPerformanceResponse)
def get_dashboard_skus(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    try:
        items, total = crud.get_skus_performance(db, page=page, limit=limit)
        return {
            "items": items,
            "limit": limit,
            "page": page,
            "total": total
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
