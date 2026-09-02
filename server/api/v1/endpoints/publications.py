import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.artifact import DiscoveredArtifact
from server.models.publication import Publication, ArtifactPublication
from server.schemas.publication import PublicationCreate, PublicationResponse, ArtifactPublicationLink

router = APIRouter(prefix="/publications", tags=["Publications"])


@router.get("", response_model=List[PublicationResponse])
def get_publications(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1), db: Session = Depends(get_db)):
    return db.query(Publication).offset(skip).limit(limit).all()


@router.post("", response_model=PublicationResponse, status_code=status.HTTP_201_CREATED)
def create_publication(pub_in: PublicationCreate, db: Session = Depends(get_db)):
    if pub_in.doi:
        existing = db.query(Publication).filter(Publication.doi == pub_in.doi).first()
        if existing:
            raise HTTPException(status_code=400, detail=f"Publication with DOI '{pub_in.doi}' already exists")

    new_pub = Publication(
        id=str(uuid.uuid4()),
        title=pub_in.title,
        doi=pub_in.doi,
        authors=pub_in.authors,
        journal_publisher=pub_in.journal_publisher,
        publication_date=pub_in.publication_date,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_pub)
    db.commit()
    db.refresh(new_pub)
    return new_pub


@router.get("/{pub_id}", response_model=PublicationResponse)
def get_publication(pub_id: str, db: Session = Depends(get_db)):
    pub = db.query(Publication).filter(Publication.id == pub_id).first()
    if not pub:
        raise HTTPException(status_code=404, detail=f"Publication with id {pub_id} not found")
    return pub


@router.delete("/{pub_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_publication(pub_id: str, db: Session = Depends(get_db)):
    pub = db.query(Publication).filter(Publication.id == pub_id).first()
    if not pub:
        raise HTTPException(status_code=404, detail=f"Publication with id {pub_id} not found")
    db.delete(pub)
    db.commit()
    return None


@router.post("/link", status_code=status.HTTP_201_CREATED)
def link_artifact_publication(link_in: ArtifactPublicationLink, db: Session = Depends(get_db)):
    art = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id == link_in.artifact_id).first()
    if not art:
        raise HTTPException(status_code=404, detail=f"Artifact with id {link_in.artifact_id} not found")

    pub = db.query(Publication).filter(Publication.id == link_in.publication_id).first()
    if not pub:
        raise HTTPException(status_code=404, detail=f"Publication with id {link_in.publication_id} not found")

    existing_link = db.query(ArtifactPublication).filter_by(
        artifact_id=link_in.artifact_id, publication_id=link_in.publication_id
    ).first()
    if existing_link:
        return {"status": "already_linked", "id": existing_link.id}

    link = ArtifactPublication(
        id=str(uuid.uuid4()),
        artifact_id=link_in.artifact_id,
        publication_id=link_in.publication_id,
        created_at=datetime.now(timezone.utc),
    )
    db.add(link)
    db.commit()
    return {"status": "linked", "id": link.id}
