import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.app.models.assortment import (
    Base,
    Cluster,
    SKU,
    SKUClusterMetrics,
)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db(target_engine=None):
    if target_engine is None:
        target_engine = engine
    Base.metadata.create_all(bind=target_engine)


def seed_data(db):
    try:
        cluster = (
            db.query(Cluster).filter(Cluster.cluster_code == "small-town-value").first()
        )
        if not cluster:
            cluster = Cluster(
                cluster_code="small-town-value", name="Small Town Value Cluster"
            )
            db.add(cluster)
            db.commit()
            db.refresh(cluster)

        sample_skus = [
            {
                "sku_code": "SKU-SNACK-1001",
                "name": "DG Crave Potato Chips 10oz",
                "category": "Snacks",
                "is_private_brand": True,
                "unit_margin_pct": 34.0,
                "linear_ft_space": 1.2,
                "velocity_units_per_wk": 42.0,
                "status_badge": "GROW",
            },
            {
                "sku_code": "SKU-SNACK-1002",
                "name": "Clover Valley Mini Pretzels 16oz",
                "category": "Snacks",
                "is_private_brand": True,
                "unit_margin_pct": 38.0,
                "linear_ft_space": 1.0,
                "velocity_units_per_wk": 31.5,
                "status_badge": "MAINTAIN",
            },
            {
                "sku_code": "SKU-SNACK-1003",
                "name": "Brand X Spicy Tortilla Chips 11oz",
                "category": "Snacks",
                "is_private_brand": False,
                "unit_margin_pct": 22.0,
                "linear_ft_space": 1.5,
                "velocity_units_per_wk": 18.0,
                "status_badge": "SWAP",
            },
            {
                "sku_code": "SKU-SNACK-1004",
                "name": "Old Town Cheese Curls 8oz",
                "category": "Snacks",
                "is_private_brand": False,
                "unit_margin_pct": 18.5,
                "linear_ft_space": 0.8,
                "velocity_units_per_wk": 9.2,
                "status_badge": "REDUCE",
            },
            {
                "sku_code": "SKU-SNACK-1005",
                "name": "DG Crave Cheese Puffs 9oz",
                "category": "Snacks",
                "is_private_brand": True,
                "unit_margin_pct": 32.5,
                "linear_ft_space": 1.0,
                "velocity_units_per_wk": 28.4,
                "status_badge": "MAINTAIN",
            },
            {
                "sku_code": "SKU-SNACK-1006",
                "name": "Brand Y Classic Potato Chips 10.5oz",
                "category": "Snacks",
                "is_private_brand": False,
                "unit_margin_pct": 19.0,
                "linear_ft_space": 1.8,
                "velocity_units_per_wk": 52.1,
                "status_badge": "MAINTAIN",
            },
        ]

        for sku_info in sample_skus:
            sku = db.query(SKU).filter(SKU.sku_code == sku_info["sku_code"]).first()
            if not sku:
                sku = SKU(
                    sku_code=sku_info["sku_code"],
                    name=sku_info["name"],
                    category=sku_info["category"],
                    is_private_brand=sku_info["is_private_brand"],
                    unit_margin_pct=sku_info["unit_margin_pct"],
                    linear_ft_space=sku_info["linear_ft_space"],
                )
                db.add(sku)
                db.commit()
                db.refresh(sku)

            metric = (
                db.query(SKUClusterMetrics)
                .filter(
                    SKUClusterMetrics.sku_id == sku.id,
                    SKUClusterMetrics.cluster_id == cluster.id,
                )
                .first()
            )
            if not metric:
                metric = SKUClusterMetrics(
                    sku_id=sku.id,
                    cluster_id=cluster.id,
                    velocity_units_per_wk=sku_info["velocity_units_per_wk"],
                    status_badge=sku_info["status_badge"],
                )
                db.add(metric)
                db.commit()

    except Exception:
        db.rollback()


def get_db():
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
        yield db
    finally:
        db.close()
