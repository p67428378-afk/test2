from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from server import crud, schemas, models
from server.database import get_db
from server.routers.profiles import get_current_user

router = APIRouter(prefix="/api/v1/matches", tags=["matches"])


@router.get("", response_model=List[schemas.MatchResponse])
def get_matches(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    query: Optional[str] = Query(
        None, description="Search term for skill name or partner name"
    ),
    proficiency: Optional[str] = Query(
        None, description="Filter by proficiency level (BEGINNER, INTERMEDIATE, EXPERT)"
    ),
    reciprocal_only: bool = Query(False, description="Filter only reciprocal matches"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Query matching users based on skill intersections between skills to learn and teach.
    """
    return crud.find_matches_for_user(
        db=db,
        current_user_id=current_user.id,
        skip=skip,
        limit=limit,
        query=query,
        proficiency=proficiency,
        reciprocal_only=reciprocal_only,
    )
