from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from server.database import get_db
from server import models, schemas, auth
from server.websocket import manager

router = APIRouter()


class LoginRequest(schemas.BaseModel):
    username: str
    password: str


@router.post("/auth/token", response_model=schemas.Token)
def login_for_access_token(request: LoginRequest, db: Session = Depends(get_db)):
    user = (
        db.query(models.User).filter(models.User.username == request.username).first()
    )
    if not user or not auth.verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password",
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/worklist", response_model=List[schemas.WorklistItemResponse])
def get_worklist(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    items = (
        db.query(models.WorklistItem)
        .filter(models.WorklistItem.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return items


@router.post(
    "/worklist",
    response_model=schemas.WorklistItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_worklist_item(
    item: schemas.WorklistItemCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    db_item = models.WorklistItem(
        name=item.name,
        status=item.status,
        due_date=item.due_date,
        user_id=current_user.id,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@router.put("/worklist/{task_id}", response_model=schemas.WorklistItemResponse)
async def update_worklist_item_status(
    task_id: UUID,
    payload: schemas.WorklistItemUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    if payload.status not in ["To Do", "In Progress", "Done"]:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid status value",
        )

    item = (
        db.query(models.WorklistItem)
        .filter(
            models.WorklistItem.id == task_id,
            models.WorklistItem.user_id == current_user.id,
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to the user",
        )

    item.status = payload.status
    db.commit()
    db.refresh(item)

    # Broadcast real-time update
    await manager.broadcast(
        {
            "type": "task_updated",
            "task_id": str(item.id),
            "status": item.status,
            "updated_by": str(current_user.id),
        }
    )

    return item
