import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.team import ExcavationTeam, TeamMember
from server.schemas.team import TeamCreate, TeamResponse, MemberCreate, MemberResponse

router = APIRouter(prefix="/teams", tags=["Teams"])


@router.get("", response_model=List[TeamResponse])
def get_teams(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1), db: Session = Depends(get_db)):
    return db.query(ExcavationTeam).offset(skip).limit(limit).all()


@router.get("/members/all", response_model=List[MemberResponse])
def get_all_members(db: Session = Depends(get_db)):
    return db.query(TeamMember).all()


@router.post("", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
def create_team(team_in: TeamCreate, db: Session = Depends(get_db)):
    existing = db.query(ExcavationTeam).filter(ExcavationTeam.unit_code == team_in.unit_code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Team with unit code '{team_in.unit_code}' already exists")

    new_team = ExcavationTeam(
        id=str(uuid.uuid4()),
        name=team_in.name,
        unit_code=team_in.unit_code,
        site_id=team_in.site_id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    return new_team


@router.get("/{team_id}", response_model=TeamResponse)
def get_team(team_id: str, db: Session = Depends(get_db)):
    team = db.query(ExcavationTeam).filter(ExcavationTeam.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail=f"Team with id {team_id} not found")
    return team


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(team_id: str, db: Session = Depends(get_db)):
    team = db.query(ExcavationTeam).filter(ExcavationTeam.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail=f"Team with id {team_id} not found")
    db.delete(team)
    db.commit()
    return None


@router.post("/{team_id}/members", response_model=MemberResponse, status_code=status.HTTP_201_CREATED)
def add_member_to_team(team_id: str, member_in: MemberCreate, db: Session = Depends(get_db)):
    team = db.query(ExcavationTeam).filter(ExcavationTeam.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail=f"Team with id {team_id} not found")

    new_member = TeamMember(
        id=str(uuid.uuid4()),
        team_id=team_id,
        full_name=member_in.full_name,
        role=member_in.role,
        email=member_in.email,
        phone=member_in.phone,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member


@router.get("/{team_id}/members", response_model=List[MemberResponse])
def get_team_members(team_id: str, db: Session = Depends(get_db)):
    team = db.query(ExcavationTeam).filter(ExcavationTeam.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail=f"Team with id {team_id} not found")
    return team.members
