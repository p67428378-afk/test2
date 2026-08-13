from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Performance, Artist, Stage
from server.schemas import (
    PerformanceCreate,
    PerformanceResponse,
    ArtistCreate,
    ArtistResponse,
    StageCreate,
    StageOut,
)
from server.auth import require_role

router = APIRouter(prefix="/api/v1", tags=["Scheduling & Stage Allocation"])


# --- Performance Scheduling ---
@router.get("/performances", response_model=List[PerformanceResponse])
def list_performances(
    stage_id: Optional[str] = None,
    artist_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Performance)
    if stage_id:
        query = query.filter(Performance.stage_id == stage_id)
    if artist_id:
        query = query.filter(Performance.artist_id == artist_id)
    performances = query.all()

    result = []
    for p in performances:
        resp = PerformanceResponse(
            id=str(p.id),
            artist_id=str(p.artist_id),
            stage_id=str(p.stage_id),
            start_time=p.start_time,
            end_time=p.end_time,
            status=p.status,
            created_at=p.created_at,
            artist=ArtistResponse(
                id=str(p.artist.id),
                name=p.artist.name,
                genre=p.artist.genre,
                contact_email=p.artist.contact_email,
                created_at=p.artist.created_at,
            )
            if p.artist
            else None,
            stage=StageOut(
                id=str(p.stage.id),
                name=p.stage.name,
                location_zone=p.stage.location_zone,
                capacity=p.stage.capacity,
                created_at=p.stage.created_at,
            )
            if p.stage
            else None,
        )
        result.append(resp)
    return result


@router.post(
    "/performances",
    response_model=PerformanceResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role(["ADMIN", "STAGE_MANAGER"]))],
)
def schedule_performance(payload: PerformanceCreate, db: Session = Depends(get_db)):
    # 1. Verify Artist and Stage exist
    artist = db.query(Artist).filter(Artist.id == payload.artist_id).first()
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")

    stage = db.query(Stage).filter(Stage.id == payload.stage_id).first()
    if not stage:
        raise HTTPException(status_code=404, detail="Stage not found")

    if payload.end_time <= payload.start_time:
        raise HTTPException(status_code=400, detail="end_time must be after start_time")

    # 2. Automated Stage Conflict Detection
    stage_conflict = (
        db.query(Performance)
        .filter(
            Performance.stage_id == payload.stage_id,
            Performance.status != "CANCELLED",
            Performance.start_time < payload.end_time,
            Performance.end_time > payload.start_time,
        )
        .first()
    )
    if stage_conflict:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Stage {stage.name} is already reserved between {payload.start_time.strftime('%H:%M')} and {payload.end_time.strftime('%H:%M')}",
        )

    # 3. Artist Double-Booking Prevention
    artist_conflict = (
        db.query(Performance)
        .filter(
            Performance.artist_id == payload.artist_id,
            Performance.status != "CANCELLED",
            Performance.start_time < payload.end_time,
            Performance.end_time > payload.start_time,
        )
        .first()
    )
    if artist_conflict:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Artist {artist.name} is already booked on another stage during this time window",
        )

    # 4. Create Performance
    performance = Performance(
        artist_id=payload.artist_id,
        stage_id=payload.stage_id,
        start_time=payload.start_time,
        end_time=payload.end_time,
        status="SCHEDULED",
    )
    db.add(performance)
    db.commit()
    db.refresh(performance)

    return PerformanceResponse(
        id=str(performance.id),
        artist_id=str(performance.artist_id),
        stage_id=str(performance.stage_id),
        start_time=performance.start_time,
        end_time=performance.end_time,
        status=performance.status,
        created_at=performance.created_at,
        artist=ArtistResponse(
            id=str(artist.id),
            name=artist.name,
            genre=artist.genre,
            contact_email=artist.contact_email,
            created_at=artist.created_at,
        ),
        stage=StageOut(
            id=str(stage.id),
            name=stage.name,
            location_zone=stage.location_zone,
            capacity=stage.capacity,
            created_at=stage.created_at,
        ),
    )


# --- Helper Artist Endpoints ---
@router.get("/artists", response_model=List[ArtistResponse])
def list_artists(db: Session = Depends(get_db)):
    artists = db.query(Artist).all()
    return [
        ArtistResponse(
            id=str(a.id),
            name=a.name,
            genre=a.genre,
            contact_email=a.contact_email,
            created_at=a.created_at,
        )
        for a in artists
    ]


@router.post(
    "/artists",
    response_model=ArtistResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role(["ADMIN", "STAGE_MANAGER"]))],
)
def create_artist(payload: ArtistCreate, db: Session = Depends(get_db)):
    artist = Artist(
        name=payload.name, genre=payload.genre, contact_email=payload.contact_email
    )
    db.add(artist)
    db.commit()
    db.refresh(artist)
    return ArtistResponse(
        id=str(artist.id),
        name=artist.name,
        genre=artist.genre,
        contact_email=artist.contact_email,
        created_at=artist.created_at,
    )


# --- Helper Stage Endpoints ---
@router.get("/stages", response_model=List[StageOut])
def list_stages(db: Session = Depends(get_db)):
    stages = db.query(Stage).all()
    return [
        StageOut(
            id=str(s.id),
            name=s.name,
            location_zone=s.location_zone,
            capacity=s.capacity,
            created_at=s.created_at,
        )
        for s in stages
    ]


@router.post(
    "/stages",
    response_model=StageOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role(["ADMIN", "STAGE_MANAGER"]))],
)
def create_stage(payload: StageCreate, db: Session = Depends(get_db)):
    existing = db.query(Stage).filter(Stage.name == payload.name).first()
    if existing:
        raise HTTPException(
            status_code=400, detail=f"Stage '{payload.name}' already exists"
        )
    stage = Stage(
        name=payload.name,
        location_zone=payload.location_zone,
        capacity=payload.capacity,
    )
    db.add(stage)
    db.commit()
    db.refresh(stage)
    return StageOut(
        id=str(stage.id),
        name=stage.name,
        location_zone=stage.location_zone,
        capacity=stage.capacity,
        created_at=stage.created_at,
    )
