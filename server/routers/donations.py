from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from server.database import get_db
from server.models import User, Donation, DonationRequest, Delivery
from server.schemas import (
    DonationCreate,
    DonationResponse,
    DonationListResponse,
    DonationRequestResponse,
)
from server.auth import get_current_user, require_restaurant, require_ngo

router = APIRouter(prefix="/donations", tags=["donations"])


@router.post("", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
def create_donation(
    donation_in: DonationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_restaurant),
):
    new_donation = Donation(
        restaurant_id=current_user.id,
        description=donation_in.description,
        quantity=donation_in.quantity,
        status="available",
        best_before_dt=donation_in.best_before_dt,
        food_type=donation_in.food_type,
        pickup_location=donation_in.pickup_location or current_user.address,
    )
    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)
    return new_donation


@router.get("", response_model=List[DonationListResponse])
def list_donations(
    status: Optional[str] = None,
    food_type: Optional[str] = None,
    quantity: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Donation)
    if status:
        query = query.filter(Donation.status == status)
    if food_type:
        query = query.filter(Donation.food_type.ilike(f"%{food_type}%"))
    if quantity:
        query = query.filter(Donation.quantity.ilike(f"%{quantity}%"))

    donations = query.all()

    # Map to response schema with restaurant_name
    results = []
    for d in donations:
        results.append(
            {
                "id": d.id,
                "restaurant_id": d.restaurant_id,
                "restaurant_name": d.restaurant.full_name
                if d.restaurant
                else "Unknown Restaurant",
                "description": d.description,
                "quantity": d.quantity,
                "status": d.status,
                "best_before_dt": d.best_before_dt,
                "food_type": d.food_type,
                "pickup_location": d.pickup_location,
                "created_at": d.created_at,
            }
        )
    return results


@router.get("/{donation_id}", response_model=DonationListResponse)
def get_donation(
    donation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found"
        )

    return {
        "id": donation.id,
        "restaurant_id": donation.restaurant_id,
        "restaurant_name": donation.restaurant.full_name
        if donation.restaurant
        else "Unknown Restaurant",
        "description": donation.description,
        "quantity": donation.quantity,
        "status": donation.status,
        "best_before_dt": donation.best_before_dt,
        "food_type": donation.food_type,
        "pickup_location": donation.pickup_location,
        "created_at": donation.created_at,
    }


@router.post(
    "/{donation_id}/request",
    response_model=DonationRequestResponse,
    status_code=status.HTTP_201_CREATED,
)
def request_donation(
    donation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_ngo),
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found"
        )

    if donation.status != "available":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Donation is not available"
        )

    # Update donation status
    donation.status = "requested"

    # Create donation request
    req = DonationRequest(
        donation_id=donation.id,
        ngo_id=current_user.id,
        status="accepted",  # Automatically accept the request to trigger delivery
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    # Create delivery task
    delivery = Delivery(
        request_id=req.id,
        volunteer_id=None,
        status="assigned",  # Default status as per schema
    )
    db.add(delivery)
    db.commit()

    return req
