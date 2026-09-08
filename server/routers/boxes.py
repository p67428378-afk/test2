from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from server.database import get_db
from server.models import (
    Box,
    Curation,
    GiftSubscription,
    BoxCustomization,
    generate_uuid,
    get_utc_now,
)
from server.schemas import (
    BoxListItem,
    BoxListResponse,
    BoxDetail,
    CurationResponse,
    ReviewResponse,
    GiftSubscriptionCreate,
    GiftSubscriptionResponse,
    CustomizationOption,
    CustomizationRequest,
    CustomizationResponse,
)
from server.auth import get_optional_current_user

router = APIRouter(prefix="/api/v1/boxes", tags=["boxes"])


@router.get("", response_model=BoxListResponse)
def get_boxes(
    category_id: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    search: Optional[str] = None,
    billing_frequency: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Box).filter(Box.is_active.is_(True))

    if category_id:
        query = query.filter(Box.category_id == category_id)

    if min_price is not None:
        query = query.filter(Box.price >= min_price)

    if max_price is not None:
        query = query.filter(Box.price <= max_price)

    if min_rating is not None:
        query = query.filter(Box.average_rating >= min_rating)

    if billing_frequency:
        query = query.filter(Box.billing_frequency.ilike(f"%{billing_frequency}%"))

    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                Box.title.ilike(term),
                Box.description.ilike(term),
                Box.slug.ilike(term),
            )
        )

    total = query.count()
    boxes = (
        query.order_by(Box.average_rating.desc(), Box.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    items = []
    for b in boxes:
        cat_name = b.category.name if b.category else None
        item = BoxListItem(
            id=str(b.id),
            title=str(b.title),
            slug=str(b.slug),
            category_id=str(b.category_id),
            category_name=str(cat_name) if cat_name else None,
            description=str(b.description) if b.description else None,
            price=float(b.price),
            billing_frequency=str(b.billing_frequency),
            image_url=str(b.image_url) if b.image_url else None,
            average_rating=float(b.average_rating),
            total_reviews=int(b.total_reviews),
            is_active=bool(b.is_active),
            created_at=b.created_at,
            updated_at=b.updated_at,
        )
        items.append(item)

    return BoxListResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{id}", response_model=BoxDetail)
def get_box_detail(id: str, db: Session = Depends(get_db)):
    box = db.query(Box).filter(or_(Box.id == id, Box.slug == id)).first()
    if not box:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subscription box '{id}' not found",
        )

    cat_name = box.category.name if box.category else None

    # Load curations
    curations_resp = []
    for c in box.curations:
        curations_resp.append(
            CurationResponse(
                id=str(c.id),
                box_id=str(c.box_id),
                month_year=str(c.month_year),
                theme_title=str(c.theme_title),
                highlights=str(c.highlights) if c.highlights else None,
                item_list=c.item_list or [],
                available_replacements=c.available_replacements or [],
                created_at=c.created_at,
            )
        )

    # Load reviews
    reviews_resp = []
    for r in box.reviews:
        reviews_resp.append(
            ReviewResponse(
                id=str(r.id),
                box_id=str(r.box_id),
                user_id=str(r.user_id),
                rating=int(r.rating),
                comment=str(r.comment),
                created_at=r.created_at,
                user_email=str(r.user.email) if r.user else None,
                user_name=str(r.user.full_name) if r.user else None,
            )
        )

    return BoxDetail(
        id=str(box.id),
        title=str(box.title),
        slug=str(box.slug),
        category_id=str(box.category_id),
        category_name=str(cat_name) if cat_name else None,
        description=str(box.description) if box.description else None,
        price=float(box.price),
        billing_frequency=str(box.billing_frequency),
        image_url=str(box.image_url) if box.image_url else None,
        average_rating=float(box.average_rating),
        total_reviews=int(box.total_reviews),
        is_active=bool(box.is_active),
        created_at=box.created_at,
        updated_at=box.updated_at,
        curations=curations_resp,
        reviews=reviews_resp,
    )


# ---------------- Gift Subscription Endpoint [NEW] ----------------
@router.post(
    "/{id}/gift",
    response_model=GiftSubscriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_gift_subscription(
    id: str,
    gift_in: GiftSubscriptionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_optional_current_user),
):
    box = db.query(Box).filter(or_(Box.id == id, Box.slug == id)).first()
    if not box:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subscription box '{id}' not found",
        )

    if not gift_in.recipient_email or "@" not in gift_in.recipient_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid recipient email address",
        )

    gift = GiftSubscription(
        id=generate_uuid(),
        box_id=str(box.id),
        sender_id=str(current_user.id) if current_user else None,
        recipient_email=str(gift_in.recipient_email).strip().lower(),
        message=gift_in.message.strip() if gift_in.message else None,
        status="pending",
        created_at=get_utc_now(),
        updated_at=get_utc_now(),
    )
    db.add(gift)
    db.commit()
    db.refresh(gift)

    return GiftSubscriptionResponse(
        id=str(gift.id),
        box_id=str(gift.box_id),
        sender_id=str(gift.sender_id) if gift.sender_id else None,
        recipient_email=str(gift.recipient_email),
        message=str(gift.message) if gift.message else None,
        status=str(gift.status),
        created_at=gift.created_at,
    )


