from sqlalchemy.orm import Session
from server.database import SessionLocal, engine, Base
from server import models


def seed_data(db: Session):
    # 1. Seed Assortment Scenarios
    scenarios = [
        {
            "name": "conservative",
            "description": "Focus on core SKUs. Low risk.",
            "projected_sales_lift": 2.5,
            "projected_private_brand_pct": 21.5,
            "projected_shelf_capacity": 82.0,
        },
        {
            "name": "balanced",
            "description": "Mix of core growth and testing new items.",
            "projected_sales_lift": 5.0,
            "projected_private_brand_pct": 25.0,
            "projected_shelf_capacity": 98.0,
        },
        {
            "name": "aggressive",
            "description": "Maximize private label penetration. High risk.",
            "projected_sales_lift": 8.5,
            "projected_private_brand_pct": 28.5,
            "projected_shelf_capacity": 105.0,
        },
    ]

    for s in scenarios:
        existing = (
            db.query(models.AssortmentScenario)
            .filter(models.AssortmentScenario.name == s["name"])
            .first()
        )
        if not existing:
            db_scenario = models.AssortmentScenario(
                name=s["name"],
                description=s["description"],
                projected_sales_lift=s["projected_sales_lift"],
                projected_private_brand_pct=s["projected_private_brand_pct"],
                projected_shelf_capacity=s["projected_shelf_capacity"],
            )
            db.add(db_scenario)

    # 2. Seed Products and Performance Metrics
    products_data = [
        {
            "sku_name": "Clover Valley Potato Chips 10oz",
            "upc": "012200001234",
            "is_private_brand": True,
            "weekly_sales": 4250.00,
            "profit_margin": 34.5,
            "stock_level": 1200,
            "days_of_supply": 14,
            "status": "GROW",
        },
        {
            "sku_name": "Lay's Classic Potato Chips 8oz",
            "upc": "028400091561",
            "is_private_brand": False,
            "weekly_sales": 3800.00,
            "profit_margin": 28.0,
            "stock_level": 850,
            "days_of_supply": 10,
            "status": "MAINTAIN",
        },
        {
            "sku_name": "Clover Valley Cheese Crackers 12oz",
            "upc": "012200005678",
            "is_private_brand": True,
            "weekly_sales": 2100.00,
            "profit_margin": 32.0,
            "stock_level": 400,
            "days_of_supply": 8,
            "status": "GROW",
        },
        {
            "sku_name": "Doritos Nacho Cheese 9.25oz",
            "upc": "028400091899",
            "is_private_brand": False,
            "weekly_sales": 3100.00,
            "profit_margin": 25.5,
            "stock_level": 900,
            "days_of_supply": 12,
            "status": "MAINTAIN",
        },
        {
            "sku_name": "Generic Pretzel Sticks 16oz",
            "upc": "071100004321",
            "is_private_brand": False,
            "weekly_sales": 450.00,
            "profit_margin": 18.0,
            "stock_level": 150,
            "days_of_supply": 5,
            "status": "SWAP",
        },
        {
            "sku_name": "Clover Valley Gummy Bears 8oz",
            "upc": "012200009876",
            "is_private_brand": True,
            "weekly_sales": 250.00,
            "profit_margin": 15.0,
            "stock_level": 80,
            "days_of_supply": 3,
            "status": "REDUCE",
        },
    ]

    for p_data in products_data:
        existing_product = (
            db.query(models.Product).filter(models.Product.upc == p_data["upc"]).first()
        )
        if not existing_product:
            product = models.Product(
                sku_name=p_data["sku_name"],
                upc=p_data["upc"],
                is_private_brand=p_data["is_private_brand"],
            )
            db.add(product)
            db.flush()  # Get product ID

            metric = models.PerformanceMetric(
                product_id=product.id,
                weekly_sales=p_data["weekly_sales"],
                profit_margin=p_data["profit_margin"],
                stock_level=p_data["stock_level"],
                days_of_supply=p_data["days_of_supply"],
                status=p_data["status"],
            )
            db.add(metric)

    db.commit()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data(db)
        print("Database seeded successfully!")
    finally:
        db.close()
