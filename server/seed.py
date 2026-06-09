from sqlalchemy.orm import Session
from server.database import SessionLocal, Base, engine
from server.models import Product, Scenario, ScenarioItem

def seed_db(db: Session):
    # Clear existing data
    db.query(ScenarioItem).delete()
    db.query(Product).delete()
    db.query(Scenario).delete()
    db.commit()

    # Seed Products
    products_data = [
        {
            "sku": "CV-POT-01",
            "name": "Clover Valley Potato Chips 10oz",
            "category": "Snacks",
            "sales": 1850.0,
            "margin": 38.5,
            "shelf_space": 10.0,
            "in_stock": True,
            "is_private_brand": True
        },
        {
            "sku": "LAYS-CLA-02",
            "name": "Lay's Classic Potato Chips 8oz",
            "category": "Snacks",
            "sales": 2100.0,
            "margin": 28.0,
            "shelf_space": 12.0,
            "in_stock": True,
            "is_private_brand": False
        },
        {
            "sku": "CV-PRE-03",
            "name": "Clover Valley Pretzels 16oz",
            "category": "Snacks",
            "sales": 450.0,
            "margin": 42.0,
            "shelf_space": 8.0,
            "in_stock": True,
            "is_private_brand": True
        },
        {
            "sku": "DOR-NCH-04",
            "name": "Doritos Nacho Cheese 9.75oz",
            "category": "Snacks",
            "sales": 1950.0,
            "margin": 26.5,
            "shelf_space": 11.0,
            "in_stock": True,
            "is_private_brand": False
        },
        {
            "sku": "CV-TOR-05",
            "name": "Clover Valley Tortilla Chips 13oz",
            "category": "Snacks",
            "sales": 320.0,
            "margin": 18.0,
            "shelf_space": 9.0,
            "in_stock": True,
            "is_private_brand": True
        },
        {
            "sku": "CHE-CRU-06",
            "name": "Cheetos Crunchy 8.5oz",
            "category": "Snacks",
            "sales": 1650.0,
            "margin": 27.5,
            "shelf_space": 10.0,
            "in_stock": True,
            "is_private_brand": False
        },
        {
            "sku": "CV-CHS-07",
            "name": "Clover Valley Cheese Crackers 12oz",
            "category": "Snacks",
            "sales": 1200.0,
            "margin": 39.0,
            "shelf_space": 8.0,
            "in_stock": True,
            "is_private_brand": True
        }
    ]

    products = []
    for p_data in products_data:
        p = Product(**p_data)
        db.add(p)
        products.append(p)
    db.commit()

    # Map SKU to product_id for scenario items
    sku_to_id = {p.sku: p.product_id for p in products}
    sku_to_name = {p.sku: p.name for p in products}

    # Seed Scenarios
    scenarios_data = [
        {
            "scenario_id": "conservative",
            "name": "Conservative",
            "description": "Focus on low-risk optimization by removing the lowest-performing SKU to free up shelf space.",
            "projected_sales_lift": 1.5,
            "new_private_brand_pct": 38.0,
            "shelf_space_impact_ft": -2.0,
            "is_selected": False
        },
        {
            "scenario_id": "balanced",
            "name": "Balanced",
            "description": "Optimize assortment by swapping underperforming SKUs with high-margin private brand alternatives.",
            "projected_sales_lift": 4.5,
            "new_private_brand_pct": 44.1,
            "shelf_space_impact_ft": 0.0,
            "is_selected": True  # Pre-selected
        },
        {
            "scenario_id": "aggressive",
            "name": "Aggressive",
            "description": "Aggressively restructure the category by removing multiple low-velocity SKUs and introducing premium private brand items.",
            "projected_sales_lift": 8.2,
            "new_private_brand_pct": 47.0,
            "shelf_space_impact_ft": -4.0,
            "is_selected": False
        }
    ]

    for s_data in scenarios_data:
        s = Scenario(**s_data)
        db.add(s)
    db.commit()

    # Seed Scenario Items
    scenario_items_data = [
        # Conservative: Remove CV-TOR-05
        {
            "scenario_id": "conservative",
            "product_id": sku_to_id["CV-TOR-05"],
            "sku": "CV-TOR-05",
            "name": sku_to_name["CV-TOR-05"],
            "action": "REMOVE",
            "is_private_brand": True,
            "shelf_space": 9.0
        },
        # Balanced: Remove CV-TOR-05, Add Clover Valley Pistachios
        {
            "scenario_id": "balanced",
            "product_id": sku_to_id["CV-TOR-05"],
            "sku": "CV-TOR-05",
            "name": sku_to_name["CV-TOR-05"],
            "action": "REMOVE",
            "is_private_brand": True,
            "shelf_space": 9.0
        },
        {
            "scenario_id": "balanced",
            "product_id": None,
            "sku": "CV-PST-08",
            "name": "Clover Valley Pistachios 8oz",
            "action": "ADD",
            "is_private_brand": True,
            "shelf_space": 2.0
        },
        # Aggressive: Remove CV-TOR-05, Remove CV-PRE-03, Add Clover Valley Pistachios, Add Clover Valley Almonds
        {
            "scenario_id": "aggressive",
            "product_id": sku_to_id["CV-TOR-05"],
            "sku": "CV-TOR-05",
            "name": sku_to_name["CV-TOR-05"],
            "action": "REMOVE",
            "is_private_brand": True,
            "shelf_space": 9.0
        },
        {
            "scenario_id": "aggressive",
            "product_id": sku_to_id["CV-PRE-03"],
            "sku": "CV-PRE-03",
            "name": sku_to_name["CV-PRE-03"],
            "action": "REMOVE",
            "is_private_brand": True,
            "shelf_space": 8.0
        },
        {
            "scenario_id": "aggressive",
            "product_id": None,
            "sku": "CV-PST-08",
            "name": "Clover Valley Pistachios 8oz",
            "action": "ADD",
            "is_private_brand": True,
            "shelf_space": 2.0
        },
        {
            "scenario_id": "aggressive",
            "product_id": None,
            "sku": "CV-ALM-09",
            "name": "Clover Valley Almonds 8oz",
            "action": "ADD",
            "is_private_brand": True,
            "shelf_space": 2.0
        }
    ]

    for item_data in scenario_items_data:
        item = ScenarioItem(**item_data)
        db.add(item)
    db.commit()

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_db(db)
        print("Database seeded successfully!")
    finally:
        db.close()
