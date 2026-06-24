import uuid
from sqlalchemy.orm import Session
from server import models


def seed_data(db: Session):
    # Check if products already exist
    if db.query(models.Product).first() is not None:
        print("Database already seeded.")
        return

    print("Seeding database...")

    # 1. Seed Products and Performance Metrics
    products_data = [
        {
            "id": uuid.UUID("d3b07384-d113-49c3-a55e-4c3d163e4501"),
            "sku": "SKU-1001",
            "name": "Clover Valley Potato Chips 10oz",
            "description": "Private brand potato chips",
            "metrics": {
                "sales_per_linear_ft": 520.0,
                "private_brand_percent": 100.0,
                "in_stock_rate": 98.5,
                "shelf_capacity": 150,
            },
        },
        {
            "id": uuid.uuid4(),
            "sku": "SKU-8492",
            "name": "Lay's Classic",
            "description": "National brand classic potato chips",
            "metrics": {
                "sales_per_linear_ft": 512.0,
                "private_brand_percent": 0.0,
                "in_stock_rate": 98.2,
                "shelf_capacity": 48,
            },
        },
        {
            "id": uuid.uuid4(),
            "sku": "SKU-3104",
            "name": "Clover Valley Tortilla",
            "description": "Private brand tortilla chips",
            "metrics": {
                "sales_per_linear_ft": 480.0,
                "private_brand_percent": 100.0,
                "in_stock_rate": 97.5,
                "shelf_capacity": 36,
            },
        },
        {
            "id": uuid.uuid4(),
            "sku": "SKU-5521",
            "name": "Cheetos Crunchy",
            "description": "National brand cheese snacks",
            "metrics": {
                "sales_per_linear_ft": 390.0,
                "private_brand_percent": 0.0,
                "in_stock_rate": 95.1,
                "shelf_capacity": 48,
            },
        },
        {
            "id": uuid.uuid4(),
            "sku": "SKU-1192",
            "name": "Clover Valley Pretzels",
            "description": "Private brand pretzels",
            "metrics": {
                "sales_per_linear_ft": 310.0,
                "private_brand_percent": 100.0,
                "in_stock_rate": 94.0,
                "shelf_capacity": 24,
            },
        },
        {
            "id": uuid.uuid4(),
            "sku": "SKU-7743",
            "name": "Doritos Nacho",
            "description": "National brand tortilla chips",
            "metrics": {
                "sales_per_linear_ft": 540.0,
                "private_brand_percent": 0.0,
                "in_stock_rate": 98.9,
                "shelf_capacity": 60,
            },
        },
        {
            "id": uuid.uuid4(),
            "sku": "SKU-2281",
            "name": "Generic Potato Sticks",
            "description": "Value brand potato sticks",
            "metrics": {
                "sales_per_linear_ft": 180.0,
                "private_brand_percent": 0.0,
                "in_stock_rate": 89.5,
                "shelf_capacity": 12,
            },
        },
    ]

    for p_data in products_data:
        product = models.Product(
            id=p_data["id"],
            sku=p_data["sku"],
            name=p_data["name"],
            description=p_data["description"],
        )
        db.add(product)
        db.flush()  # Get product.id if generated

        m_data = p_data["metrics"]
        metric = models.PerformanceMetric(
            product_id=product.id,
            sales_per_linear_ft=m_data["sales_per_linear_ft"],  # type: ignore
            private_brand_percent=m_data["private_brand_percent"],  # type: ignore
            in_stock_rate=m_data["in_stock_rate"],  # type: ignore
            shelf_capacity=m_data["shelf_capacity"],  # type: ignore
        )
        db.add(metric)

    # 2. Seed Scenarios
    scenarios_data = [
        {
            "name": "Conservative",
            "rules": {
                "projected_impact": {
                    "in_stock_rate": 97.0,
                    "private_brand_percent": 25.0,
                    "sales_per_linear_ft": 460.2,
                    "shelf_capacity": 1150,
                },
                "guardrails": {
                    "private_brand_target_passed": True,
                    "sales_target_passed": True,
                    "shelf_capacity_passed": True,
                },
                "sku_actions": [
                    {"sku": "SKU-1001", "action": "GROW"},
                    {"sku": "SKU-8492", "action": "MAINTAIN"},
                    {"sku": "SKU-1192", "action": "MAINTAIN"},
                ],
            },
        },
        {
            "name": "Balanced",
            "rules": {
                "projected_impact": {
                    "in_stock_rate": 96.5,
                    "private_brand_percent": 28.2,
                    "sales_per_linear_ft": 485.5,
                    "shelf_capacity": 1200,
                },
                "guardrails": {
                    "private_brand_target_passed": True,
                    "sales_target_passed": True,
                    "shelf_capacity_passed": True,
                },
                "sku_actions": [
                    {"sku": "SKU-1001", "action": "GROW"},
                    {"sku": "SKU-3104", "action": "GROW"},
                    {"sku": "SKU-5521", "action": "SWAP"},
                    {"sku": "SKU-1192", "action": "MAINTAIN"},
                ],
            },
        },
        {
            "name": "Aggressive",
            "rules": {
                "projected_impact": {
                    "in_stock_rate": 94.8,
                    "private_brand_percent": 32.0,
                    "sales_per_linear_ft": 510.0,
                    "shelf_capacity": 1250,
                },
                "guardrails": {
                    "private_brand_target_passed": True,
                    "sales_target_passed": True,
                    "shelf_capacity_passed": False,
                },
                "sku_actions": [
                    {"sku": "SKU-1001", "action": "GROW"},
                    {"sku": "SKU-3104", "action": "GROW"},
                    {"sku": "SKU-7743", "action": "GROW"},
                    {"sku": "SKU-2281", "action": "REDUCE"},
                ],
            },
        },
    ]

    for s_data in scenarios_data:
        scenario = models.Scenario(name=s_data["name"], rules=s_data["rules"])
        db.add(scenario)

    db.commit()
    print("Database seeded successfully.")
