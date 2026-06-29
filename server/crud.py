from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from server import models
from typing import Optional, Any


# Existing Password Reset CRUD
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
def get_skus(
    db: Session,
    search: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = None,
):
    query = db.query(models.SKU).join(models.SKUPerformance)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                models.SKU.product_name.ilike(search_filter),
                models.SKU.sku_code.ilike(search_filter),
            )
        )

    if sort_by:
        # Map sort_by to actual column
        col: Any = None
        if sort_by == "product_name":
            col = models.SKU.product_name
        elif sort_by == "sku_code":
            col = models.SKU.sku_code
        elif sort_by == "sales_revenue":
            col = models.SKUPerformance.sales_revenue
        elif sort_by == "units_sold":
            col = models.SKUPerformance.units_sold
        elif sort_by == "profit_margin":
            col = models.SKUPerformance.profit_margin
        elif sort_by == "days_of_supply":
            col = models.SKUPerformance.days_of_supply
        elif sort_by == "status_badge":
            col = models.SKUPerformance.status_badge

        if col is not None:
            if sort_order == "desc":
                query = query.order_by(desc(col))
            else:
                query = query.order_by(col)
    else:
        # Default sort by product name
        query = query.order_by(models.SKU.product_name)

    return query.all()


def create_assortment_submission(
    db: Session, scenario_name: str, submitted_by: str, actions: list
):
    submission = models.AssortmentSubmission(
        scenario_name=scenario_name, submitted_by=submitted_by
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    for action_item in actions:
        db_action = models.SubmissionAction(
            submission_id=submission.id,
            sku_id=action_item["sku_id"],
            action=action_item["action"],
        )
        db.add(db_action)

    db.commit()
    db.refresh(submission)
    return submission


def seed_assortment_data(db: Session):
    # Check if already seeded
    if db.query(models.SKU).first() is not None:
        return

    # Seed 42 SKUs
    # We will define the 5 main ones from the Stitch HTML, and then 37 others.
    main_skus = [
        {
            "product_name": "Chipz Salt & Vinegar 8oz",
            "sku_code": "SNK-1001",
            "is_private_brand": False,
            "width_inches": 8.0,
            "facings": 2,
            "sales_revenue": 4520.0,
            "units_sold": 1205,
            "profit_margin": 32.0,
            "days_of_supply": 14,
            "in_stock_rate": 96.2,
            "status_badge": "GROW",
        },
        {
            "product_name": "DG Home Style Pretzels 12oz",
            "sku_code": "SNK-1045",
            "is_private_brand": True,
            "width_inches": 10.0,
            "facings": 3,
            "sales_revenue": 3100.0,
            "units_sold": 850,
            "profit_margin": 45.0,
            "days_of_supply": 22,
            "in_stock_rate": 98.5,
            "status_badge": "MAINTAIN",
        },
        {
            "product_name": "Krak-R-Bland 4oz",
            "sku_code": "SNK-2099",
            "is_private_brand": False,
            "width_inches": 6.0,
            "facings": 1,
            "sales_revenue": 450.0,
            "units_sold": 110,
            "profit_margin": 18.0,
            "days_of_supply": 45,
            "in_stock_rate": 92.0,
            "status_badge": "REDUCE",
        },
        {
            "product_name": "Crunchy Cheese Puffs 6oz",
            "sku_code": "SNK-1122",
            "is_private_brand": False,
            "width_inches": 7.0,
            "facings": 2,
            "sales_revenue": 1250.0,
            "units_sold": 420,
            "profit_margin": 25.0,
            "days_of_supply": 18,
            "in_stock_rate": 95.0,
            "status_badge": "SWAP",
        },
        {
            "product_name": "Sweet Caramel Popcorn 8oz",
            "sku_code": "SNK-3005",
            "is_private_brand": True,
            "width_inches": 9.0,
            "facings": 3,
            "sales_revenue": 5100.0,
            "units_sold": 1450,
            "profit_margin": 38.0,
            "days_of_supply": 12,
            "in_stock_rate": 97.0,
            "status_badge": "GROW",
        },
    ]

    # Add 37 more SKUs to make it 42
    additional_skus = []
    for i in range(1, 38):
        is_pb = i % 5 == 0  # 20% private brand
        status = "MAINTAIN"
        if i % 7 == 0:
            status = "GROW"
        elif i % 11 == 0:
            status = "REDUCE"
        elif i % 13 == 0:
            status = "SWAP"

        additional_skus.append(
            {
                "product_name": f"Snack Item {i} 10oz",
                "sku_code": f"SNK-40{i:02d}",
                "is_private_brand": is_pb,
                "width_inches": 8.0,
                "facings": 2,
                "sales_revenue": 1000.0 + (i * 50),
                "units_sold": 300 + (i * 10),
                "profit_margin": 20.0 + (i % 15),
                "days_of_supply": 15 + (i % 10),
                "in_stock_rate": 94.0 + (i % 5),
                "status_badge": status,
            }
        )

    all_items = main_skus + additional_skus

    for item in all_items:
        sku = models.SKU(
            product_name=item["product_name"],
            sku_code=item["sku_code"],
            is_private_brand=item["is_private_brand"],
            width_inches=item["width_inches"],
            facings=item["facings"],
        )
        db.add(sku)
        db.commit()
        db.refresh(sku)

        perf = models.SKUPerformance(
            sku_id=sku.id,
            sales_revenue=item["sales_revenue"],
            units_sold=item["units_sold"],
            profit_margin=item["profit_margin"],
            days_of_supply=item["days_of_supply"],
            in_stock_rate=item["in_stock_rate"],
            status_badge=item["status_badge"],
        )
        db.add(perf)
        db.commit()
