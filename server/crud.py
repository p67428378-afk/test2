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

def create_assortment_review(db: Session, review: schemas.AssortmentReviewRequest, user_id: str):
    db_review = models.AssortmentReview(
        user_id=user_id,
        scenario_name=review.scenario_name,
        actions=[action.dict() for action in review.actions]
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
            "name": "Lay's Classic 8oz",
            "category": "Snacks",
            "private_brand": False,
            "sales_per_linear_ft": 520.00,
            "in_stock_rate": 97.2,
            "status": "GROW"
        },
        {
            "name": "Clover Valley Potato Chips 8oz",
            "category": "Snacks",
            "private_brand": True,
            "sales_per_linear_ft": 310.00,
            "in_stock_rate": 94.5,
            "status": "GROW"
        },
        {
            "name": "Doritos Nacho Cheese 9.25oz",
            "category": "Snacks",
            "private_brand": False,
            "sales_per_linear_ft": 480.00,
            "in_stock_rate": 98.1,
            "status": "MAINTAIN"
        },
        {
            "name": "Clover Valley Pretzels 16oz",
            "category": "Snacks",
            "private_brand": True,
            "sales_per_linear_ft": 180.00,
            "in_stock_rate": 91.2,
            "status": "SWAP"
        },
        {
            "name": "Cheetos Crunchy 8.5oz",
            "category": "Snacks",
            "private_brand": False,
            "sales_per_linear_ft": 410.00,
            "in_stock_rate": 96.5,
            "status": "MAINTAIN"
        },
        {
            "name": "Generic Cheese Balls 12oz",
            "category": "Snacks",
            "private_brand": False,
            "sales_per_linear_ft": 95.00,
            "in_stock_rate": 88.0,
            "status": "REDUCE"
        }
    ]

    for item in initial_skus:
        sku = models.SKU(
            sku_id=uuid.uuid4(),
            name=item["name"],
            category=item["category"],
            private_brand=item["private_brand"]
        )
        db.add(sku)
        db.flush()  # Get the sku_id

        perf = models.SKUPerformance(
            performance_id=uuid.uuid4(),
            sku_id=sku.sku_id,
            sales_per_linear_ft=item["sales_per_linear_ft"],
            in_stock_rate=item["in_stock_rate"],
            status=item["status"]
        )
        db.add(perf)

    db.commit()
