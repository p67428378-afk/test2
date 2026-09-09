from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas import PoseCreate, PoseResponse, PoseUpdate
from server import crud

router = APIRouter(prefix="/api/v1/poses", tags=["Poses"])


@router.get("", response_model=List[PoseResponse])
def list_poses(
    query: Optional[str] = Query(
        None, description="Search keyword in English or Sanskrit name"
    ),
    category: Optional[str] = Query(
        None,
        description="Filter by category (Standing, Seated, Inversion, Balance, Restorative)",
    ),
    difficulty: Optional[str] = Query(
        None, description="Filter by difficulty (Beginner, Intermediate, Advanced)"
    ),
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(20, ge=1, le=100, description="Limit per page"),
    db: Session = Depends(get_db),
):
    """Browse and search yoga poses with dual-language keyword and category/difficulty filters."""
    poses = crud.get_poses(
        db=db,
        query=query,
        category=category,
        difficulty=difficulty,
        skip=skip,
        limit=limit,
    )
    return poses


@router.get("/{pose_id}", response_model=PoseResponse)
def get_pose_detail(
    pose_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve comprehensive pose form guide and details."""
    pose = crud.get_pose_by_id(db=db, pose_id=pose_id)
    if not pose:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pose not found",
        )
    return pose


@router.post("", response_model=PoseResponse, status_code=status.HTTP_201_CREATED)
def create_new_pose(
    pose_in: PoseCreate,
    db: Session = Depends(get_db),
):
    """Create a new pose entry in the yoga catalog."""
    return crud.create_pose(db=db, pose_in=pose_in)


@router.put("/{pose_id}", response_model=PoseResponse)
def update_pose_detail(
    pose_id: str,
    pose_in: PoseUpdate,
    db: Session = Depends(get_db),
):
    """Update details of an existing yoga pose."""
    pose = crud.get_pose_by_id(db=db, pose_id=pose_id)
    if not pose:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pose not found",
        )
    return crud.update_pose(db=db, db_pose=pose, pose_in=pose_in)
