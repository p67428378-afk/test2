import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas import ReceiptResponse
from server import crud

router = APIRouter(prefix="/api/v1/documents", tags=["Documents"])

UPLOAD_DIR = "/tmp/warranty_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post(
    "/upload", response_model=ReceiptResponse, status_code=status.HTTP_201_CREATED
)
async def upload_document(
    product_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Upload a receipt or proof of purchase document for a product."""
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )

    # Save file to disk/storage
    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)

    content = await file.read()
    file_size = len(content)

    with open(file_path, "wb") as f:
        f.write(content)

    receipt = crud.create_receipt(
        db=db,
        product_id=product_id,
        file_name=file.filename,
        file_path=file_path,
        mime_type=file.content_type or "application/octet-stream",
        file_size_bytes=file_size,
    )
    return receipt


@router.get("/{receipt_id}", response_model=ReceiptResponse)
def get_document_details(receipt_id: str, db: Session = Depends(get_db)):
    """Get metadata for an uploaded receipt document."""
    receipt = crud.get_receipt(db, receipt_id)
    if not receipt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Receipt document with ID {receipt_id} not found",
        )
    return receipt
