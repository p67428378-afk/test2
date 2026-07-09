from sqlalchemy.orm import Session
from server import models
from server.database import SessionLocal, engine
from typing import List, Dict, Any


def seed_data(db: Session):
    # 1. Seed Scenarios
    scenarios: List[Dict[str, Any]] = [
        {
            "name": "conservative",
            "description": "Focus on core SKUs. Low risk.",
            "projected_sales_impact_pct": 1.5,
            "projected_private_brand_pct": 21.0,
            "projected_shelf_capacity_pct": 85.0,
        },
        {
            "name": "balanced",
            "description": "Mix of core growth and testing new items.",
            "projected_sales_impact_pct": 4.2,
            "projected_private_brand_pct": 23.5,
            "projected_shelf_capacity_pct": 91.0,
        },
        {
            "name": "aggressive",
            "description": "Maximize private label penetration. High risk.",
            "projected_sales_impact_pct": 6.8,
            "projected_private_brand_pct": 28.2,
            "projected_shelf_capacity_pct": 96.5,  # Fails guardrail (< 95%)
        },
    ]

    for s_data in scenarios:
        existing = (
            db.query(models.AssortmentScenario)
            .filter(models.AssortmentScenario.name == s_data["name"])
            .first()
        )
        if not existing:
            scenario = models.AssortmentScenario(**s_data)
            db.add(scenario)

    db.commit()

    # 2. Seed Products and Performance Metrics
    products_data: List[Dict[str, Any]] = [
        {
            "sku_name": "Clover Valley Potato Chips 10oz",
            "upc": "012200001234",
            "is_private_brand": True,
            "linear_shelf_footprint": 1.5,
            "metrics": {
                "weekly_sales": 4250.00,
                "profit_margin": 34.5,
                "stock_level": 1200,
                "days_of_supply": 14,
            },
        },
        {
            "sku_name": "Lay's Classic Potato Chips 8oz",
            "upc": "028400091561",
            "is_private_brand": False,
            "linear_shelf_footprint": 1.2,
            "metrics": {
                "weekly_sales": 3800.00,
                "profit_margin": 28.0,
                "stock_level": 850,
                "days_of_supply": 10,
            },
        },
        {
            "sku_name": "Clover Valley Cheese Crackers 12oz",
            "upc": "012200005678",
            "is_private_brand": True,
            "linear_shelf_footprint": 0.8,
            "metrics": {
                "weekly_sales": 2100.00,
                "profit_margin": 32.0,
                "stock_level": 400,
                "days_of_supply": 8,
            },
        },
        {
            "sku_name": "Doritos Nacho Cheese 9.25oz",
            "upc": "028400091899",
            "is_private_brand": False,
            "linear_shelf_footprint": 1.0,
            "metrics": {
                "weekly_sales": 3100.00,
                "profit_margin": 25.5,
                "stock_level": 900,
                "days_of_supply": 12,
            },
        },
        {
            "sku_name": "Generic Pretzel Sticks 16oz",
            "upc": "071100004321",
            "is_private_brand": False,
            "linear_shelf_footprint": 0.6,
            "metrics": {
                "weekly_sales": 450.00,
                "profit_margin": 18.0,
                "stock_level": 150,
                "days_of_supply": 5,
            },
        },
        {
            "sku_name": "Clover Valley Gummy Bears 8oz",
            "upc": "012200009876",
            "is_private_brand": True,
            "linear_shelf_footprint": 0.4,
            "metrics": {
                "weekly_sales": 250.00,
                "profit_margin": 15.0,
                "stock_level": 80,
                "days_of_supply": 3,
            },
        },
        {
            "sku_name": "Lay's Classic Potato Chips 13oz",
            "upc": "028400310413",
            "is_private_brand": False,
            "linear_shelf_footprint": 1.8,
            "metrics": {
                "weekly_sales": 1250.00,
                "profit_margin": 28.5,
                "stock_level": 150,
                "days_of_supply": 12,
            },
        },
        {
            "sku_name": "Clover Valley Tortilla Chips 13oz",
            "upc": "012200002468",
            "is_private_brand": True,
            "linear_shelf_footprint": 1.4,
            "metrics": {
                "weekly_sales": 1850.00,
                "profit_margin": 31.0,
                "stock_level": 350,
                "days_of_supply": 9,
            },
        },
        # Additional 12 products to make 20 total
        {
            "sku_name": "Clover Valley Animal Crackers 11oz",
            "upc": "012200003579",
            "is_private_brand": True,
            "linear_shelf_footprint": 0.7,
            "metrics": {
                "weekly_sales": 1100.00,
                "profit_margin": 29.0,
                "stock_level": 200,
                "days_of_supply": 7,
            },
        },
        {
            "sku_name": "Ritz Crackers Original 13.7oz",
            "upc": "044000031114",
            "is_private_brand": False,
            "linear_shelf_footprint": 1.1,
            "metrics": {
                "weekly_sales": 1500.00,
                "profit_margin": 24.0,
                "stock_level": 300,
                "days_of_supply": 10,
            },
        },
        {
            "sku_name": "Cheez-It Original 12.4oz",
            "upc": "024100122113",
            "is_private_brand": False,
            "linear_shelf_footprint": 1.0,
            "metrics": {
                "weekly_sales": 1750.00,
                "profit_margin": 23.5,
                "stock_level": 280,
                "days_of_supply": 8,
            },
        },
        {
            "sku_name": "Clover Valley Pretzel Twists 16oz",
            "upc": "012200004680",
            "is_private_brand": True,
            "linear_shelf_footprint": 0.9,
            "metrics": {
                "weekly_sales": 950.00,
                "profit_margin": 33.0,
                "stock_level": 180,
                "days_of_supply": 6,
            },
        },
        {
            "sku_name": "Pringles Sour Cream & Onion 5.5oz",
            "upc": "038000138411",
            "is_private_brand": False,
            "linear_shelf_footprint": 0.5,
            "metrics": {
                "weekly_sales": 1350.00,
                "profit_margin": 22.0,
                "stock_level": 220,
                "days_of_supply": 9,
            },
        },
        {
            "sku_name": "Clover Valley Roasted Peanuts 16oz",
            "upc": "012200005791",
            "is_private_brand": True,
            "linear_shelf_footprint": 0.6,
            "metrics": {
                "weekly_sales": 850.00,
                "profit_margin": 35.0,
                "stock_level": 150,
                "days_of_supply": 11,
            },
        },
        {
            "sku_name": "Planters Peanuts Salted 16oz",
            "upc": "029000016112",
            "is_private_brand": False,
            "linear_shelf_footprint": 0.6,
            "metrics": {
                "weekly_sales": 1200.00,
                "profit_margin": 21.0,
                "stock_level": 190,
                "days_of_supply": 12,
            },
        },
        {
            "sku_name": "Clover Valley Microwave Popcorn 6ct",
            "upc": "012200006802",
            "is_private_brand": True,
            "linear_shelf_footprint": 1.2,
            "metrics": {
                "weekly_sales": 750.00,
                "profit_margin": 36.0,
                "stock_level": 130,
                "days_of_supply": 13,
            },
        },
        {
            "sku_name": "Orville Redenbacher Popcorn 3ct",
            "upc": "027000481115",
            "is_private_brand": False,
            "linear_shelf_footprint": 1.2,
            "metrics": {
                "weekly_sales": 900.00,
                "profit_margin": 20.5,
                "stock_level": 140,
                "days_of_supply": 10,
            },
        },
        {
            "sku_name": "Clover Valley Beef Jerky Original 3oz",
            "upc": "012200007913",
            "is_private_brand": True,
            "linear_shelf_footprint": 0.3,
            "metrics": {
                "weekly_sales": 650.00,
                "profit_margin": 38.0,
                "stock_level": 90,
                "days_of_supply": 15,
            },
        },
        {
            "sku_name": "Jack Link's Beef Jerky Original 3.25oz",
            "upc": "017082871116",
            "is_private_brand": False,
            "linear_shelf_footprint": 0.4,
            "metrics": {
                "weekly_sales": 1400.00,
                "profit_margin": 19.0,
                "stock_level": 160,
                "days_of_supply": 8,
            },
        },
        {
            "sku_name": "Clover Valley Trail Mix Sweet & Salty 14oz",
            "upc": "012200008024",
            "is_private_brand": True,
            "linear_shelf_footprint": 0.5,
            "metrics": {
                "weekly_sales": 550.00,
                "profit_margin": 32.5,
                "stock_level": 110,
                "days_of_supply": 14,
            },
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
                linear_shelf_footprint=p_data["linear_shelf_footprint"],
            )
            db.add(product)
            db.commit()
            db.refresh(product)

            # Add performance metric
            m_data: Dict[str, Any] = p_data["metrics"]
            metric = models.PerformanceMetric(
                product_id=product.id,
                weekly_sales=m_data["weekly_sales"],
                profit_margin=m_data["profit_margin"],
                stock_level=m_data["stock_level"],
                days_of_supply=m_data["days_of_supply"],
            )
            db.add(metric)
            db.commit()
        else:
            # Update metrics if product already exists
            existing_product.linear_shelf_footprint = p_data["linear_shelf_footprint"]
            metric = (
                db.query(models.PerformanceMetric)
                .filter(models.PerformanceMetric.product_id == existing_product.id)
                .first()
            )
            if metric:
                m_data = p_data["metrics"]
                metric.weekly_sales = m_data["weekly_sales"]
                metric.profit_margin = m_data["profit_margin"]
                metric.stock_level = m_data["stock_level"]
                metric.days_of_supply = m_data["days_of_supply"]
                db.commit()

    # 3. Seed Private-National Brand Mappings
    mappings = [
        {
            "private_sku_upc": "012200001234",  # Clover Valley Potato Chips 10oz
            "national_benchmark_upc": "028400091561",  # Lay's Classic Potato Chips 8oz
        },
        {
            "private_sku_upc": "012200005678",  # Clover Valley Cheese Crackers 12oz
            "national_benchmark_upc": "024100122113",  # Cheez-It Original 12.4oz
        },
        {
            "private_sku_upc": "012200004680",  # Clover Valley Pretzel Twists 16oz
            "national_benchmark_upc": "071100004321",  # Generic Pretzel Sticks 16oz
        },
        {
            "private_sku_upc": "012200005791",  # Clover Valley Roasted Peanuts 16oz
            "national_benchmark_upc": "029000016112",  # Planters Peanuts Salted 16oz
        },
        {
            "private_sku_upc": "012200006802",  # Clover Valley Microwave Popcorn 6ct
            "national_benchmark_upc": "027000481115",  # Orville Redenbacher Popcorn 3ct
        },
        {
            "private_sku_upc": "012200007913",  # Clover Valley Beef Jerky Original 3oz
            "national_benchmark_upc": "017082871116",  # Jack Link's Beef Jerky Original 3.25oz
        },
    ]

    for m in mappings:
        existing_mapping = (
            db.query(models.PrivateNationalBrandMapping)
            .filter(
                models.PrivateNationalBrandMapping.private_sku_upc
                == m["private_sku_upc"]
            )
            .first()
        )
        if not existing_mapping:
            db_mapping = models.PrivateNationalBrandMapping(
                private_sku_upc=m["private_sku_upc"],
                national_benchmark_upc=m["national_benchmark_upc"],
            )
            db.add(db_mapping)
    db.commit()


if __name__ == "__main__":
    models.Base.metadata.create_all(bind=engine)
    db_session = SessionLocal()
    try:
        seed_data(db_session)
        print("Database seeded successfully!")
    finally:
        db_session.close()
