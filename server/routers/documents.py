from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas.document import DocumentCreate, DocumentResponse, DocumentUpdate
from server.services.document_service import DocumentService

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])


@router.get("", response_model=List[DocumentResponse], status_code=status.HTTP_200_OK)
def list_documents(
    skip: int = Query(0, ge=0, description="Number of documents to skip"),
    limit: int = Query(
        20, ge=1, le=100, description="Maximum number of documents to return"
    ),
    db: Session = Depends(get_db),
):
    """List stored documents with pagination."""
    return DocumentService.list_documents(db, skip=skip, limit=limit)


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def create_document(
    doc: DocumentCreate,
    db: Session = Depends(get_db),
):
    """Create a new Markdown document."""
    return DocumentService.create_document(db, doc)


@router.get("/{id}", response_model=DocumentResponse, status_code=status.HTTP_200_OK)
def get_document(
    id: UUID,
    db: Session = Depends(get_db),
):
    """Fetch a document by UUID."""
    doc = DocumentService.get_document_by_id(db, id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
        )
    return doc


@router.put("/{id}", response_model=DocumentResponse, status_code=status.HTTP_200_OK)
def update_document(
    id: UUID,
    doc: DocumentUpdate,
    db: Session = Depends(get_db),
):
    """Update an existing Markdown document."""
    updated = DocumentService.update_document(db, id, doc)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
        )
    return updated


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    id: UUID,
    db: Session = Depends(get_db),
):
    """Delete a document by UUID."""
    deleted = DocumentService.delete_document(db, id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
        )
    return None
