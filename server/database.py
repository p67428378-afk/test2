from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from server.core.config import settings
from datetime import date

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Import models here to register them on Base.metadata
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server import models

    # Seed a default user for password reset or general testing if needed
    existing_user = (
        db.query(models.User).filter(models.User.login_id == "testuser").first()
    )
    if not existing_user:
        test_user = models.User(
            login_id="testuser",
            mobile_number="1234567890",
            hashed_password="hashed_password_here",
            security_question="What is your favorite color?",
            security_answer_hash="hashed_answer_here",
        )
        db.add(test_user)
        db.commit()

    # Seed products and performance metrics
    products_to_seed = [
        {
            "upc": "028400040112",
            "name": "Lay's Classic 13oz",
            "is_private_brand": False,
            "weekly_sales": 12000.00,
            "sales_rank_percentile": 95.0,
            "margin_percentage": 35.5,
            "in_stock_rate": 96.5,
        },
        {
            "upc": "012345678901",
            "name": "Clover Valley Potato Chips",
            "is_private_brand": True,
            "weekly_sales": 8500.00,
            "sales_rank_percentile": 75.0,
            "margin_percentage": 42.0,
            "in_stock_rate": 94.0,
        },
        {
            "upc": "028400091565",
            "name": "Doritos Nacho Cheese",
            "is_private_brand": False,
            "weekly_sales": 7200.00,
            "sales_rank_percentile": 62.0,
            "margin_percentage": 33.0,
            "in_stock_rate": 95.0,
        },
        {
            "upc": "028400091855",
            "name": "Cheetos Crunchy",
            "is_private_brand": False,
            "weekly_sales": 5100.00,
            "sales_rank_percentile": 45.0,
            "margin_percentage": 34.0,
            "in_stock_rate": 93.5,
        },
        {
            "upc": "028400091121",
            "name": "Fritos Original",
            "is_private_brand": False,
            "weekly_sales": 3400.00,
            "sales_rank_percentile": 32.0,
            "margin_percentage": 31.0,
            "in_stock_rate": 92.0,
        },
        {
            "upc": "012345678902",
            "name": "CV Tortilla Chips",
            "is_private_brand": True,
            "weekly_sales": 2800.00,
            "sales_rank_percentile": 28.0,
            "margin_percentage": 45.0,
            "in_stock_rate": 95.5,
        },
        {
            "upc": "028400031211",
            "name": "Pretzels Rold Gold",
            "is_private_brand": False,
            "weekly_sales": 12000.00,  # Wait, let's use 1200.00 as in the table
            "sales_rank_percentile": 15.0,
            "margin_percentage": 28.0,
            "in_stock_rate": 91.0,
        },
    ]

    # Fix Pretzels Rold Gold weekly sales to 1200.00
    products_to_seed[-1]["weekly_sales"] = 1200.00

    for p_data in products_to_seed:
        existing_p = (
            db.query(models.Product).filter(models.Product.upc == p_data["upc"]).first()
        )
        if not existing_p:
            p = models.Product(
                upc=p_data["upc"],
                name=p_data["name"],
                is_private_brand=p_data["is_private_brand"],
            )
            db.add(p)
            db.commit()
            db.refresh(p)

            # Add performance metric
            metric = models.PerformanceMetric(
                product_id=p.id,
                week_ending_date=date(2026, 1, 1),
                weekly_sales=p_data["weekly_sales"],
                sales_rank_percentile=p_data["sales_rank_percentile"],
                margin_percentage=p_data["margin_percentage"],
                in_stock_rate=p_data["in_stock_rate"],
            )
            db.add(metric)
            db.commit()
