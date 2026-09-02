import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import ExcavationTeam, TeamMember, ExcavationSite
from server.schemas import (
    TeamCreate,
    TeamResponse,
    TeamListResponse,
    TeamMemberCreate,
    TeamMemberResponse,
)

router = APIRouter(prefix="/api/v1/teams", tags=["Excavation Teams"])


@router.post("", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
def create_team(team_in: TeamCreate, db: Session = Depends(get_db)):
    if team_in.site_id:
        site = db.query(ExcavationSite).filter(ExcavationSite.id == team_in.site_id).first()
        if not site:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Excavation site '{team_in.site_id}' does not exist"
            )

    new_team = ExcavationTeam(
        id=str(uuid.uuid4()),
        team_name=team_in.team_name,
        site_id=team_in.site_id,
    )
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    return new_team


@router.get("", response_model=TeamListResponse)
def list_teams(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    site_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(ExcavationTeam)
    if site_id:
        query = query.filter(ExcavationTeam.site_id == site_id)

    total = query.count()
    items = query.order_by(ExcavationTeam.created_at.desc()).offset(skip).limit(limit).all()
    return TeamListResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/members/all", response_model=List[TeamMemberResponse])
def list_all_members(db: Session = Depends(get_db)):
    """List all team members across all teams."""
    return db.query(TeamMember).order_by(TeamMember.full_name.asc()).all()


@router.get("/{team_id}", response_model=TeamResponse)
def get_team(team_id: str, db: Session = Depends(get_db)):
    team = db.query(ExcavationTeam).filter(ExcavationTeam.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Excavation team '{team_id}' not found"
        )
    return team


@router.post("/{team_id}/members", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
def assign_member_to_team(team_id: str, member_in: TeamMemberCreate, db: Session = Depends(get_db)):
    team = db.query(ExcavationTeam).filter(ExcavationTeam.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Excavation team '{team_id}' not found"
        )

    new_member = TeamMember(
        id=str(uuid.uuid4()),
        team_id=team_id,
        full_name=member_in.full_name,
        role=member_in.role,
        email=member_in.email,
        phone=member_in.phone,
    )
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member


@router.get("/{team_id}/members", response_model=List[TeamMemberResponse])
def get_team_members(team_id: str, db: Session = Depends(get_db)):
    team = db.query(ExcavationTeam).filter(ExcavationTeam.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Excavation team '{team_id}' not found"
        )
    return team.members


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(team_id: str, db: Session = Depends(get_db)):
    team = db.query(ExcavationTeam).filter(ExcavationTeam.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Excavation team '{team_id}' not found"
        )
    db.delete(team)
    db.commit()
    return None
