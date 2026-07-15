from fastapi import FastAPI, Depends, HTTPException, Query, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from uuid import UUID
import uuid
import math
from typing import List, Optional

from server.database import Base, engine, get_db
from server.config import settings
from server import models, schemas, crud, services
from server.api.v1.endpoints import password_reset

# Ensure tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Online Personal Loan Application API")

# CORS Middleware configuration
ALLOWED_ORIGINS = settings.ALLOWED_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include existing password reset router
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])


# Seed test account and initial loan products on startup
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    try:
        # Seed test customer
        test_customer = (
            db.query(models.Customer)
            .filter(models.Customer.email == "test@example.com")
            .first()
        )
        if not test_customer:
            test_customer = models.Customer(
                id=UUID("00000000-0000-0000-0000-000000000001"),
                name="Test Customer",
                email="test@example.com",
                role="customer",
            )
            db.add(test_customer)

        # Seed test loan officer
        test_officer = (
            db.query(models.Customer)
            .filter(models.Customer.email == "officer@example.com")
            .first()
        )
        if not test_officer:
            test_officer = models.Customer(
                id=UUID("00000000-0000-0000-0000-000000000002"),
                name="Test Officer",
                email="officer@example.com",
                role="loan officer",
            )
            db.add(test_officer)

        # Seed initial loan products if none exist
        if db.query(models.LoanProduct).count() == 0:
            products = [
                models.LoanProduct(
                    id=UUID("11111111-1111-1111-1111-111111111111"),
                    name="Personal Loan",
                    interest_rate=10.5,
                    min_tenure_months=12,
                    max_tenure_months=60,
                    max_loan_amount=500000.00,
                ),
                models.LoanProduct(
                    id=UUID("22222222-2222-2222-2222-222222222222"),
                    name="Auto Loan",
                    interest_rate=8.5,
                    min_tenure_months=12,
                    max_tenure_months=84,
                    max_loan_amount=1500000.00,
                ),
                models.LoanProduct(
                    id=UUID("33333333-3333-3333-3333-333333333333"),
                    name="Education Loan",
                    interest_rate=6.5,
                    min_tenure_months=12,
                    max_tenure_months=120,
                    max_loan_amount=2000000.00,
                ),
            ]
            db.add_all(products)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Welcome to the Online Personal Loan Application API"}


# 1. GET /api/v1/loan-products
@app.get("/api/v1/loan-products", response_model=List[schemas.LoanProductResponse])
def get_loan_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1),
    type: Optional[str] = None,
    tenure: Optional[int] = None,
    max_emi: Optional[float] = None,
    db: Session = Depends(get_db),
):
    return crud.get_loan_products(
        db,
        skip=skip,
        limit=limit,
        type_filter=type,
        tenure_filter=tenure,
        max_emi_filter=max_emi,
    )


# 2. POST /api/v1/loans/calculate-emi
@app.post("/api/v1/loans/calculate-emi", response_model=schemas.EMICalculateResponse)
def calculate_emi(payload: schemas.EMICalculateRequest):
    if (
        payload.loan_amount <= 0
        or payload.interest_rate < 0
        or payload.tenure_months <= 0
    ):
        raise HTTPException(
            status_code=422, detail="Invalid input parameters for EMI calculation"
        )
    result = services.calculate_reducing_balance_emi(
        payload.loan_amount, payload.interest_rate, payload.tenure_months
    )
    return result


