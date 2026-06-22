from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.post(
    "/contact",
    response_model=schemas.InquiryResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_contact_form(inquiry: schemas.InquiryCreate, db: Session = Depends(get_db)):
    crud.create_inquiry(db, inquiry)
    return schemas.InquiryResponse(message="Inquiry received", status="success")
