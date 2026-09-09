import os
import json
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.responses import Response
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from server.database import get_db, init_db, seed_data, SessionLocal
from server import schemas, crud
from server.pdf_exporter import generate_routine_pdf


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB and seed initial data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Yoga Pose Dictionary & Custom Routine Builder API",
    version="2.0.0",
    description="API for managing yoga pose dictionaries, custom routine sequences, favorites, guided practice sessions, and PDF exports.",
    lifespan=lifespan,
)

# CORS Setup
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# HEALTH & STATUS ENDPOINTS
# ---------------------------------------------------------
@app.get("/", tags=["Health"])
def root():
    return {"message": "YogaFlow Studio API is running", "version": "2.0.0"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}


# ---------------------------------------------------------
# POSE ENDPOINTS
# ---------------------------------------------------------
@app.get("/api/v1/poses", response_model=List[schemas.PoseResponse], tags=["Poses"])
def list_poses(
    query: Optional[str] = Query(
        None, description="Search keyword in English or Sanskrit name"
    ),
    difficulty: Optional[str] = Query(
        None, description="Filter by difficulty (Beginner, Intermediate, Advanced)"
    ),
    category: Optional[str] = Query(
        None,
        description="Filter by category (Standing, Seated, Inversion, Balance, Restorative)",
    ),
    user_id: str = Query(
        "default_user", description="User ID for favorites resolution"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """Browse and search yoga poses with multi-criteria filtering."""
    poses = crud.get_poses(
        db=db,
        query=query,
        difficulty=difficulty,
        category=category,
        user_id=user_id,
        skip=skip,
        limit=limit,
    )
    return poses


@app.get(
    "/api/v1/poses/favorites",
    response_model=List[schemas.PoseResponse],
    tags=["Favorites"],
)
def list_favorite_poses(
    user_id: str = Query("default_user", description="User identifier"),
    db: Session = Depends(get_db),
):
    """Retrieve all poses bookmarked by the user."""
    return crud.get_favorite_poses(db=db, user_id=user_id)


@app.get("/api/v1/poses/{pose_id}", response_model=schemas.PoseResponse, tags=["Poses"])
def get_pose(
    pose_id: str,
    user_id: str = Query(
        "default_user", description="User ID for favorites resolution"
    ),
    db: Session = Depends(get_db),
):
    """Retrieve full detail and form guide for a specific yoga pose."""
    pose = crud.get_pose_by_id(db=db, pose_id=pose_id, user_id=user_id)
    if not pose:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Pose '{pose_id}' not found"
        )
    return pose


@app.post(
    "/api/v1/poses",
    response_model=schemas.PoseResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Poses"],
)
def create_new_pose(
    pose_in: schemas.PoseCreate,
    db: Session = Depends(get_db),
):
    """Create a new yoga pose in the dictionary."""
    created_pose = crud.create_pose(db=db, pose_in=pose_in)
    return crud.get_pose_by_id(db=db, pose_id=created_pose.id)


@app.post(
    "/api/v1/poses/{pose_id}/favorite",
    response_model=schemas.FavoriteActionResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Favorites"],
)
def add_favorite(
    pose_id: str,
    user_id: str = Query("default_user"),
    db: Session = Depends(get_db),
):
    """Bookmark a pose as favorite."""
    try:
        crud.add_pose_favorite(db=db, pose_id=pose_id, user_id=user_id)
        return {"message": "Pose bookmarked", "pose_id": pose_id}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@app.delete(
    "/api/v1/poses/{pose_id}/favorite",
    response_model=schemas.FavoriteActionResponse,
    tags=["Favorites"],
)
def remove_favorite(
    pose_id: str,
    user_id: str = Query("default_user"),
    db: Session = Depends(get_db),
):
    """Remove bookmark from a pose."""
    success = crud.remove_pose_favorite(db=db, pose_id=pose_id, user_id=user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Favorite for pose '{pose_id}' not found",
        )
    return {"message": "Pose removed from favorites", "pose_id": pose_id}


# ---------------------------------------------------------
# ROUTINE ENDPOINTS
# ---------------------------------------------------------
@app.get(
    "/api/v1/routines", response_model=List[schemas.RoutineResponse], tags=["Routines"]
)
def list_routines(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List saved custom yoga routines."""
    return crud.get_routines(db=db, skip=skip, limit=limit)


@app.post(
    "/api/v1/routines",
    response_model=schemas.RoutineResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Routines"],
)
def create_routine(
    routine_in: schemas.RoutineCreate,
    db: Session = Depends(get_db),
):
    """Create a new custom routine with sequence items."""
    try:
        routine = crud.create_routine(db=db, routine_in=routine_in)
        return routine
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.get(
    "/api/v1/routines/{routine_id}",
    response_model=schemas.RoutineResponse,
    tags=["Routines"],
)
def get_routine(
    routine_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve details of a specific custom routine."""
    routine = crud.get_routine_by_id(db=db, routine_id=routine_id)
    if not routine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Routine '{routine_id}' not found",
        )
    return routine


@app.put(
    "/api/v1/routines/{routine_id}",
    response_model=schemas.RoutineResponse,
    tags=["Routines"],
)
def update_routine(
    routine_id: str,
    routine_in: schemas.RoutineUpdate,
    db: Session = Depends(get_db),
):
    """Update routine metadata and sequence items."""
    try:
        updated = crud.update_routine(
            db=db, routine_id=routine_id, routine_in=routine_in
        )
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Routine '{routine_id}' not found",
            )
        return updated
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.post(
    "/api/v1/routines/{routine_id}/duplicate",
    response_model=schemas.RoutineResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Routines"],
)
def duplicate_routine(
    routine_id: str,
    db: Session = Depends(get_db),
):
    """Duplicate an existing custom routine."""
    new_routine = crud.duplicate_routine(db=db, routine_id=routine_id)
    if not new_routine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Routine '{routine_id}' not found",
        )
    return new_routine


