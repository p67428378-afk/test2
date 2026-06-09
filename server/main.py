from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, assortment
from server.database import Base, engine, SessionLocal
from server import models
import uuid

# Create tables
Base.metadata.create_all(bind=engine)

# Seed database
def seed_db():
    db = SessionLocal()
    try:
        # Check if SKUs already exist
        if db.query(models.SKU).count() == 0:
            skus = [
                models.SKU(
                    sku_id="10482000-0000-0000-0000-000000000000",
                    name="Clover Valley Potato Chips 10oz",
                    brand="Private Brand",
                    sales=14250.00,
                    units=1200,
                    profit=5486.25,
                    gm_pct=38.5,
                    status_badge="GROW"
                ),
                models.SKU(
                    sku_id="20941000-0000-0000-0000-000000000000",
                    name="Lay's Classic Potato Chips 13oz",
                    brand="National Brand",
                    sales=28400.00,
                    units=2400,
                    profit=6248.00,
                    gm_pct=22.0,
                    status_badge="MAINTAIN"
                ),
                models.SKU(
                    sku_id="30291000-0000-0000-0000-000000000000",
                    name="Clover Valley Tortilla Chips 12oz",
                    brand="Private Brand",
                    sales=8120.00,
                    units=800,
                    profit=2842.00,
                    gm_pct=35.0,
                    status_badge="GROW"
                ),
                models.SKU(
                    sku_id="40182000-0000-0000-0000-000000000000",
                    name="Pringles Sour Cream & Onion 5.5oz",
                    brand="National Brand",
                    sales=11500.00,
                    units=1000,
                    profit=2817.50,
                    gm_pct=24.5,
                    status_badge="MAINTAIN"
                ),
                models.SKU(
                    sku_id="50281000-0000-0000-0000-000000000000",
                    name="Generic Cheese Balls 8oz",
                    brand="National Brand",
                    sales=2100.00,
                    units=300,
                    profit=378.00,
                    gm_pct=18.0,
                    status_badge="SWAP"
                ),
                models.SKU(
                    sku_id="60392000-0000-0000-0000-000000000000",
                    name="Clover Valley Pretzels 16oz",
                    brand="Private Brand",
                    sales=1850.00,
                    units=250,
                    profit=277.50,
                    gm_pct=15.0,
                    status_badge="REDUCE"
                )
            ]
            for sku in skus:
                db.add(sku)
                db.commit()

        # Check if Scenarios already exist
        if db.query(models.Scenario).count() == 0:
            scenarios = [
                models.Scenario(
                    scenario_id="c0000000-0000-0000-0000-000000000001",
                    name="Conservative",
                    projected_sales=62000.00,
                    change_in_private_brand_pct=1.5,
                    shelf_utilization_pct=82.0,
                    is_selected=False
                ),
                models.Scenario(
                    scenario_id="b0000000-0000-0000-0000-000000000002",
                    name="Balanced",
                    projected_sales=66220.00,
                    change_in_private_brand_pct=2.4,
                    shelf_utilization_pct=88.2,
                    is_selected=True
                ),
                models.Scenario(
                    scenario_id="a0000000-0000-0000-0000-000000000003",
                    name="Aggressive",
                    projected_sales=71500.00,
                    change_in_private_brand_pct=-0.8,
                    shelf_utilization_pct=94.5,
                    is_selected=False
                )
            ]
            for scenario in scenarios:
                db.add(scenario)
                db.commit()
    finally:
        db.close()

seed_db()

app = FastAPI()

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(assortment.router, prefix="/api/v1", tags=["assortment"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the DG Cluster Assortment Advisor API"}
