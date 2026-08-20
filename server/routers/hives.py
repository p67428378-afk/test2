from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Hive, Apiary
from server.schemas import HiveCreate, HiveUpdate, HiveResponse

router = APIRouter(prefix="/api/v1/hives", tags=["Hives"])


def _build_hive_response(hive: Hive) -> HiveResponse:
    frame_cnt = hive.frame_count if hive.frame_count and hive.frame_count > 0 else 10
    density = round(hive.estimated_population / float(frame_cnt), 2)

    if density < 1500:
        d_status = "Low Density (Weak Colony)"
    elif density <= 4500:
        d_status = "Optimal Density"
    else:
        d_status = "High Density (Swarm Risk)"

    return HiveResponse(
        id=hive.id,
        apiary_id=hive.apiary_id,
        hive_number=hive.hive_number,
        queen_breed=hive.queen_breed,
        queen_installed_date=hive.queen_installed_date,
        status=hive.status,
        estimated_population=hive.estimated_population,
        frame_count=frame_cnt,
        density_bees_per_frame=density,
        density_status=d_status,
        created_at=hive.created_at,
        updated_at=hive.updated_at,
    )


@router.get("", response_model=List[HiveResponse])
def list_hives(
    apiary_id: Optional[str] = None,
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(Hive)
    if apiary_id:
        query = query.filter(Hive.apiary_id == apiary_id)
    if status_filter:
        query = query.filter(Hive.status == status_filter)

    hives = query.offset(skip).limit(limit).all()
    return [_build_hive_response(h) for h in hives]


@router.post("", response_model=HiveResponse, status_code=status.HTTP_201_CREATED)
def create_hive(hive_in: HiveCreate, db: Session = Depends(get_db)):
    apiary = db.query(Apiary).filter(Apiary.id == hive_in.apiary_id).first()
    if not apiary:
        raise HTTPException(
            status_code=404, detail=f"Apiary '{hive_in.apiary_id}' does not exist."
        )

    hive = Hive(
        apiary_id=hive_in.apiary_id,
        hive_number=hive_in.hive_number,
        queen_breed=hive_in.queen_breed,
        queen_installed_date=hive_in.queen_installed_date,
        status=hive_in.status,
        estimated_population=hive_in.estimated_population,
        frame_count=hive_in.frame_count,
    )
    db.add(hive)
    db.commit()
    db.refresh(hive)
    return _build_hive_response(hive)


@router.get("/{hive_id}", response_model=HiveResponse)
def get_hive(hive_id: str, db: Session = Depends(get_db)):
    hive = db.query(Hive).filter(Hive.id == hive_id).first()
    if not hive:
        raise HTTPException(
            status_code=404, detail=f"Hive with ID '{hive_id}' not found."
        )
    return _build_hive_response(hive)


@router.patch("/{hive_id}", response_model=HiveResponse)
def update_hive(hive_id: str, hive_in: HiveUpdate, db: Session = Depends(get_db)):
    hive = db.query(Hive).filter(Hive.id == hive_id).first()
    if not hive:
        raise HTTPException(
            status_code=404, detail=f"Hive with ID '{hive_id}' not found."
        )

    update_data = hive_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(hive, field, value)

    db.commit()
    db.refresh(hive)
    return _build_hive_response(hive)
