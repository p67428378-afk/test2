from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Broker, Property, Inquiry
from server.schemas import DashboardResponse, DashboardListing
from server.dependencies import get_current_broker

router = APIRouter()


@router.get("/brokers/me/dashboard", response_model=DashboardResponse)
def get_dashboard(
    current_broker: Broker = Depends(get_current_broker), db: Session = Depends(get_db)
):
    # Get all properties for current broker
    properties = (
        db.query(Property).filter(Property.broker_id == current_broker.id).all()
    )

    listings = []
    total_inquiries = 0

    for prop in properties:
        inquiries_count = (
            db.query(Inquiry).filter(Inquiry.property_id == prop.id).count()
        )
        total_inquiries += inquiries_count
        listings.append(
            DashboardListing(
                id=prop.id,
                title=prop.title,
                price=float(prop.price),
                inquiries_count=inquiries_count,
            )
        )

    return DashboardResponse(
        active_listings_count=len(properties),
        new_inquiries_count=total_inquiries,
        total_views_count=len(properties) * 12,  # Simulated views count
        listings=listings,
    )
