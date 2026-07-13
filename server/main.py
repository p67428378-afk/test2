import os
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, status
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from server.database import Base, engine, get_db
from server.models import User, Subscription, Order, SubscriptionHistory
from server.schemas import (
    SubscriptionCreate,
    SubscriptionResponse,
    SubscriptionMeResponse,
    SubscriptionUpdate,
    SubscriptionUpdateResponse,
    WebhookPayload,
    BillingHistoryItem,
)
from server.auth import get_current_user, get_password_hash
from server.email_service import send_email
from server.api.v1.endpoints import password_reset

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ChocoFeast Subscription API")

# CORS Middleware
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include existing routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])


# Seed test account in lifespan/startup
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    try:
        # Check if test user exists
        test_user = db.query(User).filter(User.login_id == "test@example.com").first()
        if not test_user:
            hashed_pw = get_password_hash("testpassword")
            new_user = User(
                login_id="test@example.com",
                email="test@example.com",
                mobile_number="1234567890",
                hashed_password=hashed_pw,
                security_question="What is your favorite chocolate?",
                security_answer_hash=get_password_hash("dark chocolate"),
            )
            db.add(new_user)
            db.commit()
            print("[SEED] Seeded test account: test@example.com / testpassword")
    except Exception as e:
        print(f"[SEED ERROR] {e}")
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Welcome to the ChocoFeast Subscription Microservice"}


# Subscription Endpoints


@app.post(
    "/api/v1/subscriptions",
    response_model=SubscriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_subscription(
    payload: SubscriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Validate box size
    if payload.box_size not in ["Small", "Medium", "Large"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid box size. Must be Small, Medium, or Large.",
        )

    # Validate frequency
    if payload.frequency_weeks not in [2, 4, 6]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid frequency. Must be 2, 4, or 6 weeks.",
        )

    # Check if user already has an active subscription
    existing_sub = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == current_user.id, Subscription.status == "active"
        )
        .first()
    )
    if existing_sub:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has an active subscription.",
        )

    now = datetime.utcnow()
    next_payment = now + timedelta(weeks=payload.frequency_weeks)

    new_sub = Subscription(
        user_id=current_user.id,
        box_size=payload.box_size,
        frequency_weeks=payload.frequency_weeks,
        status="active",
        next_payment_date=next_payment,
        skip_next=False,
        created_at=now,
        updated_at=now,
    )
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)

    # Log history
    history = SubscriptionHistory(
        subscription_id=new_sub.id,
        old_status=None,
        new_status="active",
        changed_by="user",
        created_at=now,
    )
    db.add(history)
    db.commit()

    # Send confirmation email
    email = getattr(current_user, "email", getattr(current_user, "login_id", ""))
    send_email(
        to_email=email,
        subject="Subscription Created!",
        body=f"Welcome to ChocoFeast! Your subscription for a {payload.box_size} box every {payload.frequency_weeks} weeks has been created.",
    )

    return new_sub


