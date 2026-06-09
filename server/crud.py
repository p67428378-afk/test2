from sqlalchemy.orm import Session
from server import models, schemas
import uuid

def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()

def get_user_by_mobile_number(db: Session, mobile_number: str):
    return db.query(models.User).filter(models.User.mobile_number == mobile_number).first()

def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at)
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
    db_password_history = models.PasswordHistory(user_id=user_id, hashed_password=hashed_password)
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

def get_skus(db: Session):
    return db.query(models.SKU).all()

def create_assortment_review(db: Session, review: schemas.AssortmentReviewRequest, audit_id: str, actions_summary: str):
    db_review = models.AssortmentReview(
        id=uuid.uuid4(),
        scenario=review.scenario,
        audit_id=audit_id,
        actions_summary=actions_summary
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def seed_initial_data(db: Session):
    # Check if SKUs already exist
    if db.query(models.SKU).count() > 0:
        return

    # Seed SKUs and SKUPerformance
    initial_skus = [
        {
            "sku_number": "SKU-10001",
            "name": "Lay's Classic 8oz",
            "category": "Snacks",
            "private_brand": False,
            "sales_per_week": 520.00,
            "in_stock_rate": 97.2,
            "shelf_capacity_used": 15.0,
            "status_badge": "GROW"
        },
        {
            "sku_number": "SKU-10002",
            "name": "Clover Valley Potato Chips 8oz",
            "category": "Snacks",
            "private_brand": True,
            "sales_per_week": 310.00,
            "in_stock_rate": 94.5,
            "shelf_capacity_used": 12.0,
            "status_badge": "GROW"
        },
        {
            "sku_number": "SKU-10003",
            "name": "Doritos Nacho Cheese 9.25oz",
            "category": "Snacks",
            "private_brand": False,
            "sales_per_week": 480.00,
            "in_stock_rate": 98.1,
            "shelf_capacity_used": 18.0,
            "status_badge": "MAINTAIN"
        },
        {
            "sku_number": "SKU-10004",
            "name": "Clover Valley Pretzels 16oz",
            "category": "Snacks",
            "private_brand": True,
            "sales_per_week": 180.00,
            "in_stock_rate": 91.2,
            "shelf_capacity_used": 10.0,
            "status_badge": "SWAP"
        },
        {
            "sku_number": "SKU-10005",
            "name": "Cheetos Crunchy 8.5oz",
            "category": "Snacks",
            "private_brand": False,
            "sales_per_week": 410.00,
            "in_stock_rate": 96.5,
            "shelf_capacity_used": 14.0,
            "status_badge": "MAINTAIN"
        },
        {
            "sku_number": "SKU-10006",
            "name": "Generic Cheese Balls 12oz",
            "category": "Snacks",
            "private_brand": False,
            "sales_per_week": 95.00,
            "in_stock_rate": 88.0,
            "shelf_capacity_used": 8.0,
            "status_badge": "REDUCE"
        }
    ]

    for item in initial_skus:
        sku = models.SKU(
            id=uuid.uuid4(),
            sku_number=item["sku_number"],
            name=item["name"],
            category=item["category"],
            private_brand=item["private_brand"]
        )
        db.add(sku)
        db.flush()  # Get the id

        perf = models.SKUPerformance(
            id=uuid.uuid4(),
            sku_id=sku.id,
            sales_per_week=item["sales_per_week"],
            in_stock_rate=item["in_stock_rate"],
            shelf_capacity_used=item["shelf_capacity_used"],
            status_badge=item["status_badge"]
        )
        db.add(perf)

    db.commit()
