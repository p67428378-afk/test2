from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas import RoutineCreate, RoutineResponse, RoutineUpdate
from server import crud

router = APIRouter(prefix="/api/v1/routines", tags=["Routines"])


@router.get("", response_model=List[RoutineResponse])
def list_routines(
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(20, ge=1, le=100, description="Limit per page"),
    db: Session = Depends(get_db),
):
    """List all saved custom yoga routines."""
    return crud.get_routines(db=db, skip=skip, limit=limit)


@router.post("", response_model=RoutineResponse, status_code=status.HTTP_201_CREATED)
def create_routine(
    routine_in: RoutineCreate,
    db: Session = Depends(get_db),
):
    """Create a new custom yoga routine with ordered pose items."""
    if not routine_in.items or len(routine_in.items) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Routine must contain at least one pose",
        )

    # Validate that all referenced poses exist
    for item in routine_in.items:
        pose = crud.get_pose_by_id(db=db, pose_id=item.pose_id)
        if not pose:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Pose with id '{item.pose_id}' does not exist in the catalog",
            )

    return crud.create_routine(db=db, routine_in=routine_in)


@router.get("/{routine_id}", response_model=RoutineResponse)
def get_routine(
    routine_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve details of a specific custom routine with its ordered sequence of poses."""
    routine = crud.get_routine_by_id(db=db, routine_id=routine_id)
    if not routine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routine not found",
        )
    return routine


@router.put("/{routine_id}", response_model=RoutineResponse)
def update_routine(
    routine_id: str,
    routine_in: RoutineUpdate,
    db: Session = Depends(get_db),
):
    """Update routine metadata and sequence items."""
    routine = crud.get_routine_by_id(db=db, routine_id=routine_id)
    if not routine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routine not found",
        )

    if routine_in.items is not None:
        if len(routine_in.items) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Routine must contain at least one pose",
            )
        for item in routine_in.items:
            pose = crud.get_pose_by_id(db=db, pose_id=item.pose_id)
            if not pose:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Pose with id '{item.pose_id}' does not exist in the catalog",
                )

    return crud.update_routine(db=db, db_routine=routine, routine_in=routine_in)


@router.post(
    "/{routine_id}/duplicate",
    response_model=RoutineResponse,
    status_code=status.HTTP_201_CREATED,
)
def duplicate_routine(
    routine_id: str,
    db: Session = Depends(get_db),
):
    """Duplicate an existing custom routine into a new variant."""
    routine = crud.get_routine_by_id(db=db, routine_id=routine_id)
    if not routine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routine not found",
        )
    return crud.duplicate_routine(db=db, db_routine=routine)


@router.delete("/{routine_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_routine(
    routine_id: str,
    db: Session = Depends(get_db),
):
    """Permanently delete a custom routine."""
    routine = crud.get_routine_by_id(db=db, routine_id=routine_id)
    if not routine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routine not found",
        )
    crud.delete_routine(db=db, db_routine=routine)
    return None
