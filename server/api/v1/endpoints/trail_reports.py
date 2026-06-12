from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas, models
from server.database import get_db

router = APIRouter()

@router.get("/trail_reports", response_model=List[schemas.TrailReportDetailResponse])
def read_trail_reports(db: Session = Depends(get_db)):
    reports = crud.get_all_trail_reports(db)
    result = []
    for r in reports:
        result.append(
            schemas.TrailReportDetailResponse(
                id=r.id,
                trail_id=r.trail_id,
                trail_name=r.trail.name if r.trail else "Unknown",
                user_id=r.user_id,
                reported_by=r.user.login_id if r.user else "Unknown",
                condition=r.condition,
                notes=r.notes,
                media_url=r.media_url,
                created_at=r.created_at
            )
        )
    return result

@router.post("/trail_reports", response_model=schemas.TrailReportResponse, status_code=status.HTTP_201_CREATED)
def create_trail_report(report: schemas.TrailReportCreate, db: Session = Depends(get_db)):
    # Check if trail exists
    db_trail = crud.get_trail_by_id(db, trail_id=report.trail_id)
    if not db_trail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trail not found"
        )
    
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.id == report.user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create report
    db_report = crud.create_trail_report(db, report=report)
    
    # Update trail status to the reported condition
    crud.update_trail_status(db, trail_id=report.trail_id, status=report.condition)
    
    return db_report
