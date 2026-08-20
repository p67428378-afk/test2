"""
Module: server.cron
Purpose: Daily expiry evaluation and notification queuing.
"""

from datetime import date, datetime, timezone
from sqlalchemy.orm import Session
from server.models import Warranty, Product, Notification


def evaluate_warranties(db: Session) -> dict:
    """
    Evaluates all warranties, updates their statuses, and queues milestone notifications.
    Returns a summary of the evaluation.
    """
    today = date.today()
    warranties = db.query(Warranty).all()

    updated_count = 0
    notifications_queued = 0

    for w in warranties:
        # Lifetime warranties are always Active and never expire
        if w.is_lifetime:
            if w.status != "Active":
                w.status = "Active"
                updated_count += 1
            continue

        if not w.expiry_date:
            continue

        # Calculate remaining days
        remaining_days = (w.expiry_date - today).days

        # Determine correct status
        new_status = "Active"
        if remaining_days <= 0:
            new_status = "Expired"
        elif remaining_days <= 30:
            new_status = "Expiring Soon"

        if w.status != new_status:
            w.status = new_status
            updated_count += 1

        # Check for milestones: 30-day, 14-day, 1-day
        milestones = {30: "30-day", 14: "14-day", 1: "1-day"}
        if remaining_days in milestones:
            milestone_name = milestones[remaining_days]

            # Check if notification already sent for this milestone
            existing_notif = (
                db.query(Notification)
                .filter(
                    Notification.product_id == w.product_id,
                    Notification.milestone == milestone_name,
                )
                .first()
            )

            if not existing_notif:
                # Get product to find user_id
                product = db.query(Product).filter(Product.id == w.product_id).first()
                if product:
                    new_notif = Notification(
                        user_id=product.user_id,
                        product_id=product.id,
                        milestone=milestone_name,
                        sent_at=datetime.now(timezone.utc),
                    )
                    db.add(new_notif)
                    notifications_queued += 1

    db.commit()
    return {
        "status": "SUCCESS",
        "warranties_evaluated": len(warranties),
        "statuses_updated": updated_count,
        "notifications_queued": notifications_queued,
    }
