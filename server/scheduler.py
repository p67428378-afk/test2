from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from server.models import Subscription, Order, User
from server.email_service import send_email


def run_daily_billing_and_notifications(db: Session):
    now = datetime.utcnow()

    # 1. Pre-payment reminder 5 days before
    five_days_from_now_start = (now + timedelta(days=5)).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    five_days_from_now_end = five_days_from_now_start + timedelta(days=1)

    upcoming_subs = (
        db.query(Subscription)
        .filter(
            Subscription.next_payment_date >= five_days_from_now_start,
            Subscription.next_payment_date < five_days_from_now_end,
            Subscription.status == "active",
        )
        .all()
    )

    for sub in upcoming_subs:
        user = db.query(User).filter(User.id == sub.user_id).first()
        if user:
            email = getattr(user, "email", getattr(user, "login_id", ""))
            send_email(
                to_email=email,
                subject="Upcoming Chocolate Box Subscription Charge",
                body=f"Heads up! Your card will be charged in 5 days on {sub.next_payment_date.strftime('%Y-%m-%d')} for your {sub.box_size} chocolate box.",
            )

    # 2. Process payments due today
    due_subs = (
        db.query(Subscription)
        .filter(Subscription.next_payment_date <= now, Subscription.status == "active")
        .all()
    )

    for sub in due_subs:
        user = db.query(User).filter(User.id == sub.user_id).first()
        if not user:
            continue

        email = getattr(user, "email", getattr(user, "login_id", ""))

        # Calculate price
        base_prices = {"Small": 25.00, "Medium": 45.00, "Large": 80.00}
        base_price = base_prices.get(sub.box_size, 45.00)
        discounted_price = base_price * 0.90

        if sub.skip_next:
            # Skip this cycle
            sub.skip_next = False
            sub.next_payment_date = sub.next_payment_date + timedelta(
                weeks=sub.frequency_weeks
            )
            sub.updated_at = now
            db.commit()
            send_email(
                to_email=email,
                subject="Subscription Skipped",
                body=f"Your subscription delivery for {sub.box_size} box has been skipped as requested. Your next delivery is scheduled for {sub.next_payment_date.strftime('%Y-%m-%d')}.",
            )
            continue

        # Create order
        order = Order(
            subscription_id=sub.id,
            amount=discounted_price,
            status="pending",
            created_at=now,
        )
        db.add(order)
        db.commit()

        # Simulate payment charge (mocking success by default, webhook handles actual state changes)
        # In a real system, we would call the payment gateway here.
        # For the scheduler, we simulate a successful charge:
        order.status = "Paid"
        order.payment_date = now
        sub.next_payment_date = sub.next_payment_date + timedelta(
            weeks=sub.frequency_weeks
        )
        sub.updated_at = now
        db.commit()

        send_email(
            to_email=email,
            subject="Payment Confirmation",
            body=f"Thank you! Your payment of ${discounted_price:.2f} for the {sub.box_size} chocolate box was successful.",
        )
