from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from server.database import get_db
from server.models import Group, GroupMember
from server.schemas import GroupCreate, GroupResponse, GroupSummaryResponse

router = APIRouter(prefix="/groups", tags=["Groups"])


@router.post("", response_model=GroupResponse, status_code=status.HTTP_201_CREATED)
def create_group(group_in: GroupCreate, db: Session = Depends(get_db)):
    if not group_in.name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Group name cannot be empty.",
        )

    if not group_in.members or len(group_in.members) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Group must have at least one member.",
        )

    # Check for duplicate member names within request
    member_names = [m.name.strip().lower() for m in group_in.members]
    if len(member_names) != len(set(member_names)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Group member names must be unique within the group.",
        )

    new_group = Group(
        name=group_in.name.strip(),
        description=group_in.description.strip() if group_in.description else None,
    )
    db.add(new_group)
    db.flush()

    for m in group_in.members:
        member = GroupMember(
            group_id=str(new_group.id),
            name=m.name.strip(),
            email=m.email.strip() if m.email else None,
        )
        db.add(member)

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create group: {str(e)}",
        )

    db.refresh(new_group)
    return new_group


@router.get("", response_model=List[GroupSummaryResponse])
def list_groups(
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(100, ge=1, le=500, description="Limit for pagination"),
    db: Session = Depends(get_db),
):
    groups = (
        db.query(Group)
        .options(joinedload(Group.members), joinedload(Group.expenses))
        .order_by(Group.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    result = []
    for g in groups:
        total_spent = sum(float(e.total_amount) for e in g.expenses)
        result.append(
            GroupSummaryResponse(
                id=str(g.id),
                name=str(g.name),
                description=str(g.description) if g.description else None,
                created_at=g.created_at,
                updated_at=g.updated_at,
                member_count=len(g.members),
                total_spent=round(total_spent, 2),
                members=g.members,
            )
        )
    return result


@router.get("/{group_id}", response_model=GroupResponse)
def get_group(group_id: str, db: Session = Depends(get_db)):
    group = (
        db.query(Group)
        .options(joinedload(Group.members))
        .filter(Group.id == group_id)
        .first()
    )
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Group with ID {group_id} not found.",
        )
    return group
