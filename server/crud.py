import json
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


def seed_data(db: Session):
    # Check if products already exist
    if db.query(models.Product).first() is not None:
        return

    # Seed products
    products_data = [
        {
            "sku": "12345",
            "name": "DG Chips 10oz",
            "brand": "DG Private Brand",
            "sub_category": "Chips",
            "is_private_brand": True,
            "metrics": {
                "sales_velocity": 50.0,
                "sales_trend": 8.0,
                "in_stock_rate": 95.0,
                "shelf_capacity_utilized": 80.0,
            },
        },
        {
            "sku": "67890",
            "name": "Brand X Pretzels",
            "brand": "National Brand",
            "sub_category": "Pretzels",
            "is_private_brand": False,
            "metrics": {
                "sales_velocity": 30.0,
                "sales_trend": -1.0,
                "in_stock_rate": 93.0,
                "shelf_capacity_utilized": 85.0,
            },
        },
        {
            "sku": "24680",
            "name": "Brand Z Popcorn",
            "brand": "National Brand",
            "sub_category": "Popcorn",
            "is_private_brand": False,
            "metrics": {
                "sales_velocity": 15.0,
                "sales_trend": -4.0,
                "in_stock_rate": 94.0,
                "shelf_capacity_utilized": 90.0,
            },
        },
        {
            "sku": "13579",
            "name": "Brand Y Cookies",
            "brand": "National Brand",
            "sub_category": "Cookies",
            "is_private_brand": False,
            "metrics": {
                "sales_velocity": 10.0,
                "sales_trend": -10.0,
                "in_stock_rate": 94.0,
                "shelf_capacity_utilized": 85.0,
            },
        },
    ]

    for p_data in products_data:
        product = models.Product(
            sku=p_data["sku"],
            name=p_data["name"],
            brand=p_data["brand"],
            sub_category=p_data["sub_category"],
            is_private_brand=p_data["is_private_brand"],
        )
        db.add(product)
        db.flush()  # Get product.id

        metrics = models.SalesMetrics(
            product_id=product.id,
            sales_velocity=p_data["metrics"]["sales_velocity"],
            sales_trend=p_data["metrics"]["sales_trend"],
            in_stock_rate=p_data["metrics"]["in_stock_rate"],
            shelf_capacity_utilized=p_data["metrics"]["shelf_capacity_utilized"],
        )
        db.add(metrics)

    db.commit()


def get_products_with_metrics(db: Session):
    return db.query(models.Product).all()


def create_assortment_audit(
    db: Session, scenario_name: str, actions: list, audit_trail_id: str
):
    db_audit = models.AssortmentAudit(
        audit_trail_id=audit_trail_id,
        scenario_name=scenario_name,
        actions_json=json.dumps(actions),
    )
    db.add(db_audit)
    db.commit()
    db.refresh(db_audit)
    return db_audit
