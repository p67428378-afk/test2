from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas.campaign import (
    CampaignCreate,
    CampaignUpdate,
    CampaignResponse,
    CampaignListResponse,
)
from server.services.campaign_service import CampaignService
from server.routers.auth import get_current_admin_user
from server.models.user import User

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


@router.get("", response_model=CampaignListResponse)
def list_campaigns(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search title/description"),
    status: Optional[str] = Query("Active", description="Filter status or 'all'"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    campaigns, total = CampaignService.get_campaigns(
        db, category=category, search=search, status=status, skip=skip, limit=limit
    )

    items = []
    for c in campaigns:
        supporter_count = CampaignService.get_supporter_count(db, c.id)
        resp = CampaignResponse.model_validate(c)
        resp.supporter_count = supporter_count
        items.append(resp)

    return CampaignListResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{campaign_id}", response_model=CampaignResponse)
def get_campaign(campaign_id: str, db: Session = Depends(get_db)):
    campaign = CampaignService.get_campaign_by_id(db, campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found"
        )

    supporter_count = CampaignService.get_supporter_count(db, campaign.id)
    resp = CampaignResponse.model_validate(campaign)
    resp.supporter_count = supporter_count
    return resp


@router.post("", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
def create_campaign(
    campaign_in: CampaignCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    try:
        campaign = CampaignService.create_campaign(db, campaign_in)
        resp = CampaignResponse.model_validate(campaign)
        resp.supporter_count = 0
        return resp
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/{campaign_id}", response_model=CampaignResponse)
def update_campaign(
    campaign_id: str,
    campaign_in: CampaignUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    campaign = CampaignService.get_campaign_by_id(db, campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found"
        )

    try:
        updated = CampaignService.update_campaign(db, campaign, campaign_in)
        supporter_count = CampaignService.get_supporter_count(db, updated.id)
        resp = CampaignResponse.model_validate(updated)
        resp.supporter_count = supporter_count
        return resp
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campaign(
    campaign_id: str,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    campaign = CampaignService.get_campaign_by_id(db, campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found"
        )

    CampaignService.delete_campaign(db, campaign)
    return None
