from sqlalchemy.orm import Session
from server import models


def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
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


# Assortment Advisor CRUD
def get_kpis(db: Session):
    # Return default or aggregated KPIs
    return {
        "in_stock_rate": 95.0,
        "private_brand_pct": 22.0,
        "sales_per_linear_ft": 1250.0,
        "shelf_capacity": 85.0,
    }


def get_sku_performance(db: Session, skip: int = 0, limit: int = 10):
    # Query performance metrics joined with products
    query = db.query(models.PerformanceMetric).join(models.Product)
    total = query.count()
    items = query.offset(skip).limit(limit).all()

    # If empty, seed some default data for demonstration/testing
    if total == 0:
        p1 = models.Product(
            sku="SKU-1001", name="Clover Valley Pretzels", is_private_brand=True
        )
        db.add(p1)
        db.commit()
        db.refresh(p1)

        pm1 = models.PerformanceMetric(
            product_id=p1.id,
            sales=1250.0,
            profit_margin=35.0,
            days_of_supply=15,
            status_badge="GROW",
            trend_direction="Up",
        )
        db.add(pm1)
        db.commit()

        items = [pm1]
        total = 1

    result_items = []
    for pm in items:
        result_items.append(
            {
                "sku": pm.product.sku,
                "product_name": pm.product.name,
                "sales": pm.sales,
                "profit_margin": pm.profit_margin,
                "days_of_supply": pm.days_of_supply,
                "status_badge": pm.status_badge,
                "trend_direction": pm.trend_direction,
            }
        )
    return result_items, total