# 3. POST /api/v1/loans/applications
@app.post(
    "/api/v1/loans/applications",
    response_model=schemas.LoanApplicationCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_loan_application(
    payload: schemas.LoanApplicationCreate, db: Session = Depends(get_db)
):
    # Fetch product
    product = (
        db.query(models.LoanProduct)
        .filter(models.LoanProduct.id == payload.product_id)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Loan product not found")

    # Fetch customer
    customer = (
        db.query(models.Customer)
        .filter(models.Customer.id == payload.customer_id)
        .first()
    )
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Validate loan amount and tenure range
    if not (
        product.min_tenure_months <= payload.tenure_months <= product.max_tenure_months
    ):
        raise HTTPException(
            status_code=400,
            detail=f"Tenure must be between {product.min_tenure_months} and {product.max_tenure_months} months",
        )
    if payload.requested_amount <= 0 or payload.requested_amount > float(
        product.max_loan_amount
    ):
        raise HTTPException(
            status_code=400,
            detail=f"Requested amount must be greater than 0 and up to {product.max_loan_amount}",
        )

    # Check duplicate active applications
    if crud.check_duplicate_application(db, payload.customer_id, payload.product_id):
        raise HTTPException(
            status_code=409,
            detail="An active application for this product already exists for this customer",
        )

    # Calculate EMI to check debt-to-income ratio
    emi_info = services.calculate_reducing_balance_emi(
        payload.requested_amount, float(product.interest_rate), payload.tenure_months
    )
    emi = emi_info["emi"]

    # Auto-reject if EMI > 50% of monthly income
    if emi > (payload.monthly_income * 0.5):
        raise HTTPException(
            status_code=422,
            detail="Application auto-rejected: Calculated EMI exceeds 50% of declared monthly income",
        )

    # Query credit bureau
    credit_score = None
    status_str = "Submitted"
    remarks = None
    try:
        credit_score = services.query_credit_bureau(str(payload.customer_id))
    except Exception as e:
        # Gracefully handle credit bureau unavailability
        status_str = "Under Review"
        remarks = f"Credit bureau unavailable during submission. Queued for review. Error: {str(e)}"

    # Create application
    new_app = models.LoanApplication(
        id=uuid.uuid4(),
        customer_id=payload.customer_id,
        product_id=payload.product_id,
        requested_amount=payload.requested_amount,
        tenure_months=payload.tenure_months,
        monthly_income=payload.monthly_income,
        employment_type=payload.employment_type,
        status=status_str,
        snapshot_interest_rate=product.interest_rate,
        credit_score=credit_score,
        decision_remarks=remarks,
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    return schemas.LoanApplicationCreateResponse(
        application_id=new_app.id,
        status=new_app.status,
        submitted_at=new_app.created_at,
    )


# 4. GET /api/v1/customers/{customerId}/applications
@app.get(
    "/api/v1/customers/{customerId}/applications",
    response_model=List[schemas.CustomerApplicationResponse],
)
def get_customer_applications(
    customerId: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1),
    x_user_email: Optional[str] = Header(
        None,
        alias="x-user-email",
        description="Email of the requesting user for authorization",
    ),
    db: Session = Depends(get_db),
):
    customer = (
        db.query(models.Customer).filter(models.Customer.id == customerId).first()
    )
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Enforce security: customers can only access their own applications
    if x_user_email:
        requesting_user = (
            db.query(models.Customer)
            .filter(models.Customer.email == x_user_email)
            .first()
        )
        if requesting_user:
            if (
                requesting_user.role != "loan officer"
                and requesting_user.id != customerId
            ):
                raise HTTPException(
                    status_code=403,
                    detail="Access denied: Customers can only access their own applications",
                )
        else:
            # If email is provided but not found in DB, deny access
            raise HTTPException(
                status_code=403, detail="Access denied: Invalid user email"
            )

    return crud.get_customer_applications(
        db, customer_id=customerId, skip=skip, limit=limit
    )


# 5. PATCH /api/v1/loans/applications/{applicationId}/decision
@app.patch(
    "/api/v1/loans/applications/{applicationId}/decision",
    status_code=status.HTTP_204_NO_CONTENT,
)
def decide_loan_application(
    applicationId: UUID,
    payload: schemas.DecisionRequest,
    officer_email: str = Query(
        ..., description="Email of the officer making the decision"
    ),
    db: Session = Depends(get_db),
):
    # Verify officer role
    officer = (
        db.query(models.Customer).filter(models.Customer.email == officer_email).first()
    )
    if not officer or officer.role != "loan officer":
        raise HTTPException(
            status_code=403, detail="Access restricted to loan officers only"
        )

    # Fetch application
    app_record = (
        db.query(models.LoanApplication)
        .filter(models.LoanApplication.id == applicationId)
        .first()
    )
    if not app_record:
        raise HTTPException(status_code=404, detail="Loan application not found")

    # Update decision
    app_record.status = payload.decision
    app_record.decision_remarks = payload.remarks
    db.commit()

    # Send notification
    try:
        services.send_status_notification(
            str(app_record.customer_id), str(app_record.id), payload.decision
        )
    except Exception as e:
        print(f"Failed to send notification: {e}")

    return


# 6. POST /api/v1/loans/applications/{applicationId}/offer
@app.post(
    "/api/v1/loans/applications/{applicationId}/offer",
    response_model=schemas.LoanOfferCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_loan_offer(
    applicationId: UUID,
    payload: schemas.LoanOfferCreateRequest,
    officer_email: str = Query(
        ..., description="Email of the officer making the offer"
    ),
    db: Session = Depends(get_db),
):
    # Verify officer role
    officer = (
        db.query(models.Customer).filter(models.Customer.email == officer_email).first()
    )
    if not officer or officer.role != "loan officer":
        raise HTTPException(
            status_code=403, detail="Access restricted to loan officers only"
        )

    # Fetch application
    app_record = (
        db.query(models.LoanApplication)
        .filter(models.LoanApplication.id == applicationId)
        .first()
    )
    if not app_record:
        raise HTTPException(status_code=404, detail="Loan application not found")

    # Validate application status is Approved
    if app_record.status != "Approved":
        raise HTTPException(
            status_code=409,
            detail="Offers can only be created for Approved applications",
        )

    # Validate offered amount does not exceed requested amount
    if payload.offered_amount <= 0 or payload.offered_amount > float(
        app_record.requested_amount
    ):
        raise HTTPException(
            status_code=409,
            detail="Offered amount must be greater than 0 and cannot exceed the requested amount",
        )

    # Update application fields
    app_record.offered_amount = payload.offered_amount
    app_record.status = "Offer Made"
    app_record.offer_status = "Offer Made"
    app_record.decline_reason = None  # Clear any previous decline reason

    # Clear existing schedules if any
    db.query(models.LoanSchedule).filter(
        models.LoanSchedule.application_id == applicationId
    ).delete()

    # Generate Amortization Schedule
    P = float(payload.offered_amount)
    R = (float(app_record.snapshot_interest_rate) / 12) / 100
    N = app_record.tenure_months

    if R == 0:
        base_emi = P / N
    else:
        base_emi = (P * R * math.pow(1 + R, N)) / (math.pow(1 + R, N) - 1)

    rounded_emi = round(base_emi, 2)
    remaining_balance = P
    total_principal_paid = 0.0

    for m in range(1, N + 1):
        if m == N:
            # Final installment: absorb rounding differences
            interest_comp = round(remaining_balance * R, 2)
            principal_comp = round(P - total_principal_paid, 2)
            emi_comp = round(principal_comp + interest_comp, 2)
            remaining_balance = 0.0
        else:
            interest_comp = round(remaining_balance * R, 2)
            principal_comp = round(rounded_emi - interest_comp, 2)
            # Ensure we don't overpay principal
            if total_principal_paid + principal_comp > P:
                principal_comp = round(P - total_principal_paid, 2)
            remaining_balance = round(remaining_balance - principal_comp, 2)
            emi_comp = rounded_emi
            total_principal_paid = round(total_principal_paid + principal_comp, 2)

        schedule_row = models.LoanSchedule(
            id=uuid.uuid4(),
            application_id=applicationId,
            month=m,
            emi=emi_comp,
            principal=principal_comp,
            interest=interest_comp,
            balance=remaining_balance,
        )
        db.add(schedule_row)

    db.commit()
    db.refresh(app_record)

    # Trigger notification
    try:
        services.send_status_notification(
            str(app_record.customer_id), str(app_record.id), "Offer Made"
        )
    except Exception as e:
        print(f"Failed to send notification: {e}")

    return schemas.LoanOfferCreateResponse(
        application_id=app_record.id,
        offer_status=app_record.offer_status,
        offered_amount=float(app_record.offered_amount),
    )


# 7. GET /api/v1/loans/applications/{applicationId}/schedule
@app.get(
    "/api/v1/loans/applications/{applicationId}/schedule",
    response_model=schemas.LoanScheduleResponse,
)
def get_loan_schedule(
    applicationId: UUID,
    db: Session = Depends(get_db),
):
    # Fetch application
    app_record = (
        db.query(models.LoanApplication)
        .filter(models.LoanApplication.id == applicationId)
        .first()
    )
    if not app_record:
        raise HTTPException(status_code=404, detail="Loan application not found")

    # Fetch schedule rows
    schedules = (
        db.query(models.LoanSchedule)
        .filter(models.LoanSchedule.application_id == applicationId)
        .order_by(models.LoanSchedule.month.asc())
        .all()
    )

    if not schedules:
        raise HTTPException(
            status_code=404,
            detail="No amortization schedule exists for this application",
        )

    schedule_rows = []
    for row in schedules:
        schedule_rows.append(
            schemas.LoanScheduleRow(
                month=row.month,
                emi=float(row.emi),
                principal=float(row.principal),
                interest=float(row.interest),
                balance=float(row.balance),
            )
        )

    return schemas.LoanScheduleResponse(
        application_id=applicationId, schedule=schedule_rows
    )


# 8. POST /api/v1/loans/applications/{applicationId}/offer-decision
@app.post(
    "/api/v1/loans/applications/{applicationId}/offer-decision",
    status_code=status.HTTP_204_NO_CONTENT,
)
def decide_loan_offer(
    applicationId: UUID,
    payload: schemas.OfferDecisionRequest,
    x_user_email: Optional[str] = Header(
        None,
        alias="x-user-email",
        description="Email of the customer making the decision",
    ),
    db: Session = Depends(get_db),
):
    # Fetch application
    app_record = (
        db.query(models.LoanApplication)
        .filter(models.LoanApplication.id == applicationId)
        .first()
    )
    if not app_record:
        raise HTTPException(status_code=404, detail="Loan application not found")

    # Enforce security: only the owning customer can accept/decline
    if not x_user_email:
        raise HTTPException(
            status_code=403, detail="Access denied: Missing user email header"
        )

    requesting_user = (
        db.query(models.Customer).filter(models.Customer.email == x_user_email).first()
    )
    if not requesting_user or requesting_user.id != app_record.customer_id:
        raise HTTPException(
            status_code=403,
            detail="Access denied: Only the owning customer can make a decision on this offer",
        )

    # Validate offer exists and is not already decided
    if not app_record.offer_status or app_record.offer_status in [
        "Accepted",
        "Declined",
    ]:
        raise HTTPException(
            status_code=409, detail="Offer has already been decided or no offer exists"
        )

    # Process decision
    if payload.decision == "Accepted":
        app_record.status = "Offer Accepted"
        app_record.offer_status = "Accepted"
        app_record.decline_reason = None
    elif payload.decision == "Declined":
        if not payload.decline_reason:
            raise HTTPException(
                status_code=400,
                detail="Decline reason is required when declining an offer",
            )
        app_record.status = (
            "Approved"  # Moves back to Approved so officer can make a revised offer
        )
        app_record.offer_status = "Declined"
        app_record.decline_reason = payload.decline_reason
    else:
        raise HTTPException(
            status_code=400, detail="Invalid decision. Must be 'Accepted' or 'Declined'"
        )

    db.commit()

    # Trigger notification
    try:
        services.send_status_notification(
            str(app_record.customer_id), str(app_record.id), f"Offer {payload.decision}"
        )
    except Exception as e:
        print(f"Failed to send notification: {e}")

    return
