from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User, Subscription, Order, Product
from server.schemas import UpsellEligibilityResponse, LastOrderResponse, DismissResponse
from server.auth import get_current_user

router = APIRouter()


@router.get("/users/me/upsell-eligibility", response_model=UpsellEligibilityResponse)
def get_upsell_eligibility(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    # Check if user has an active subscription
    active_sub = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == current_user.id, Subscription.status == "active"
        )
        .first()
    )

    if active_sub:
        return UpsellEligibilityResponse(is_eligible=False, last_order=None)

    # Check if user dismissed the banner in the last 30 days
    if current_user.upsell_banner_dismissed_at:
        now = datetime.utcnow()
        if now - current_user.upsell_banner_dismissed_at < timedelta(days=30):
            return UpsellEligibilityResponse(is_eligible=False, last_order=None)

    # Find the user's last order (one-time order)
    last_one_time_order = (
        db.query(Order)
        .filter(Order.user_id == current_user.id, Order.order_type == "one-time")
        .order_by(Order.created_at.desc())
        .first()
    )

    if not last_one_time_order:
        return UpsellEligibilityResponse(is_eligible=False, last_order=None)

    # Get product details
    product = (
        db.query(Product).filter(Product.id == last_one_time_order.product_id).first()
    )
    box_size = product.size if product else "Large"  # Default fallback

    return UpsellEligibilityResponse(
        is_eligible=True,
        last_order=LastOrderResponse(
            id=last_one_time_order.id,
            box_size=box_size,
            price=float(last_one_time_order.amount),
            product_id=str(last_one_time_order.product_id)
            if last_one_time_order.product_id
            else "",
        ),
    )


@router.post("/users/me/upsell-banner/dismiss", response_model=DismissResponse)
def dismiss_upsell_banner(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    now = datetime.utcnow()
    current_user.upsell_banner_dismissed_at = now
    db.commit()
    db.refresh(current_user)

    return DismissResponse(status="success", dismissed_at=now)
