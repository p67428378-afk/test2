from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from server.app import schemas, crud
from server.app.database import get_db

router = APIRouter(
    prefix="/bodies",
    tags=["bodies"]
)

@router.post("", response_model=schemas.BodyResponse, status_code=status.HTTP_201_CREATED)
def create_body(body: schemas.BodyCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_body(db=db, body=body)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid input data: {str(e)}"
        )

@router.get("", response_model=List[schemas.BodyResponse])
def list_bodies(
    skip: int = 0,
    limit: int = 20,
    status: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return crud.get_bodies(db=db, skip=skip, limit=limit, status=status, location=location)

@router.get("/{body_id}", response_model=schemas.BodyResponse)
def get_body(body_id: UUID, db: Session = Depends(get_db)):
    db_body = crud.get_body(db=db, body_id=body_id)
    if not db_body:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Body not found"
        )
    return db_body

@router.put("/{body_id}", response_model=schemas.BodyResponse)
def update_body(body_id: UUID, body_update: schemas.BodyUpdate, db: Session = Depends(get_db)):
    db_body = crud.update_body(db=db, body_id=body_id, body_update=body_update)
    if not db_body:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Body not found"
        )
    return db_body
