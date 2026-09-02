import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.media import MediaAsset
from server.schemas.media import MediaCreate, MediaResponse

router = APIRouter(prefix="/media", tags=["Media"])


@router.post("/upload", response_model=MediaResponse, status_code=status.HTTP_201_CREATED)
def upload_media_record(media_in: MediaCreate, db: Session = Depends(get_db)):
    new_media = MediaAsset(
        id=str(uuid.uuid4()),
        entity_type=media_in.entity_type,
        entity_id=media_in.entity_id,
        title=media_in.title,
        file_url=media_in.file_url,
        file_type=media_in.file_type or "image/jpeg",
        caption=media_in.caption,
        camera_metadata=media_in.camera_metadata,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_media)
    db.commit()
    db.refresh(new_media)
    return new_media


@router.get("", response_model=List[MediaResponse])
def list_media(
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1),
    db: Session = Depends(get_db),
):
    query = db.query(MediaAsset)
    if entity_type:
        query = query.filter(MediaAsset.entity_type == entity_type)
    if entity_id:
        query = query.filter(MediaAsset.entity_id == entity_id)
    return query.offset(skip).limit(limit).all()


@router.get("/{media_id}", response_model=MediaResponse)
def get_media_asset(media_id: str, db: Session = Depends(get_db)):
    asset = db.query(MediaAsset).filter(MediaAsset.id == media_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail=f"Media asset with id {media_id} not found")
    return asset


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media_asset(media_id: str, db: Session = Depends(get_db)):
    asset = db.query(MediaAsset).filter(MediaAsset.id == media_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail=f"Media asset with id {media_id} not found")
    db.delete(asset)
    db.commit()
    return None
