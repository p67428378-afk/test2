from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from server.models.document import Document
from server.schemas.document import DocumentCreate, DocumentUpdate


class DocumentService:
    @staticmethod
    def list_documents(db: Session, skip: int = 0, limit: int = 20) -> List[Document]:
        return (
            db.query(Document)
            .order_by(Document.updated_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_document_by_id(db: Session, doc_id: UUID) -> Optional[Document]:
        return db.query(Document).filter(Document.id == doc_id).first()

    @staticmethod
    def create_document(db: Session, doc_data: DocumentCreate) -> Document:
        new_doc = Document(
            title=doc_data.title,
            content=doc_data.content,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)
        return new_doc

    @staticmethod
    def update_document(
        db: Session, doc_id: UUID, doc_data: DocumentUpdate
    ) -> Optional[Document]:
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if not doc:
            return None
        if doc_data.title is not None:
            doc.title = doc_data.title
        if doc_data.content is not None:
            doc.content = doc_data.content
        doc.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(doc)
        return doc

    @staticmethod
    def delete_document(db: Session, doc_id: UUID) -> bool:
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if not doc:
            return False
        db.delete(doc)
        db.commit()
        return True
