import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.site import ExcavationSite
from server.models.artifact import DiscoveredArtifact
from server.schemas.artifact import ArtifactCreate, ArtifactUpdate, ArtifactResponse

router = APIRouter(prefix="/artifacts", tags=["Artifacts"])


@router.get("", response_model=List[ArtifactResponse])
def get_artifacts(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    site_id: Optional[str] = None,
    material: Optional[str] = None,
    context_layer: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(DiscoveredArtifact)
    if site_id:
        query = query.filter(DiscoveredArtifact.site_id == site_id)
    if material:
        query = query.filter(DiscoveredArtifact.material.ilike(f"%{material}%"))
    if context_layer:
        query = query.filter(DiscoveredArtifact.context_layer.ilike(f"%{context_layer}%"))
    if search:
        query = query.filter(
            (DiscoveredArtifact.artifact_code.ilike(f"%{search}%"))
            | (DiscoveredArtifact.description.ilike(f"%{search}%"))
        )
    return query.offset(skip).limit(limit).all()


@router.post("", response_model=ArtifactResponse, status_code=status.HTTP_201_CREATED)
def create_artifact(artifact_in: ArtifactCreate, db: Session = Depends(get_db)):
    site = db.query(ExcavationSite).filter(ExcavationSite.id == artifact_in.site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail=f"Excavation site with id {artifact_in.site_id} not found")

    existing = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.artifact_code == artifact_in.artifact_code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Artifact with code '{artifact_in.artifact_code}' already exists")

    qr_ident = artifact_in.qr_code_identifier or f"QR-{artifact_in.artifact_code}"

    # Verify QR identifier uniqueness if provided
    if qr_ident:
        existing_qr = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.qr_code_identifier == qr_ident).first()
        if existing_qr:
            raise HTTPException(status_code=400, detail=f"Duplicate barcode/QR '{qr_ident}' is not allowed")

    new_art = DiscoveredArtifact(
        id=str(uuid.uuid4()),
        site_id=artifact_in.site_id,
        artifact_code=artifact_in.artifact_code,
        material=artifact_in.material,
        context_layer=artifact_in.context_layer,
        depth_meters=artifact_in.depth_meters,
        excavation_date=artifact_in.excavation_date,
        finder_member_id=artifact_in.finder_member_id,
        description=artifact_in.description,
        x_offset_meters=artifact_in.x_offset_meters,
        y_offset_meters=artifact_in.y_offset_meters,
        z_depth_meters=artifact_in.z_depth_meters,
        qr_code_identifier=qr_ident,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_art)
    db.commit()
    db.refresh(new_art)
    return new_art


@router.get("/{artifact_id}", response_model=ArtifactResponse)
def get_artifact(artifact_id: str, db: Session = Depends(get_db)):
    art = db.query(DiscoveredArtifact).filter(
        (DiscoveredArtifact.id == artifact_id) | (DiscoveredArtifact.artifact_code == artifact_id)
    ).first()
    if not art:
        raise HTTPException(status_code=404, detail=f"Artifact with id {artifact_id} not found")
    return art


@router.patch("/{artifact_id}", response_model=ArtifactResponse)
def update_artifact(artifact_id: str, artifact_in: ArtifactUpdate, db: Session = Depends(get_db)):
    art = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id == artifact_id).first()
    if not art:
        raise HTTPException(status_code=404, detail=f"Artifact with id {artifact_id} not found")

    update_data = artifact_in.model_dump(exclude_unset=True)
    if "qr_code_identifier" in update_data and update_data["qr_code_identifier"]:
        existing_qr = db.query(DiscoveredArtifact).filter(
            DiscoveredArtifact.qr_code_identifier == update_data["qr_code_identifier"],
            DiscoveredArtifact.id != artifact_id,
        ).first()
        if existing_qr:
            raise HTTPException(status_code=400, detail="Duplicate barcode assignment is not allowed")

    for k, v in update_data.items():
        setattr(art, k, v)

    art.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(art)
    return art


@router.delete("/{artifact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_artifact(artifact_id: str, db: Session = Depends(get_db)):
    art = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id == artifact_id).first()
    if not art:
        raise HTTPException(status_code=404, detail=f"Artifact with id {artifact_id} not found")
    db.delete(art)
    db.commit()
    return None
