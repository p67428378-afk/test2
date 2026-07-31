from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import schemas, crud, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_librarian
from typing import List
from uuid import UUID

router = APIRouter()


@router.get("/members", response_model=List[schemas.UserResponse])
def read_members(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    # Filter users by role 'member' or just return all users?
    # The requirement says "Get a list of all members". Let's return users with role 'member'.
    members = (
        db.query(models.User)
        .filter(models.User.role == "member")
        .offset(skip)
        .limit(limit)
        .all()
    )
    return members


@router.post(
    "/members", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED
)
def create_member(
    member: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    db_user = crud.get_user_by_email(db, email=member.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
    return crud.create_user(db, user=member)


@router.get("/members/{member_id}", response_model=schemas.UserResponse)
def read_member(
    member_id: UUID,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    db_user = crud.get_user_by_id(db, user_id=member_id)
    if not db_user or db_user.role != "member":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Member not found"
        )
    return db_user


@router.put("/members/{member_id}", response_model=schemas.UserResponse)
def update_member(
    member_id: UUID,
    member_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    db_user = crud.get_user_by_id(db, user_id=member_id)
    if not db_user or db_user.role != "member":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Member not found"
        )
    return crud.update_user(db, db_user=db_user, user_update=member_update)
