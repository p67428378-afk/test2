import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.database import get_db
from server.models import DiscoveredArtifact, ExcavationSite, TeamMember
from server.schemas import (
    ArtifactCreate,
    ArtifactUpdate,
    ArtifactResponse,
    ArtifactListResponse,
    ArtifactDetailResponse,
)

router = APIRouter(prefix="/api/v1/artifacts", tags=["Discovered Artifacts"])


@router.post("", response_model=ArtifactResponse, status_code=status.HTTP_201_CREATED)
def create_artifact(artifact_in: ArtifactCreate, db: Session = Depends(get_db)):
    # Validate excavation site exists
    site = db.query(ExcavationSite).filter(ExcavationSite.id == artifact_in.site_id).first()
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Associated excavation site '{artifact_in.site_id}' does not exist"
        )

    # Validate finder member if provided
    if artifact_in.finder_member_id:
        member = db.query(TeamMember).filter(TeamMember.id == artifact_in.finder_member_id).first()
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Finder team member '{artifact_in.finder_member_id}' does not exist"
            )

    # Check unique artifact_code
    existing = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.artifact_code == artifact_in.artifact_code).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Artifact with code '{artifact_in.artifact_code}' already exists"
        )

    new_artifact = DiscoveredArtifact(
        id=str(uuid.uuid4()),
        site_id=artifact_in.site_id,
        artifact_code=artifact_in.artifact_code,
        material=artifact_in.material,
        context_layer=artifact_in.context_layer,
        depth_meters=artifact_in.depth_meters,
        excavation_date=artifact_in.excavation_date,
        finder_member_id=artifact_in.finder_member_id,
        description=artifact_in.description,
    )
    db.add(new_artifact)
    db.commit()
    db.refresh(new_artifact)
    return new_artifact


@router.get("", response_model=ArtifactListResponse)
def list_artifacts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
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
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                DiscoveredArtifact.artifact_code.ilike(search_filter),
                DiscoveredArtifact.material.ilike(search_filter),
                DiscoveredArtifact.description.ilike(search_filter),
                DiscoveredArtifact.context_layer.ilike(search_filter),
            )
        )

    total = query.count()
    items = query.order_by(DiscoveredArtifact.created_at.desc()).offset(skip).limit(limit).all()
    return ArtifactListResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{artifact_id}", response_model=ArtifactDetailResponse)
def get_artifact(artifact_id: str, db: Session = Depends(get_db)):
    artifact = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id == artifact_id).first()
    if not artifact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Discovered artifact '{artifact_id}' not found"
        )
    return artifact


@router.patch("/{artifact_id}", response_model=ArtifactResponse)
def update_artifact(artifact_id: str, artifact_in: ArtifactUpdate, db: Session = Depends(get_db)):
    artifact = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id == artifact_id).first()
    if not artifact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Discovered artifact '{artifact_id}' not found"
        )

    update_data = artifact_in.model_dump(exclude_unset=True)

    if "site_id" in update_data and update_data["site_id"] is not None:
        site = db.query(ExcavationSite).filter(ExcavationSite.id == update_data["site_id"]).first()
        if not site:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target excavation site does not exist")

    if "finder_member_id" in update_data and update_data["finder_member_id"] is not None:
        member = db.query(TeamMember).filter(TeamMember.id == update_data["finder_member_id"]).first()
        if not member:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Finder member does not exist")

    if "artifact_code" in update_data and update_data["artifact_code"] != artifact.artifact_code:
        if db.query(DiscoveredArtifact).filter(DiscoveredArtifact.artifact_code == update_data["artifact_code"]).first():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Artifact code already taken")

    for key, value in update_data.items():
        setattr(artifact, key, value)

    db.commit()
    db.refresh(artifact)
    return artifact


@router.delete("/{artifact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_artifact(artifact_id: str, db: Session = Depends(get_db)):
    artifact = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id == artifact_id).first()
    if not artifact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Discovered artifact '{artifact_id}' not found"
        )
    db.delete(artifact)
    db.commit()
    return None
