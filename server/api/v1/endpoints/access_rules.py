from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.get("/access_rules", response_model=List[schemas.AccessRuleDetailResponse])
def read_access_rules(db: Session = Depends(get_db)):
    rules = crud.get_all_access_rules(db)
    result = []
    for r in rules:
        result.append(
            schemas.AccessRuleDetailResponse(
                id=r.id,
                trail_id=r.trail_id,
                trail_name=r.trail.name if r.trail else "Unknown",
                is_closed=r.is_closed,
                reason=r.reason,
                start_time=r.start_time,
                end_time=r.end_time,
                created_at=r.created_at
            )
        )
    return result

@router.post("/access_rules", response_model=schemas.AccessRuleResponse, status_code=status.HTTP_201_CREATED)
def create_access_rule(rule: schemas.AccessRuleCreate, db: Session = Depends(get_db)):
    # Check if trail exists
    db_trail = crud.get_trail_by_id(db, trail_id=rule.trail_id)
    if not db_trail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trail not found"
        )
    
    # Prevent opening a trail marked as Hazardous
    if not rule.is_closed and db_trail.status == "Hazardous":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot open a trail marked as Hazardous"
        )
    
    # Create access rule
    db_rule = crud.create_access_rule(db, rule=rule)
    
    # Update trail status based on the rule
    new_status = "Closed" if rule.is_closed else "Open"
    crud.update_trail_status(db, trail_id=rule.trail_id, status=new_status)
    
    return db_rule
