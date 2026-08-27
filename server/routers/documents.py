"""Document REST API endpoints."""

from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Document
from server.schemas import (
    DocumentCreate,
    DocumentListResponse,
    DocumentResponse,
    DocumentUpdate,
)

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])

MAX_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024  # 5MB


def validate_document_size(content: Optional[str]) -> None:
    """Validate that the document content does not exceed 5MB."""
    if content is not None and len(content.encode("utf-8")) > MAX_DOCUMENT_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document content exceeds maximum allowed size of 5MB",
        )


@router.post(
    "",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Markdown document",
)
def create_document(
    doc_in: DocumentCreate,
    db: Session = Depends(get_db),
):
    """Create a new Markdown document."""
    validate_document_size(doc_in.content)

    title = doc_in.title if doc_in.title and doc_in.title.strip() else "Untitled Document"

    doc = Document(
        title=title,
        content=doc_in.content,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.get(
    "",
    response_model=DocumentListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Markdown documents with pagination",
)
def list_documents(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Retrieve a paginated list of documents."""
    total = db.query(Document).count()
    items = (
        db.query(Document)
        .order_by(Document.updated_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return DocumentListResponse(
        total=total,
        skip=skip,
        limit=limit,
        items=items,
    )


@router.get(
    "/{id}",
    response_model=DocumentResponse,
    status_code=status.HTTP_200_OK,
    summary="Get document by ID",
)
def get_document(
    id: str,
    db: Session = Depends(get_db),
):
    """Retrieve a document by its UUID."""
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )
    return doc


@router.put(
    "/{id}",
    response_model=DocumentResponse,
    status_code=status.HTTP_200_OK,
    summary="Update or auto-save a document",
)
def update_document(
    id: str,
    doc_in: DocumentUpdate,
    db: Session = Depends(get_db),
):
    """Update an existing Markdown document."""
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    if doc_in.content is not None:
        validate_document_size(doc_in.content)
        doc.content = doc_in.content

    if doc_in.title is not None:
        doc.title = doc_in.title if doc_in.title.strip() else "Untitled Document"

    doc.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(doc)
    return doc


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a document",
)
def delete_document(
    id: str,
    db: Session = Depends(get_db),
):
    """Permanently delete a Markdown document."""
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    db.delete(doc)
    db.commit()
    return None
