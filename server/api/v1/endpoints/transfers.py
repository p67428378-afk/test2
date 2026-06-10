from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from datetime import datetime
from typing import List
from decimal import Decimal
from server import crud, schemas, models
from server.database import get_db

router = APIRouter()

@router.post("/transfers", response_model=schemas.TransferInitiateResponse)
def initiate_transfer(payload: schemas.TransferInitiateRequest, db: Session = Depends(get_db)):
    source_acc = crud.get_account(db, payload.source_account_id)
    dest_acc = crud.get_account(db, payload.destination_account_id)
    
    if not source_acc or not dest_acc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance or invalid account IDs"
        )
        
    amount_decimal = Decimal(str(payload.amount))
    if source_acc.balance < amount_decimal:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance or invalid account IDs"
        )
        
    # Perform transfer
    source_acc.balance -= amount_decimal
    dest_acc.balance += amount_decimal
    
    transaction = crud.create_transaction(
        db,
        source_account_id=payload.source_account_id,
        destination_account_id=payload.destination_account_id,
        amount=amount_decimal,
        status="COMPLETED"
    )
    
    return schemas.TransferInitiateResponse(
        created_at=transaction.created_at.isoformat(),
        status=transaction.status,
        transaction_id=transaction.id
    )

@router.get("/transfers/{transaction_id}", response_model=schemas.TransferQueryResponse)
def query_transfer(transaction_id: UUID, db: Session = Depends(get_db)):
    transaction = crud.get_transaction(db, transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
        
    return schemas.TransferQueryResponse(
        amount=float(transaction.amount),
        created_at=transaction.created_at.isoformat(),
        destination_account_id=transaction.destination_account_id,
        source_account_id=transaction.source_account_id,
        status=transaction.status,
        transaction_id=transaction.id,
        updated_at=transaction.updated_at.isoformat()
    )

# Trekking Guide Endpoints (Mocked/In-memory)
MOCK_BOOKINGS = [
    {
        "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        "client": {"name": "Alice Smith"},
        "trek": {"name": "Everest Base Camp"},
        "start_date": "2026-10-12",
        "end_date": "2026-10-26",
        "status": "PENDING"
    },
    {
        "id": "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
        "client": {"name": "Bob Jones"},
        "trek": {"name": "Annapurna Circuit"},
        "start_date": "2026-11-05",
        "end_date": "2026-11-15",
        "status": "PENDING"
    }
]

MOCK_AVAILABILITY = [
    {
        "date": "2026-06-15",
        "start_time": "09:00",
        "end_time": "17:00",
        "is_available": True
    },
    {
        "date": "2026-06-16",
        "start_time": "09:00",
        "end_time": "17:00",
        "is_available": False
    }
]

@router.get("/bookings", response_model=List[schemas.BookingResponse])
def get_bookings():
    return MOCK_BOOKINGS

@router.get("/availability/{guide_id}", response_model=List[schemas.AvailabilityResponse])
def get_availability(guide_id: UUID):
    return MOCK_AVAILABILITY

@router.post("/notifications", response_model=schemas.NotificationResponse)
def send_notification(payload: schemas.NotificationRequest):
    return schemas.NotificationResponse(
        message_id=uuid4(),
        success=True
    )
