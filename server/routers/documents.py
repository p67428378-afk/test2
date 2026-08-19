import os
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, File, Form, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

import server.models as models
import server.schemas as schemas
from server.database import get_db

router = APIRouter(prefix="/api/v1/documents", tags=["Documents"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/tmp/warranty_receipts")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post(
    "/upload",
    response_model=schemas.ReceiptResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    product_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Upload a receipt or proof of purchase document for a product."""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)

    file_bytes = await file.read()
    file_size = len(file_bytes)

    with open(file_path, "wb") as buffer:
        buffer.write(file_bytes)

    receipt = models.Receipt(
        product_id=product_id,
        file_name=file.filename,
        file_path=file_path,
        mime_type=file.content_type or "application/octet-stream",
        file_size_bytes=file_size,
    )
    db.add(receipt)
    db.commit()
    db.refresh(receipt)

    return receipt


@router.get("/{receipt_id}", response_model=schemas.ReceiptResponse)
def get_document_details(receipt_id: str, db: Session = Depends(get_db)):
    """Get metadata for an uploaded document."""
    receipt = db.query(models.Receipt).filter(models.Receipt.id == receipt_id).first()
    if not receipt:
        raise HTTPException(status_code=404, detail="Document not found")
    return receipt


@router.get("/{receipt_id}/file")
def download_document_file(receipt_id: str, db: Session = Depends(get_db)):
    """Download or view the raw document file."""
    receipt = db.query(models.Receipt).filter(models.Receipt.id == receipt_id).first()
    if not receipt:
        raise HTTPException(status_code=404, detail="Document not found")

    if not os.path.exists(receipt.file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")

    return FileResponse(
        path=receipt.file_path, filename=receipt.file_name, media_type=receipt.mime_type
    )
