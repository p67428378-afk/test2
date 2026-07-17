from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Force SQLite in-memory database for all environments to prevent read-only filesystem errors
DATABASE_URL = "sqlite://"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from server.models import Base

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models import SKU, KPI

    # Seed KPIs if empty
    if db.query(KPI).count() == 0:
        kpi = KPI(
            sales_per_linear_ft=15.75,
            private_brand_percentage=22.5,
            in_stock_rate=98.2,
            shelf_capacity=85.0,
        )
        db.add(kpi)

    # Seed SKUs if empty
    if db.query(SKU).count() == 0:
        skus = [
            SKU(
                name="Clover Valley Potato Chips 10oz",
                sales=12450.00,
                profit_margin=34.2,
                units_sold=4120,
                status="GROW",
            ),
            SKU(
                name="Clover Valley Tortilla Chips 12oz",
                sales=9820.00,
                profit_margin=31.5,
                units_sold=3240,
                status="MAINTAIN",
            ),
            SKU(
                name="Brand X Cheese Puffs 8oz",
                sales=4150.00,
                profit_margin=22.1,
                units_sold=1560,
                status="SWAP",
            ),
            SKU(
                name="Brand Y Pretzels 16oz",
                sales=2840.00,
                profit_margin=18.5,
                units_sold=980,
                status="REDUCE",
            ),
            SKU(
                name="Clover Valley Animal Crackers 12oz",
                sales=8120.00,
                profit_margin=35.0,
                units_sold=2900,
                status="GROW",
            ),
        ]
        db.add_all(skus)

    db.commit()