# ---------------- Box Customizations Endpoints [NEW] ----------------
@router.get("/{id}/customizations", response_model=CustomizationOption)
def get_box_customizations(id: str, db: Session = Depends(get_db)):
    box = db.query(Box).filter(or_(Box.id == id, Box.slug == id)).first()
    if not box:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subscription box '{id}' not found",
        )

    curation = (
        db.query(Curation)
        .filter(Curation.box_id == box.id)
        .order_by(Curation.created_at.desc())
        .first()
    )
    if not curation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active monthly curation available for customization on this box",
        )

    return CustomizationOption(
        box_id=str(box.id),
        curation_id=str(curation.id),
        curation_theme=str(curation.theme_title),
        max_swaps_allowed=1,
        current_items=list(curation.item_list or []),
        available_replacements=list(curation.available_replacements or []),
    )


@router.post(
    "/{id}/customizations",
    response_model=CustomizationResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_box_customization(
    id: str,
    custom_in: CustomizationRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_optional_current_user),
):
    box = db.query(Box).filter(or_(Box.id == id, Box.slug == id)).first()
    if not box:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subscription box '{id}' not found",
        )

    curation = (
        db.query(Curation)
        .filter(Curation.box_id == box.id)
        .order_by(Curation.created_at.desc())
        .first()
    )
    if not curation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active curation found for this box",
        )

    # 1. Verify original_item_id exists in curation items
    current_items = list(curation.item_list or [])
    orig_found = any(
        item.get("id") == custom_in.original_item_id for item in current_items
    )
    if not orig_found:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Original item '{custom_in.original_item_id}' is not in this curation's items list",
        )

    # 2. Verify replacement_item_id exists in available replacements and is in stock
    available_replacements = list(curation.available_replacements or [])
    replacement_item = next(
        (
            rep
            for rep in available_replacements
            if rep.get("id") == custom_in.replacement_item_id
        ),
        None,
    )
    if not replacement_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Replacement item '{custom_in.replacement_item_id}' is not an eligible option",
        )

    if replacement_item.get("in_stock") is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Selected replacement item '{replacement_item.get('name', custom_in.replacement_item_id)}' is out of stock",
        )

    # Check if for_item_id is restricted to this item
    if (
        replacement_item.get("for_item_id")
        and replacement_item.get("for_item_id") != custom_in.original_item_id
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Replacement '{custom_in.replacement_item_id}' can only replace '{replacement_item.get('for_item_id')}'",
        )

    # Record customization (enforces exactly 1 swap per request)
    customization = BoxCustomization(
        id=generate_uuid(),
        box_id=str(box.id),
        curation_id=str(curation.id),
        user_id=str(current_user.id) if current_user else None,
        original_item_id=custom_in.original_item_id,
        replacement_item_id=custom_in.replacement_item_id,
        status="confirmed",
        created_at=get_utc_now(),
    )
    db.add(customization)
    db.commit()
    db.refresh(customization)

    return CustomizationResponse(
        id=str(customization.id),
        box_id=str(customization.box_id),
        curation_id=str(customization.curation_id),
        user_id=str(customization.user_id) if customization.user_id else None,
        original_item_id=str(customization.original_item_id),
        replacement_item_id=str(customization.replacement_item_id),
        status=str(customization.status),
        created_at=customization.created_at,
    )
