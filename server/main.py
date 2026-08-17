import os
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from server.database import get_db, init_db, seed_data
from server.models import User, Donation, Claim, Delivery, FreshnessLog
from server.schemas import (
    UserRegister,
    UserResponse,
    UserLogin,
    TokenResponse,
    DonationCreate,
    DonationResponse,
    DonationFreshnessUpdate,
    ClaimCreate,
    ClaimResponse,
    DeliveryResponse,
    DeliveryStatusUpdate,
    FreshnessLogResponse,
    AdminAnalytics,
)
from server.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    RoleChecker,
)

app = FastAPI(
    title="Food Donation Management System API",
    version="1.0.0",
    description="API for managing surplus food donations, NGO claims, volunteer deliveries, and freshness monitoring.",
)

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


# Lifespan / Startup Event
@app.on_event("startup")
def on_startup():
    init_db()
    db = next(get_db())
    try:
        seed_data(db)
    finally:
        db.close()


# Freshness Evaluation Helper
def evaluate_and_update_freshness(donation: Donation, db: Session) -> bool:
    """
    Evaluates and updates the freshness status of a donation.
    Returns True if status changed, False otherwise.
    """
    current_time = datetime.now(timezone.utc)

    # Ensure preparation_time is timezone-aware
    prep_time = donation.preparation_time
    if prep_time.tzinfo is None:
        prep_time = prep_time.replace(tzinfo=timezone.utc)

    elapsed_hours = (current_time - prep_time).total_seconds() / 3600.0

    new_status = "FRESH"
    if elapsed_hours >= donation.estimated_shelf_life:
        new_status = "EXPIRED"
    elif elapsed_hours >= (2.0 / 3.0) * donation.estimated_shelf_life:
        new_status = "WARNING"

    if new_status != donation.freshness_status:
        old_status = donation.freshness_status
        donation.freshness_status = new_status
        donation.updated_at = current_time

        # Log freshness change
        log = FreshnessLog(
            donation_id=donation.id,
            old_status=old_status,
            new_status=new_status,
            created_at=current_time,
        )
        db.add(log)

        # If expired, cancel pending claims and deliveries
        if new_status == "EXPIRED":
            pending_claims = (
                db.query(Claim)
                .filter(Claim.donation_id == donation.id, Claim.status == "PENDING")
                .all()
            )
            for claim in pending_claims:
                claim.status = "CANCELLED"
                claim.updated_at = current_time

                # Cancel associated deliveries
                pending_deliveries = (
                    db.query(Delivery)
                    .filter(
                        Delivery.claim_id == claim.id,
                        Delivery.status.in_(
                            [
                                "PENDING",
                                "TASK_ACCEPTED",
                                "ARRIVED_AT_PICKUP",
                                "IN_TRANSIT",
                            ]
                        ),
                    )
                    .all()
                )
                for delivery in pending_deliveries:
                    delivery.status = "CANCELLED"
                    delivery.updated_at = current_time

        db.commit()
        return True
    return False


# --- AUTH ENDPOINTS ---


