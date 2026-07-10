from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from uuid import UUID
from server.database import get_db
from server.models import Visitor
from server.schemas import VisitorRegister, VisitorResponse, VisitorIDUploadResponse

router = APIRouter()


@router.post(
    "/register", response_model=VisitorResponse, status_code=status.HTTP_201_CREATED
)
def register_visitor(visitor_data: VisitorRegister, db: Session = Depends(get_db)):
    # Check if email already exists
    existing = db.query(Visitor).filter(Visitor.email == visitor_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    new_visitor = Visitor(
        full_name=visitor_data.full_name,
        email=visitor_data.email,
        password_hash=visitor_data.password,  # Plain text for simplicity/testing
        date_of_birth=visitor_data.date_of_birth,
        id_verification_status="pending",
    )
    db.add(new_visitor)
    db.commit()
    db.refresh(new_visitor)
    return new_visitor


@router.post("/visitors/{id}/upload-id", response_model=VisitorIDUploadResponse)
def upload_id_document(
    id: UUID, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    visitor = db.query(Visitor).filter(Visitor.id == id).first()
    if not visitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Visitor not found"
        )

    # Validate file format
    allowed_extensions = [".jpg", ".jpeg", ".png", ".pdf"]
    ext = "".join(file.filename.split(".")[-1:]).lower()
    if f".{ext}" not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only JPG, JPEG, PNG, and PDF are allowed.",
        )

    # Mock file upload URL
    mock_url = f"/uploads/ids/{id}_{file.filename}"
    visitor.id_document_url = mock_url
    visitor.id_verification_status = "verified"  # Auto-verify for simplicity/testing
    db.commit()
    db.refresh(visitor)
    return visitor
