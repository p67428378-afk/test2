from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
from server import schemas, crud
from server.database import get_db

router = APIRouter()


@router.get("/pencils/categories", response_model=List[schemas.CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """
    Retrieve all pencil categories with their details.
    """
    try:
        categories = crud.get_categories(db)
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/pencils", response_model=schemas.PencilListResponse)
def get_pencils(
    category: Optional[str] = Query(
        None, description="Filter by category name or UUID"
    ),
    hardness: Optional[str] = Query(None, description="Filter by hardness"),
    material: Optional[str] = Query(None, description="Filter by material"),
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(
        10, ge=1, le=100, description="Maximum number of items to return"
    ),
    db: Session = Depends(get_db),
):
    """
    Retrieve a paginated list of pencils, optionally filtered by category, hardness, or material.
    """
    try:
        items, total = crud.get_pencils(
            db=db,
            category=category,
            hardness=hardness,
            material=material,
            skip=skip,
            limit=limit,
        )
        return schemas.PencilListResponse(
            items=items, total=total, skip=skip, limit=limit
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/pencils/{pencil_id}", response_model=schemas.PencilDetailResponse)
def get_pencil_by_id(pencil_id: UUID, db: Session = Depends(get_db)):
    """
    Retrieve detailed information for a specific pencil by its UUID.
    """
    try:
        pencil = crud.get_pencil(db, pencil_id)
        if not pencil:
            raise HTTPException(status_code=404, detail="Pencil not found")
        return pencil
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
