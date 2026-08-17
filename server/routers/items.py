from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from server.database import get_db
from server.models import User
from server.schemas import ItemCreate, ItemResponse
from server.security import get_current_active_user
from server.crud import create_item, get_item, get_items, create_history_entry

router = APIRouter(prefix="/api/v1/items", tags=["items"])


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def report_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    # Validate required fields
    if not item.category or not item.location or not item.date_incident:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Category, location, and date_incident are required fields.",
        )

    # Validate image size limit (5MB)
    for img in item.images:
        if img.file_size_mb > 5.0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image upload exceeds size limit of 5MB.",
            )

    try:
        db_item = create_item(db, item, current_user.id)
        db.flush()  # Get the item ID

        # Create history entry
        create_history_entry(
            db,
            item_id=db_item.id,
            actor_id=current_user.id,
            action="Report Created",
            details=f"Item reported as {db_item.type} by {current_user.full_name}.",
        )

        db.commit()
        db.refresh(db_item)
        return db_item
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to report item: {str(e)}",
        )


@router.get("", response_model=List[ItemResponse])
def list_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    type: Optional[str] = Query(None, description="'lost' or 'found'"),
    status: Optional[str] = Query(
        None, description="'unclaimed', 'claimed', 'reunited'"
    ),
    db: Session = Depends(get_db),
):
    return get_items(db, skip=skip, limit=limit, type_filter=type, status_filter=status)


@router.get("/{item_id}", response_model=ItemResponse)
def get_item_details(item_id: str, db: Session = Depends(get_db)):
    db_item = get_item(db, item_id)
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found."
        )
    return db_item
