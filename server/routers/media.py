import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import MediaAsset, ExcavationSite, DiscoveredArtifact, LabAnalysis
from server.schemas import (
    MediaAssetCreate,
    MediaAssetResponse,
    MediaAssetListResponse,
)

router = APIRouter(prefix="/api/v1/media", tags=["Media & Photographs"])


@router.post("/upload", response_model=MediaAssetResponse, status_code=status.HTTP_201_CREATED)
def upload_media_record(media_in: MediaAssetCreate, db: Session = Depends(get_db)):
    """Create a media asset record with metadata."""
    if media_in.site_id:
        if not db.query(ExcavationSite).filter(ExcavationSite.id == media_in.site_id).first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Site '{media_in.site_id}' not found")

    if media_in.artifact_id:
        if not db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id == media_in.artifact_id).first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Artifact '{media_in.artifact_id}' not found")

    if media_in.lab_analysis_id:
        if not db.query(LabAnalysis).filter(LabAnalysis.id == media_in.lab_analysis_id).first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Lab Analysis '{media_in.lab_analysis_id}' not found")

    new_media = MediaAsset(
        id=str(uuid.uuid4()),
        site_id=media_in.site_id,
        artifact_id=media_in.artifact_id,
        lab_analysis_id=media_in.lab_analysis_id,
        file_name=media_in.file_name,
        file_url=media_in.file_url,
        media_type=media_in.media_type,
        file_size_bytes=media_in.file_size_bytes,
        caption=media_in.caption,
        camera_metadata=media_in.camera_metadata,
    )
    db.add(new_media)
    db.commit()
    db.refresh(new_media)
    return new_media


@router.get("", response_model=MediaAssetListResponse)
def list_media(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    site_id: Optional[str] = None,
    artifact_id: Optional[str] = None,
    lab_analysis_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(MediaAsset)
    if site_id:
        query = query.filter(MediaAsset.site_id == site_id)
    if artifact_id:
        query = query.filter(MediaAsset.artifact_id == artifact_id)
    if lab_analysis_id:
        query = query.filter(MediaAsset.lab_analysis_id == lab_analysis_id)

    total = query.count()
    items = query.order_by(MediaAsset.created_at.desc()).offset(skip).limit(limit).all()
    return MediaAssetListResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{media_id}", response_model=MediaAssetResponse)
def get_media_asset(media_id: str, db: Session = Depends(get_db)):
    asset = db.query(MediaAsset).filter(MediaAsset.id == media_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Media asset '{media_id}' not found"
        )
    return asset


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media_asset(media_id: str, db: Session = Depends(get_db)):
    asset = db.query(MediaAsset).filter(MediaAsset.id == media_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Media asset '{media_id}' not found"
        )
    db.delete(asset)
    db.commit()
    return None
