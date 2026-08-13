from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from server.database import get_db
from server import schemas, crud

router = APIRouter(prefix="/api/v1/tickets", tags=["Ticket Validation"])


@router.get("", response_model=List[schemas.TicketResponse])
def list_tickets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_tickets(db, skip=skip, limit=limit)


@router.post(
    "", response_model=schemas.TicketResponse, status_code=status.HTTP_201_CREATED
)
def create_ticket(ticket_data: schemas.TicketCreate, db: Session = Depends(get_db)):
    return crud.create_ticket(db, ticket_data)


@router.post("/validate", response_model=schemas.TicketValidationResponse)
def validate_ticket(
    validate_req: schemas.TicketValidationRequest, db: Session = Depends(get_db)
):
    return crud.validate_ticket(db, validate_req)


@router.post("/sync", response_model=schemas.TicketSyncResponse)
def sync_tickets(sync_req: schemas.TicketSyncRequest, db: Session = Depends(get_db)):
    return crud.sync_tickets(db, sync_req)
