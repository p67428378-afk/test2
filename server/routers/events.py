# server/routers/events.py
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from server import crud, schemas, database

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=List[schemas.EventResponse])
def list_events(
    search: Optional[str] = Query(
        None, description="Search term for title or description"
    ),
    category: Optional[str] = Query(None, description="Filter by event category"),
    location: Optional[str] = Query(None, description="Filter by location"),
    start_date: Optional[datetime] = Query(
        None, description="Filter events starting from this date"
    ),
    end_date: Optional[datetime] = Query(
        None, description="Filter events ending by this date"
    ),
    db: Session = Depends(database.get_db),
):
    try:
        return crud.get_events(
            db=db,
            search=search,
            category=category,
            location=location,
            start_date=start_date,
            end_date=end_date,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid query parameters: {str(e)}",
        )


# Add POST /api/v1/events to satisfy the WorkSpec contract
@router.post(
    "", response_model=schemas.EventResponse, status_code=status.HTTP_201_CREATED
)
def create_event_public(
    event: schemas.EventCreate, db: Session = Depends(database.get_db)
):
    # Public event creation (or fallback to admin creation logic if needed, but here we expose it publicly to match the contract)
    return crud.create_event(db, event)


@router.get("/{event_id}", response_model=schemas.EventResponse)
def get_event_details(event_id: str, db: Session = Depends(database.get_db)):
    db_event = crud.get_event(db, event_id)
    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )
    return db_event


@router.post("/{event_id}/register", response_model=schemas.RegistrationResponse)
def register_for_event(
    event_id: str,
    registration: schemas.RegistrationCreate,
    db: Session = Depends(database.get_db),
):
    db_event = crud.get_event(db, event_id)
    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )

    existing_reg = crud.get_registration_by_email(db, event_id, registration.email)
    if existing_reg:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already registered for this event",
        )

    return crud.create_registration(db, event_id, registration)


@router.post("/{event_id}/feedback", response_model=schemas.FeedbackResponse)
def submit_feedback(
    event_id: str,
    feedback: schemas.FeedbackCreate,
    db: Session = Depends(database.get_db),
):
    db_event = crud.get_event(db, event_id)
    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )
    return crud.create_feedback(db, event_id, feedback)
