from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from server.database import get_db
from server import crud, schemas

router = APIRouter(prefix="/expeditions", tags=["expeditions"])


@router.post(
    "", response_model=schemas.ExpeditionResponse, status_code=status.HTTP_201_CREATED
)
def create_expedition(
    expedition: schemas.ExpeditionCreate, db: Session = Depends(get_db)
):
    # Check if schedule exists
    db_schedule = crud.get_schedule(db=db, schedule_id=expedition.schedule_id)
    if db_schedule is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found"
        )

    # Validate date range
    if expedition.end_date < expedition.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="end_date cannot be before start_date",
        )

    return crud.create_expedition(db=db, expedition=expedition)


@router.get("", response_model=List[schemas.ExpeditionResponse])
def read_expeditions(
    schedule_id: Optional[UUID] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return crud.get_expeditions(db=db, schedule_id=schedule_id, skip=skip, limit=limit)


@router.post(
    "/{expedition_id}/crew",
    response_model=schemas.CrewAssignmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def assign_crew(
    expedition_id: UUID,
    assignment: schemas.CrewAssignmentCreate,
    db: Session = Depends(get_db),
):
    # Check if expedition exists
    db_expedition = crud.get_expedition(db=db, expedition_id=expedition_id)
    if db_expedition is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Expedition not found"
        )

    # Check if crew member exists
    db_crew = crud.get_crew_member(db=db, crew_id=assignment.crew_id)
    if db_crew is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Crew member not found"
        )

    # Check if already assigned
    from server.models import ExpeditionCrew

    existing = (
        db.query(ExpeditionCrew)
        .filter(
            ExpeditionCrew.expedition_id == expedition_id,
            ExpeditionCrew.crew_id == assignment.crew_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Crew member already assigned to this expedition",
        )

    db_assignment = crud.assign_crew_to_expedition(
        db=db,
        expedition_id=expedition_id,
        crew_id=assignment.crew_id,
        role=assignment.role,
    )
    return schemas.CrewAssignmentResponse(
        crew_id=db_assignment.crew_id,
        expedition_id=db_assignment.expedition_id,
        role=db_assignment.role,
    )


@router.get("/{expedition_id}/crew", response_model=List[schemas.CrewWithRoleResponse])
def read_expedition_crew(expedition_id: UUID, db: Session = Depends(get_db)):
    # Check if expedition exists
    db_expedition = crud.get_expedition(db=db, expedition_id=expedition_id)
    if db_expedition is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Expedition not found"
        )

    assignments = crud.get_expedition_crew(db=db, expedition_id=expedition_id)
    result = []
    for asn in assignments:
        crew_member = crud.get_crew_member(db=db, crew_id=asn.crew_id)
        if crew_member:
            result.append(
                schemas.CrewWithRoleResponse(
                    id=crew_member.id,
                    first_name=crew_member.first_name,
                    last_name=crew_member.last_name,
                    certification=crew_member.certification,
                    role=asn.role,
                )
            )
    return result
