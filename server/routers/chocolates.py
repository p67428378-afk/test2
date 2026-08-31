from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.crud import create_chocolate, get_chocolate_by_id, get_chocolates
from server.database import get_db
from server.schemas import ChocolateCreate, ChocolateResponse

router = APIRouter(prefix="/api/v1/chocolates", tags=["Chocolates"])


@router.get("", response_model=List[ChocolateResponse])
def list_chocolates(
    min_cocoa: Optional[int] = Query(
        None, ge=50, le=100, description="Minimum cocoa percentage"
    ),
    max_cocoa: Optional[int] = Query(
        None, ge=50, le=100, description="Maximum cocoa percentage"
    ),
    origin: Optional[str] = Query(None, description="Filter by origin region"),
    flavor: Optional[str] = Query(None, description="Filter by flavor notes"),
    dietary: Optional[str] = Query(None, description="Filter by dietary flags"),
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(
        50, ge=1, le=100, description="Maximum number of items to return"
    ),
    db: Session = Depends(get_db),
):
    return get_chocolates(
        db=db,
        min_cocoa=min_cocoa,
        max_cocoa=max_cocoa,
        origin=origin,
        flavor=flavor,
        dietary=dietary,
        skip=skip,
        limit=limit,
    )


@router.get("/{chocolate_id}", response_model=ChocolateResponse)
def get_chocolate(chocolate_id: str, db: Session = Depends(get_db)):
    chocolate = get_chocolate_by_id(db=db, chocolate_id=chocolate_id)
    if not chocolate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chocolate with ID '{chocolate_id}' not found",
        )
    return chocolate


@router.post("", response_model=ChocolateResponse, status_code=status.HTTP_201_CREATED)
def add_chocolate(chocolate_in: ChocolateCreate, db: Session = Depends(get_db)):
    return create_chocolate(db=db, chocolate_in=chocolate_in)