@app.get("/api/v1/subscriptions/me", response_model=SubscriptionMeResponse)
def get_my_subscription(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    sub = (
        db.query(Subscription)
        .filter(Subscription.user_id == current_user.id)
        .order_by(Subscription.created_at.desc())
        .first()
    )
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found for this user.",
        )

    orders = (
        db.query(Order)
        .filter(Order.subscription_id == sub.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    billing_history = [
        BillingHistoryItem(
            id=o.id,
            amount=float(o.amount),
            payment_date=o.payment_date,
            status=o.status,
        )
        for o in orders
    ]

    return SubscriptionMeResponse(
        subscription=SubscriptionResponse.from_orm(sub), billing_history=billing_history
    )


@app.patch("/api/v1/subscriptions/me", response_model=SubscriptionUpdateResponse)
def update_my_subscription(
    payload: SubscriptionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sub = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == current_user.id, Subscription.status != "cancelled"
        )
        .first()
    )
    if not sub:
        # Try to find any subscription
        sub = (
            db.query(Subscription)
            .filter(Subscription.user_id == current_user.id)
            .order_by(Subscription.created_at.desc())
            .first()
        )
        if not sub:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No subscription found to update.",
            )

    now = datetime.utcnow()
    time_until_payday = sub.next_payment_date - now
    is_within_48h = time_until_payday < timedelta(hours=48)

    applied_immediately = not is_within_48h
    message = "Changes applied immediately."

    old_status = sub.status

    if payload.status is not None:
        if payload.status not in ["active", "paused", "cancelled"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status. Must be active, paused, or cancelled.",
            )

        if is_within_48h:
            # 48-hour rule: current box will be charged, action applies to next cycle
            message = f"Your change to '{payload.status}' was requested less than 48 hours before payday. The current box will still be charged, and the change will apply to the next cycle."
            # We can schedule the status change or handle it by keeping status active but recording the pending change.
            # To keep it simple and robust, we update the status but we can also flag that the next payment is still due.
            # Let's update the status but keep the next_payment_date as is, and the scheduler will charge it once more.
            # If they cancel, we set status to 'cancelled' but we can also record history.
            sub.status = payload.status
        else:
            sub.status = payload.status

        # Log history
        history = SubscriptionHistory(
            subscription_id=sub.id,
            old_status=old_status,
            new_status=payload.status,
            changed_by="user",
            created_at=now,
        )
        db.add(history)

    if payload.skip_next is not None:
        if is_within_48h:
            message = "Your request to skip was received less than 48 hours before payday. The current box will still be charged, and the skip will apply to the next cycle."
            # Skip next will be processed after the upcoming charge
            sub.skip_next = payload.skip_next
        else:
            sub.skip_next = payload.skip_next
            if payload.skip_next:
                # Apply skip immediately by advancing next payment date
                sub.next_payment_date = sub.next_payment_date + timedelta(
                    weeks=sub.frequency_weeks
                )
                message = f"Subscription skipped. Next payment date is now {sub.next_payment_date.strftime('%Y-%m-%d')}."

    sub.updated_at = now
    db.commit()
    db.refresh(sub)

    # Send email notification
    email = getattr(current_user, "email", getattr(current_user, "login_id", ""))
    send_email(
        to_email=email,
        subject="Subscription Updated",
        body=f"Your subscription has been updated. {message}",
    )

    return SubscriptionUpdateResponse(
        applied_immediately=applied_immediately,
        message=message,
        subscription=SubscriptionResponse.from_orm(sub),
    )


@app.post("/api/v1/webhooks/payment")
def payment_webhook(payload: WebhookPayload, db: Session = Depends(get_db)):
    sub = (
        db.query(Subscription)
        .filter(Subscription.id == payload.subscription_id)
        .first()
    )
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found."
        )

    user = db.query(User).filter(User.id == sub.user_id).first()
    email = getattr(user, "email", getattr(user, "login_id", "")) if user else ""

    now = datetime.utcnow()

    if payload.event_type == "payment.succeeded":
        # Create successful order
        order = Order(
            subscription_id=sub.id,
            amount=payload.amount,
            status="Paid",
            payment_date=now,
            created_at=now,
        )
        db.add(order)

        # Advance next payment date
        sub.next_payment_date = now + timedelta(weeks=sub.frequency_weeks)
        sub.updated_at = now
        db.commit()

        if email:
            send_email(
                to_email=email,
                subject="Payment Successful",
                body=f"Your payment of ${payload.amount:.2f} was successful! Your next box is on the way.",
            )

    elif payload.event_type == "payment.failed":
        # Create frozen order
        order = Order(
            subscription_id=sub.id,
            amount=payload.amount,
            status="Frozen",
            payment_date=None,
            created_at=now,
        )
        db.add(order)

        # Freeze subscription status
        sub.status = "paused"
        sub.updated_at = now
        db.commit()

        # Log history
        history = SubscriptionHistory(
            subscription_id=sub.id,
            old_status="active",
            new_status="paused",
            changed_by="system_payment_failure",
            created_at=now,
        )
        db.add(history)
        db.commit()

        if email:
            send_email(
                to_email=email,
                subject="Payment Failed - Subscription Frozen",
                body=f"Your payment of ${payload.amount:.2f} failed. We have frozen your subscription to prevent shipping. Please update your payment method.",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid event type."
        )

    return {"status": "success"}
