"""
Module: server.routers.documents
Purpose: Documents router for uploading receipts and invoices.
"""

import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Receipt, User
from server.schemas import ReceiptResponse
from server.auth import get_current_user

router = APIRouter(prefix="/api/v1/documents", tags=["Documents"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post(
    "/upload", response_model=ReceiptResponse, status_code=status.HTTP_201_CREATED
)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload a purchase receipt or service invoice."""
    # Generate a unique filename to prevent collisions
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        # Save file locally
        with open(file_path, "wb") as f:
            f.write(file.file.read())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}",
        )

    # Create Receipt record
    # Note: product_id is initially null and will be linked during product registration
    new_receipt = Receipt(
        filename=file.filename, file_url=f"/uploads/{unique_filename}"
    )
    db.add(new_receipt)
    db.commit()
    db.refresh(new_receipt)

    return new_receipt
