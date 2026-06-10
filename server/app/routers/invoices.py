from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from server.app import schemas, crud
from server.app.database import get_db

router = APIRouter(
    prefix="/invoices",
    tags=["invoices"]
)

@router.post("", response_model=schemas.InvoiceResponse, status_code=status.HTTP_201_CREATED)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    # Verify funeral exists
    db_funeral = crud.get_funeral(db=db, funeral_id=invoice.funeral_id)
    if not db_funeral:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Funeral not found"
        )
    try:
        return crud.create_invoice(db=db, invoice=invoice)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid input data: {str(e)}"
        )

@router.get("", response_model=List[schemas.InvoiceResponse])
def list_invoices(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return crud.get_invoices(db=db, skip=skip, limit=limit)

@router.get("/{invoice_id}", response_model=schemas.InvoiceResponse)
def get_invoice(invoice_id: UUID, db: Session = Depends(get_db)):
    db_invoice = crud.get_invoice(db=db, invoice_id=invoice_id)
    if not db_invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    return db_invoice

@router.put("/{invoice_id}", response_model=schemas.InvoiceResponse)
def update_invoice(invoice_id: UUID, invoice_update: schemas.InvoiceUpdate, db: Session = Depends(get_db)):
    db_invoice = crud.update_invoice(db=db, invoice_id=invoice_id, invoice_update=invoice_update)
    if not db_invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    return db_invoice
