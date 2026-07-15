from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Property, Inquiry
from server.schemas import InquiryCreate, InquiryResponse

router = APIRouter()


@router.post(
    "/inquiries", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED
)
def create_inquiry(inquiry_in: InquiryCreate, db: Session = Depends(get_db)):
    # Verify property exists
    db_property = (
        db.query(Property).filter(Property.id == inquiry_in.property_id).first()
    )
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")

    db_inquiry = Inquiry(
        property_id=inquiry_in.property_id,
        name=inquiry_in.name,
        email=inquiry_in.email,
        message=inquiry_in.message,
    )
    db.add(db_inquiry)
    db.commit()
    db.refresh(db_inquiry)
    return db_inquiry
