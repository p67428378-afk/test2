from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Group, GroupMember
from server.schemas import (
    GroupCreate,
    GroupResponse,
    GroupMemberCreate,
    GroupMemberResponse,
    GroupBalancesResponse,
)
from server.services.balance_service import calculate_group_balances

router = APIRouter(prefix="/api/v1/groups", tags=["Groups"])


@router.post("", response_model=GroupResponse, status_code=status.HTTP_201_CREATED)
def create_group(group_in: GroupCreate, db: Session = Depends(get_db)):
    """Create a new expense group."""
    group = Group(
        name=group_in.name,
        description=group_in.description,
    )
    db.add(group)
    db.commit()
    db.refresh(group)
    return group


@router.get("", response_model=List[GroupResponse])
def list_groups(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """List all expense groups with pagination."""
    groups = db.query(Group).offset(skip).limit(limit).all()
    return groups


@router.get("/{group_id}", response_model=GroupResponse)
def get_group(group_id: str, db: Session = Depends(get_db)):
    """Retrieve group details along with member list."""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Group with ID '{group_id}' not found.",
        )
    return group


@router.post("/{group_id}/members", response_model=GroupMemberResponse, status_code=status.HTTP_201_CREATED)
def add_group_member(group_id: str, member_in: GroupMemberCreate, db: Session = Depends(get_db)):
    """Add a member to an existing group."""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Group with ID '{group_id}' not found.",
        )

    member = GroupMember(
        group_id=group_id,
        name=member_in.name,
        email=member_in.email,
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.get("/{group_id}/balances", response_model=GroupBalancesResponse)
def get_group_balances(group_id: str, db: Session = Depends(get_db)):
    """Calculate and return net balances and simplified debt settlement matrix."""
    try:
        balances = calculate_group_balances(db, group_id)
        return balances
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
