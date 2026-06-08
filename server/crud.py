from sqlalchemy.orm import Session
from server import models, schemas
import uuid

def get_products_with_metrics(db: Session):
    return db.query(models.Product).all()

def get_scenarios(db: Session):
    return db.query(models.Scenario).all()

def get_scenario_by_name(db: Session, name: str):
    return db.query(models.Scenario).filter(models.Scenario.name == name).first()

def create_assortment_decision(db: Session, decision: models.AssortmentDecision):
    db.add(decision)
    db.commit()
    db.refresh(decision)
    return decision

def seed_data(db: Session):
    # Check if scenarios exist
    if db.query(models.Scenario).count() == 0:
        scenarios = [
            models.Scenario(
                id=uuid.UUID("e4c07384-d113-49c3-a558-1234567890ba"),
                name="Conservative",
                description="Prioritizes minimal changes and stable, core products.",
                projected_sales_growth=2.5,
                projected_private_brand_pct=19.0,
                projected_shelf_capacity=85.0
            ),
            models.Scenario(
                id=uuid.UUID("e4c07384-d113-49c3-a558-1234567890bb"),
                name="Balanced",
                description="Optimal mix of growth and stability.",
                projected_sales_growth=4.8,
                projected_private_brand_pct=18.5,
                projected_shelf_capacity=88.4
            ),
            models.Scenario(
                id=uuid.UUID("e4c07384-d113-49c3-a558-1234567890bc"),
                name="Aggressive",
                description="High-turnover swaps for maximum growth.",
                projected_sales_growth=8.5,
                projected_private_brand_pct=16.2,
                projected_shelf_capacity=92.1
            )
        ]
        db.add_all(scenarios)
        db.commit()

    # Check if products exist
    if db.query(models.Product).count() == 0:
        products_data = [
            {
                "id": uuid.UUID("d3b07384-d113-49c3-a558-1234567890ab"),
                "sku_number": "SKU-1001",
                "name": "Good & Smart Potato Chips",
                "brand": "Private Brand",
                "category": "Snacks",
                "current_sales": 12500,
                "sales_per_linear_ft": 150,
                "in_stock_rate": 96.5,
                "recommendation_status": "GROW"
            },
            {
                "id": uuid.UUID("d3b07384-d113-49c3-a558-1234567890ac"),
                "sku_number": "SKU-10482",
                "name": "Clover Valley Potato Chips 10oz",
                "brand": "Private Brand",
                "category": "Snacks",
                "current_sales": 12450,
                "sales_per_linear_ft": 450.20,
                "in_stock_rate": 97.5,
                "recommendation_status": "GROW"
            },
            {
                "id": uuid.UUID("d3b07384-d113-49c3-a558-1234567890ad"),
                "sku_number": "SKU-20948",
                "name": "Clover Valley Tortilla Chips 16oz",
                "brand": "Private Brand",
                "category": "Snacks",
                "current_sales": 8120,
                "sales_per_linear_ft": 380.50,
                "in_stock_rate": 95.8,
                "recommendation_status": "MAINTAIN"
            },
            {
                "id": uuid.UUID("d3b07384-d113-49c3-a558-1234567890ae"),
                "sku_number": "SKU-30192",
                "name": "Lay's Classic Potato Chips 8oz",
                "brand": "National Brand",
                "category": "Snacks",
                "current_sales": 24150,
                "sales_per_linear_ft": 520.10,
                "in_stock_rate": 94.2,
                "recommendation_status": "MAINTAIN"
            },
            {
                "id": uuid.UUID("d3b07384-d113-49c3-a558-1234567890af"),
                "sku_number": "SKU-40281",
                "name": "Doritos Nacho Cheese 9.75oz",
                "brand": "National Brand",
                "category": "Snacks",
                "current_sales": 18900,
                "sales_per_linear_ft": 410.40,
                "in_stock_rate": 96.8,
                "recommendation_status": "GROW"
            },
            {
                "id": uuid.UUID("d3b07384-d113-49c3-a558-1234567890b0"),
                "sku_number": "SKU-50382",
                "name": "Clover Valley Pretzels 12oz",
                "brand": "Private Brand",
                "category": "Snacks",
                "current_sales": 4200,
                "sales_per_linear_ft": 210.00,
                "in_stock_rate": 91.5,
                "recommendation_status": "SWAP"
            },
            {
                "id": uuid.UUID("d3b07384-d113-49c3-a558-1234567890b1"),
                "sku_number": "SKU-60182",
                "name": "Good & Smart Veggie Straws 6oz",
                "brand": "Private Brand",
                "category": "Snacks",
                "current_sales": 3100,
                "sales_per_linear_ft": 180.00,
                "in_stock_rate": 89.2,
                "recommendation_status": "REDUCE"
            }
        ]

        for p_data in products_data:
            product = models.Product(
                id=p_data["id"],
                sku_number=p_data["sku_number"],
                name=p_data["name"],
                brand=p_data["brand"],
                category=p_data["category"]
            )
            db.add(product)
            db.commit()

            metric = models.ProductMetric(
                product_id=product.id,
                current_sales=p_data["current_sales"],
                sales_per_linear_ft=p_data["sales_per_linear_ft"],
                in_stock_rate=p_data["in_stock_rate"],
                recommendation_status=p_data["recommendation_status"]
            )
            db.add(metric)
            db.commit()