@app.delete("/api/v1/routines/{routine_id}", tags=["Routines"])
def delete_routine(
    routine_id: str,
    db: Session = Depends(get_db),
):
    """Permanently delete a custom routine."""
    success = crud.delete_routine(db=db, routine_id=routine_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Routine '{routine_id}' not found",
        )
    return {"message": "Routine deleted successfully", "id": routine_id}


@app.get("/api/v1/routines/{routine_id}/export", tags=["Routines"])
def export_routine(
    routine_id: str,
    format: str = Query("pdf", description="Export format: 'pdf' or 'json'"),
    db: Session = Depends(get_db),
):
    """Export a routine as printable PDF cheat-sheet or downloadable JSON."""
    routine = crud.get_routine_by_id(db=db, routine_id=routine_id)
    if not routine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Routine '{routine_id}' not found",
        )

    if format.lower() == "json":
        routine_dict = {
            "id": routine.id,
            "name": routine.name,
            "description": routine.description,
            "total_duration_seconds": routine.total_duration_seconds,
            "poses": [
                {
                    "sequence_order": rp.sequence_order,
                    "hold_duration_seconds": rp.hold_duration_seconds,
                    "transition_notes": rp.transition_notes,
                    "pose": {
                        "english_name": rp.pose.english_name if rp.pose else "",
                        "sanskrit_name": rp.pose.sanskrit_name if rp.pose else "",
                        "difficulty": rp.pose.difficulty if rp.pose else "",
                        "category": rp.pose.category if rp.pose else "",
                        "alignment_cues": rp.pose.alignment_cues if rp.pose else "",
                        "breath_instructions": rp.pose.breath_instructions
                        if rp.pose
                        else "",
                    },
                }
                for rp in (routine.poses or [])
            ],
        }
        json_content = json.dumps(routine_dict, indent=2)
        safe_name = "".join(
            c for c in routine.name if c.isalnum() or c in ("-", "_")
        ).rstrip()
        filename = f"{safe_name or 'routine'}.json"
        return Response(
            content=json_content,
            media_type="application/json",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )

    # PDF format
    pdf_bytes = generate_routine_pdf(routine)
    safe_name = "".join(
        c for c in routine.name if c.isalnum() or c in ("-", "_")
    ).rstrip()
    filename = f"{safe_name or 'routine'}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ---------------------------------------------------------
# PRACTICE SESSION ENDPOINTS
# ---------------------------------------------------------
@app.post(
    "/api/v1/practice-sessions",
    response_model=schemas.PracticeSessionResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Practice Sessions"],
)
def log_practice_session(
    session_in: schemas.PracticeSessionCreate,
    db: Session = Depends(get_db),
):
    """Log a completed guided practice session."""
    session = crud.create_practice_session(db=db, session_in=session_in)
    sessions = crud.get_practice_sessions(db=db, user_id=session.user_id, limit=1)
    if sessions and sessions[0]["id"] == session.id:
        return sessions[0]
    return {
        "id": session.id,
        "user_id": session.user_id,
        "routine_id": session.routine_id,
        "completed_duration_seconds": session.completed_duration_seconds,
        "poses_completed": session.poses_completed,
        "notes": session.notes,
        "completed_at": session.completed_at,
        "routine_name": session.routine.name if session.routine else "Custom Flow",
    }


@app.get(
    "/api/v1/practice-sessions",
    response_model=List[schemas.PracticeSessionResponse],
    tags=["Practice Sessions"],
)
def list_practice_sessions(
    user_id: str = Query("default_user", description="User identifier"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List completed practice sessions."""
    return crud.get_practice_sessions(db=db, user_id=user_id, skip=skip, limit=limit)
