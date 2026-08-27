from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas import LeadCreate, LeadRead
from server.app.services.lead_service import LeadService

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("", response_model=LeadRead, status_code=status.HTTP_201_CREATED)
def submit_lead(lead_in: LeadCreate, db: Session = Depends(get_db)):
    """
    Submit a new client lead inquiry with validation.
    """
    return LeadService.create_lead(db=db, lead_in=lead_in)


@router.get("", response_model=List[LeadRead], status_code=status.HTTP_200_OK)
def list_leads(
    skip: int = Query(0, ge=0, description="Pagination skip offset"),
    limit: int = Query(50, ge=1, le=100, description="Pagination page limit"),
    db: Session = Depends(get_db),
):
    """
    List captured client leads.
    """
    return LeadService.get_leads(db=db, skip=skip, limit=limit)
