from sqlalchemy.orm import Session
from uuid import UUID
from server import models, schemas


def get_loan_products(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    type_filter: str = None,
    tenure_filter: int = None,
    max_emi_filter: float = None,
):
    query = db.query(models.LoanProduct)
    if type_filter:
        query = query.filter(models.LoanProduct.name.ilike(f"%{type_filter}%"))

    products = query.offset(skip).limit(limit).all()

    # If max_emi_filter or tenure_filter is provided, we can filter programmatically or via query.
    # Let's filter programmatically to ensure accurate reducing-balance EMI calculation.
    filtered_products = []
    for p in products:
        if tenure_filter:
            if not (p.min_tenure_months <= tenure_filter <= p.max_tenure_months):
                continue
        if max_emi_filter:
            # Calculate EMI for max_loan_amount or a standard amount to see if it fits?
            # Usually, filtering by max_emi means: "Is there a configuration where EMI <= max_emi?"
            # Let's calculate EMI for max_loan_amount at max_tenure_months.
            rate = float(p.interest_rate) / 12 / 100
            if rate > 0:
                emi = (
                    float(p.max_loan_amount)
                    * rate
                    * ((1 + rate) ** p.max_tenure_months)
                ) / (((1 + rate) ** p.max_tenure_months) - 1)
            else:
                emi = float(p.max_loan_amount) / p.max_tenure_months
            if emi > max_emi_filter:
                # If even the max loan EMI is too high, but maybe they can borrow less?
                # Let's assume if they can borrow at least some amount with EMI <= max_emi, it's fine.
                # So we check if the minimum loan amount (e.g. 1000 or 10% of max) has EMI <= max_emi.
                min_possible_loan = min(10000.0, float(p.max_loan_amount))
                if rate > 0:
                    min_emi = (
                        min_possible_loan * rate * ((1 + rate) ** p.max_tenure_months)
                    ) / (((1 + rate) ** p.max_tenure_months) - 1)
                else:
                    min_emi = min_possible_loan / p.max_tenure_months
                if min_emi > max_emi_filter:
                    continue
        filtered_products.append(p)
    return filtered_products


def get_customer_applications(
    db: Session, customer_id: UUID, skip: int = 0, limit: int = 20
):
    apps = (
        db.query(models.LoanApplication)
        .filter(models.LoanApplication.customer_id == customer_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    results = []
    for app in apps:
        results.append(
            schemas.CustomerApplicationResponse(
                application_id=app.id,
                product_name=app.product.name,
                requested_amount=float(app.requested_amount),
                status=app.status,
                submitted_at=app.created_at,
                offered_amount=float(app.offered_amount)
                if app.offered_amount is not None
                else None,
                offer_status=app.offer_status,
            )
        )
    return results


def check_duplicate_application(
    db: Session, customer_id: UUID, product_id: UUID
) -> bool:
    # Check if there is an active application (status not in Approved, Rejected)
    active_statuses = ["Submitted", "Under Review"]
    exists = (
        db.query(models.LoanApplication)
        .filter(
            models.LoanApplication.customer_id == customer_id,
            models.LoanApplication.product_id == product_id,
            models.LoanApplication.status.in_(active_statuses),
        )
        .first()
    )
    return exists is not None