@app.post(
    "/api/v1/auth/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if email already registered
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    db_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
        name=user_in.name,
        phone=user_in.phone,
        address=user_in.address,
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
    return db_user


@app.post("/api/v1/auth/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}


# --- DONATION ENDPOINTS ---


@app.get("/api/v1/donations", response_model=List[DonationResponse])
def get_donations(
    category: Optional[str] = None,
    storage_condition: Optional[str] = None,
    freshness_status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    # Evaluate freshness for all active donations first
    all_donations = db.query(Donation).all()
    for d in all_donations:
        evaluate_and_update_freshness(d, db)

    query = db.query(Donation)
    if category:
        query = query.filter(Donation.category == category)
    if storage_condition:
        query = query.filter(Donation.storage_condition == storage_condition)
    if freshness_status:
        query = query.filter(Donation.freshness_status == freshness_status)

    # Order by created_at to ensure deterministic ordering
    return query.order_by(Donation.created_at.desc()).offset(skip).limit(limit).all()


@app.post(
    "/api/v1/donations",
    response_model=DonationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_donation(
    donation_in: DonationCreate,
    current_user: User = Depends(RoleChecker(["donor", "admin"])),
    db: Session = Depends(get_db),
):
    current_time = datetime.now(timezone.utc)

    # Ensure preparation_time is timezone-aware
    prep_time = donation_in.preparation_time
    if prep_time.tzinfo is None:
        prep_time = prep_time.replace(tzinfo=timezone.utc)

    # Calculate initial freshness status
    elapsed_hours = (current_time - prep_time).total_seconds() / 3600.0
    initial_status = "FRESH"
    if elapsed_hours >= donation_in.estimated_shelf_life:
        initial_status = "EXPIRED"
    elif elapsed_hours >= (2.0 / 3.0) * donation_in.estimated_shelf_life:
        initial_status = "WARNING"

    db_donation = Donation(
        donor_id=current_user.id,
        category=donation_in.category,
        quantity=donation_in.quantity,
        preparation_time=prep_time,
        storage_condition=donation_in.storage_condition,
        pickup_address=donation_in.pickup_address,
        estimated_shelf_life=donation_in.estimated_shelf_life,
        freshness_status=initial_status,
    )
    db.add(db_donation)
    try:
        db.commit()
        db.refresh(db_donation)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create donation: {str(e)}",
        )
    return db_donation


@app.patch("/api/v1/donations/{id}/freshness", response_model=DonationResponse)
def update_freshness(
    id: str,
    freshness_in: DonationFreshnessUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    donation = db.query(Donation).filter(Donation.id == id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found"
        )

    old_status = donation.freshness_status
    new_status = freshness_in.freshness_status

    if old_status != new_status:
        donation.freshness_status = new_status
        donation.updated_at = datetime.now(timezone.utc)

        # Log freshness change
        log = FreshnessLog(
            donation_id=donation.id,
            old_status=old_status,
            new_status=new_status,
            created_at=datetime.now(timezone.utc),
        )
        db.add(log)

        # If expired, cancel pending claims and deliveries
        if new_status == "EXPIRED":
            pending_claims = (
                db.query(Claim)
                .filter(Claim.donation_id == donation.id, Claim.status == "PENDING")
                .all()
            )
            for claim in pending_claims:
                claim.status = "CANCELLED"
                claim.updated_at = datetime.now(timezone.utc)

                # Cancel associated deliveries
                pending_deliveries = (
                    db.query(Delivery)
                    .filter(
                        Delivery.claim_id == claim.id,
                        Delivery.status.in_(
                            [
                                "PENDING",
                                "TASK_ACCEPTED",
                                "ARRIVED_AT_PICKUP",
                                "IN_TRANSIT",
                            ]
                        ),
                    )
                    .all()
                )
                for delivery in pending_deliveries:
                    delivery.status = "CANCELLED"
                    delivery.updated_at = datetime.now(timezone.utc)

        try:
            db.commit()
            db.refresh(donation)
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update freshness: {str(e)}",
            )
    return donation


# --- CLAIM ENDPOINTS ---


@app.post(
    "/api/v1/claims", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED
)
def create_claim(
    claim_in: ClaimCreate,
    current_user: User = Depends(RoleChecker(["ngo", "admin"])),
    db: Session = Depends(get_db),
):
    # Fetch donation and evaluate freshness
    donation = db.query(Donation).filter(Donation.id == claim_in.donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found"
        )

    evaluate_and_update_freshness(donation, db)

    if donation.freshness_status == "EXPIRED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot claim an expired donation",
        )

    # Check available quantity
    # Calculate total claimed quantity for this donation
    claimed_qty = (
        db.query(Claim)
        .filter(Claim.donation_id == donation.id, Claim.status != "CANCELLED")
        .with_entities(Claim.quantity)
        .all()
    )
    total_claimed = sum(c[0] for c in claimed_qty)

    available_qty = donation.quantity - total_claimed
    if claim_in.quantity > available_qty:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient quantity available. Requested: {claim_in.quantity}, Available: {available_qty}",
        )

    # Create claim
    db_claim = Claim(
        donation_id=claim_in.donation_id,
        ngo_id=current_user.id,
        quantity=claim_in.quantity,
        target_pickup_time=claim_in.target_pickup_time,
        status="PENDING",
    )
    db.add(db_claim)

    try:
        db.commit()
        db.refresh(db_claim)

        # Automatically create a delivery task for volunteers
        db_delivery = Delivery(claim_id=db_claim.id, status="PENDING")
        db.add(db_delivery)
        db.commit()

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create claim: {str(e)}",
        )

    return db_claim


@app.get("/api/v1/claims", response_model=List[ClaimResponse])
def get_claims(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Claim)
    if current_user.role == "ngo":
        query = query.filter(Claim.ngo_id == current_user.id)
    elif current_user.role == "donor":
        # Donors can see claims for their donations
        query = query.join(Donation).filter(Donation.donor_id == current_user.id)

    return query.order_by(Claim.created_at.desc()).offset(skip).limit(limit).all()


