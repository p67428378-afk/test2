from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, schemas, database
from .auth import get_current_user

router = APIRouter(prefix="/api/v1/items", tags=["items"])


@router.post(
    "", response_model=schemas.ItemResponse, status_code=status.HTTP_201_CREATED
)
def create_item(
    item: schemas.ItemCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    return crud.create_item(db=db, item=item, user_id=current_user.id)


@router.get("", response_model=List[schemas.ItemResponse])
def read_items(
    item_type: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
):
    return crud.get_items(
        db=db,
        item_type=item_type,
        category=category,
        status=status,
        skip=skip,
        limit=limit,
    )


@router.get("/{item_id}", response_model=schemas.ItemResponse)
def read_item(item_id: str, db: Session = Depends(database.get_db)):
    db_item = crud.get_item(db=db, item_id=item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item


@router.get("/{item_id}/matches", response_model=List[schemas.MatchResponse])
def read_item_matches(item_id: str, db: Session = Depends(database.get_db)):
    db_item = crud.get_item(db=db, item_id=item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return crud.get_item_matches(db=db, item_id=item_id)
