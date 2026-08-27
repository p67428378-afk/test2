from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas.donation import (
    DonationCreate,
    DonationResponse,
    DonationListResponse,
)
from server.services.donation_service import DonationService
from server.routers.auth import (
    get_current_user,
    get_current_admin_user,
    get_optional_current_user,
)
from server.models.user import User

router = APIRouter(prefix="/donations", tags=["Donations"])


@router.post("", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
def create_donation(
    donation_in: DonationCreate,
    db: Session = Depends(get_db),
    optional_user: Optional[User] = Depends(get_optional_current_user),
):
    try:
        user_id = optional_user.id if optional_user else None
        donation = DonationService.process_donation(db, donation_in, user_id=user_id)
        resp = DonationResponse.model_validate(donation)
        resp.campaign_title = donation.campaign.title if donation.campaign else None
        return resp
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/my-donations", response_model=DonationListResponse)
def get_my_donations(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    donations, total = DonationService.get_user_donations(
        db, user_id=current_user.id, skip=skip, limit=limit
    )
    items = []
    for d in donations:
        resp = DonationResponse.model_validate(d)
        resp.campaign_title = d.campaign.title if d.campaign else None
        items.append(resp)

    return DonationListResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("", response_model=None)
def list_donations(
    campaign_id: Optional[str] = Query(None, description="Filter by campaign ID"),
    donor_name: Optional[str] = Query(None, description="Filter by donor name"),
    donor_email: Optional[str] = Query(None, description="Filter by donor email"),
    export_csv: bool = Query(False, description="Export as CSV file"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    if export_csv:
        csv_data = DonationService.export_donations_csv(db, campaign_id=campaign_id)
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment; filename=donations_export.csv"
            },
        )

    donations, total = DonationService.get_donations(
        db,
        campaign_id=campaign_id,
        donor_name=donor_name,
        donor_email=donor_email,
        skip=skip,
        limit=limit,
    )

    items = []
    for d in donations:
        resp = DonationResponse.model_validate(d)
        resp.campaign_title = d.campaign.title if d.campaign else None
        items.append(resp)

    return DonationListResponse(items=items, total=total, skip=skip, limit=limit)
