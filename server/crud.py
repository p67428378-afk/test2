import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session, joinedload
from server import models, schemas

# --- Existing Password Reset CRUD ---


def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: datetime):
    db_otp = models.OTP(
        user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at
    )
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp


def get_otp(db: Session, otp_session_id: str):
    return db.query(models.OTP).filter(models.OTP.id == otp_session_id).first()


def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True
    db.commit()
    db.refresh(otp)
    return otp


def create_password_history(db: Session, user_id: str, hashed_password: str):
    db_password_history = models.PasswordHistory(
        user_id=user_id, hashed_password=hashed_password
    )
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history


def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user


# --- DG Cluster Assortment Advisor CRUD ---


def get_kpis(db: Session):
    # Calculate KPIs dynamically from products and performance metrics
    # If no products exist, return default values
    total_products = db.query(models.Product).count()
    if total_products == 0:
        return {
            "sales_per_linear_ft": 145.5,
            "private_brand_pct": 22.4,
            "in_stock_rate": 94.5,
            "shelf_capacity_pct": 88.2,
        }

    # Calculate sales per linear ft (assume 200 linear ft total)
    total_sales = 0.0
    private_brand_count = 0
    in_stock_count = 0
    total_stock = 0

    products = (
        db.query(models.Product)
        .options(joinedload(models.Product.performance_metrics))
        .all()
    )
    for p in products:
        if p.is_private_brand:
            private_brand_count += 1

        # Get latest performance metric
        if p.performance_metrics:
            metric = p.performance_metrics[0]
            total_sales += float(metric.weekly_sales)
            total_stock += metric.stock_level
            if metric.stock_level > 10:
                in_stock_count += 1

    sales_per_linear_ft = round(total_sales / 200.0, 2) if total_sales > 0 else 145.5
    private_brand_pct = (
        round((private_brand_count / total_products) * 100.0, 2)
        if total_products > 0
        else 22.4
    )
    in_stock_rate = (
        round((in_stock_count / total_products) * 100.0, 2)
        if total_products > 0
        else 94.5
    )

    # Shelf capacity: assume max capacity is 2000 units
    shelf_capacity_pct = (
        round((total_stock / 2000.0) * 100.0, 2) if total_stock > 0 else 88.2
    )

    return {
        "sales_per_linear_ft": sales_per_linear_ft,
        "private_brand_pct": private_brand_pct,
        "in_stock_rate": in_stock_rate,
        "shelf_capacity_pct": shelf_capacity_pct,
    }


def get_scenario_by_name(db: Session, name: str):
    return (
        db.query(models.AssortmentScenario)
        .filter(models.AssortmentScenario.name == name.lower())
        .first()
    )


def get_products_with_metrics(db: Session):
    # Order by sku_name to ensure deterministic ordering
    return (
        db.query(models.Product)
        .options(joinedload(models.Product.performance_metrics))
        .order_by(models.Product.sku_name)
        .all()
    )


def create_assortment_decision(
    db: Session, decision: schemas.AssortmentDecisionRequest
):
    confirmation_id = f"dec-{uuid.uuid4().hex[:12]}"

    # Calculate summary of changes based on action counts
    # Let's map action counts to added, removed, swapped
    # e.g., added = grow, removed = reduce, swapped = swap
    added = decision.action_counts.grow
    removed = decision.action_counts.reduce
    swapped = decision.action_counts.swap

    db_audit = models.AuditTrail(
        confirmation_id=confirmation_id,
        scenario_applied=decision.scenario_applied,
        user_name=decision.user_name,
        added_count=added,
        removed_count=removed,
        swapped_count=swapped,
    )
    db.add(db_audit)
    db.commit()
    db.refresh(db_audit)

    # Format timestamp in ISO 8601 UTC format
    timestamp_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    return {
        "confirmation_id": confirmation_id,
        "scenario_applied": decision.scenario_applied,
        "user": decision.user_name,
        "timestamp": timestamp_str,
        "summary_of_changes": {"added": added, "removed": removed, "swapped": swapped},
    }


# --- Private National Brand Mapping CRUD ---


def get_sku_mappings(db: Session):
    return db.query(models.PrivateNationalBrandMapping).all()