# --- DELIVERY ENDPOINTS ---


@app.get("/api/v1/deliveries", response_model=List[DeliveryResponse])
def get_deliveries(
    volunteer_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Delivery)
    if volunteer_id:
        query = query.filter(Delivery.volunteer_id == volunteer_id)
    elif current_user.role == "volunteer":
        # Volunteers can see unassigned deliveries or their own
        query = query.filter(
            (Delivery.volunteer_id == current_user.id) | (Delivery.volunteer_id == None)
        )
    elif current_user.role == "ngo":
        # NGOs can see deliveries for their claims
        query = query.join(Claim).filter(Claim.ngo_id == current_user.id)
    elif current_user.role == "donor":
        # Donors can see deliveries for their donations
        query = (
            query.join(Claim)
            .join(Donation)
            .filter(Donation.donor_id == current_user.id)
        )

    if status_filter:
        query = query.filter(Delivery.status == status_filter)

    return query.order_by(Delivery.created_at.desc()).offset(skip).limit(limit).all()


@app.patch("/api/v1/deliveries/{id}/status", response_model=DeliveryResponse)
def update_delivery_status(
    id: str,
    delivery_in: DeliveryStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    delivery = db.query(Delivery).filter(Delivery.id == id).first()
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Delivery not found"
        )

    # Role check: only volunteers or admins can update delivery status
    if current_user.role not in ["volunteer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only volunteers or admins can update delivery status",
        )

    # If volunteer is accepting the task
    if delivery_in.status == "TASK_ACCEPTED":
        if delivery.volunteer_id and delivery.volunteer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Delivery task is already assigned to another volunteer",
            )
        delivery.volunteer_id = current_user.id

    # If volunteer is cancelling/releasing the task mid-transit
    elif delivery_in.status == "CANCELLED" and delivery.status in [
        "TASK_ACCEPTED",
        "ARRIVED_AT_PICKUP",
        "IN_TRANSIT",
    ]:
        # Return to unassigned pool
        delivery.volunteer_id = None
        delivery.status = "PENDING"
        delivery.updated_at = datetime.now(timezone.utc)
        try:
            db.commit()
            db.refresh(delivery)
            return delivery
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to cancel delivery task: {str(e)}",
            )

    # Update fields
    delivery.status = delivery_in.status
    if delivery_in.photo_url is not None:
        delivery.photo_url = delivery_in.photo_url
    if delivery_in.signature is not None:
        delivery.signature = delivery_in.signature

    delivery.updated_at = datetime.now(timezone.utc)

    # If delivered, update claim status to COMPLETED
    if delivery_in.status == "DELIVERED":
        claim = db.query(Claim).filter(Claim.id == delivery.claim_id).first()
        if claim:
            claim.status = "COMPLETED"
            claim.updated_at = datetime.now(timezone.utc)

    try:
        db.commit()
        db.refresh(delivery)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update delivery status: {str(e)}",
        )

    return delivery


# --- ADMIN ENDPOINTS ---


@app.get("/api/v1/admin/analytics", response_model=AdminAnalytics)
def get_admin_analytics(
    current_user: User = Depends(RoleChecker(["admin"])), db: Session = Depends(get_db)
):
    # Total rescued kg (sum of quantity of completed claims)
    completed_claims = db.query(Claim).filter(Claim.status == "COMPLETED").all()
    total_rescued = sum(c.quantity for c in completed_claims)

    # Active routes (deliveries in progress)
    active_routes = (
        db.query(Delivery)
        .filter(
            Delivery.status.in_(["TASK_ACCEPTED", "ARRIVED_AT_PICKUP", "IN_TRANSIT"])
        )
        .count()
    )

    # Successful deliveries
    successful_deliveries = (
        db.query(Delivery).filter(Delivery.status == "DELIVERED").count()
    )

    # Total claims
    total_claims = db.query(Claim).count()

    return {
        "total_rescued_kg": total_rescued,
        "active_routes": active_routes,
        "successful_deliveries_count": successful_deliveries,
        "total_claims_count": total_claims,
    }


@app.get("/api/v1/admin/audit-logs", response_model=List[FreshnessLogResponse])
def get_admin_audit_logs(
    current_user: User = Depends(RoleChecker(["admin"])),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return (
        db.query(FreshnessLog)
        .order_by(FreshnessLog.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
