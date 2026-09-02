import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.database import get_db
from server.models import Publication, DiscoveredArtifact
from server.schemas import (
    PublicationCreate,
    PublicationResponse,
    PublicationListResponse,
    PublicationLinkRequest,
)

router = APIRouter(prefix="/api/v1/publications", tags=["Publications & Citations"])


def _format_publication_response(pub: Publication) -> PublicationResponse:
    linked_ids = [art.id for art in pub.artifacts] if pub.artifacts else []
    return PublicationResponse(
        id=pub.id,
        title=pub.title,
        authors=pub.authors,
        journal_publisher=pub.journal_publisher,
        publication_date=pub.publication_date,
        doi=pub.doi,
        created_at=pub.created_at,
        updated_at=pub.updated_at,
        linked_artifact_ids=linked_ids,
    )


@router.post("", response_model=PublicationResponse, status_code=status.HTTP_201_CREATED)
def create_publication(pub_in: PublicationCreate, db: Session = Depends(get_db)):
    new_pub = Publication(
        id=str(uuid.uuid4()),
        title=pub_in.title,
        authors=pub_in.authors,
        journal_publisher=pub_in.journal_publisher,
        publication_date=pub_in.publication_date,
        doi=pub_in.doi,
    )

    if pub_in.artifact_ids:
        artifacts = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id.in_(pub_in.artifact_ids)).all()
        new_pub.artifacts = artifacts

    db.add(new_pub)
    db.commit()
    db.refresh(new_pub)
    return _format_publication_response(new_pub)


@router.get("", response_model=PublicationListResponse)
def list_publications(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    doi: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Publication)
    if doi:
        query = query.filter(Publication.doi.ilike(f"%{doi}%"))
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Publication.title.ilike(search_filter),
                Publication.authors.ilike(search_filter),
                Publication.journal_publisher.ilike(search_filter),
            )
        )

    total = query.count()
    pubs = query.order_by(Publication.publication_date.desc()).offset(skip).limit(limit).all()
    items = [_format_publication_response(p) for p in pubs]
    return PublicationListResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{pub_id}", response_model=PublicationResponse)
def get_publication(pub_id: str, db: Session = Depends(get_db)):
    pub = db.query(Publication).filter(Publication.id == pub_id).first()
    if not pub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Publication '{pub_id}' not found"
        )
    return _format_publication_response(pub)


@router.post("/link", response_model=PublicationResponse)
def link_publication_to_artifact(link_req: PublicationLinkRequest, db: Session = Depends(get_db)):
    pub = db.query(Publication).filter(Publication.id == link_req.publication_id).first()
    if not pub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Publication '{link_req.publication_id}' not found"
        )

    artifact = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id == link_req.artifact_id).first()
    if not artifact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Artifact '{link_req.artifact_id}' not found"
        )

    if artifact not in pub.artifacts:
        pub.artifacts.append(artifact)
        db.commit()
        db.refresh(pub)

    return _format_publication_response(pub)


@router.delete("/{pub_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_publication(pub_id: str, db: Session = Depends(get_db)):
    pub = db.query(Publication).filter(Publication.id == pub_id).first()
    if not pub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Publication '{pub_id}' not found"
        )
    db.delete(pub)
    db.commit()
    return None
