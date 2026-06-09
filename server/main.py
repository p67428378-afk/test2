from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api.v1.endpoints import password_reset, assortment
from server.database import Base, engine, SessionLocal
from server import models

Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    try:
        # Check if products already exist
        if db.query(models.Product).count() == 0:
            products = [
                models.Product(sku_name="Lay's Classic 8oz", sales_velocity=145.0, margin_pct=32.0, current_inventory=450),
                models.Product(sku_name="Clover Valley Potato Chips 10oz", sales_velocity=98.0, margin_pct=42.0, current_inventory=310),
                models.Product(sku_name="Doritos Nacho Cheese 9.75oz", sales_velocity=120.0, margin_pct=28.0, current_inventory=180),
                models.Product(sku_name="Cheetos Crunchy 8.5oz", sales_velocity=85.0, margin_pct=29.0, current_inventory=120),
                models.Product(sku_name="Generic Pretzels 12oz", sales_velocity=22.0, margin_pct=15.0, current_inventory=85),
                models.Product(sku_name="Underperforming Corn Chips 6oz", sales_velocity=15.0, margin_pct=18.0, current_inventory=40),
            ]
            db.add_all(products)
            db.commit()

        # Check if KPIs already exist
        if db.query(models.KPI).count() == 0:
            kpis = [
                models.KPI(scenario_name="Conservative", sales_per_linear_ft=12.5, private_brand_pct=18.0, in_stock_rate=96.0, shelf_capacity=75.0),
                models.KPI(scenario_name="Balanced", sales_per_linear_ft=15.75, private_brand_pct=22.0, in_stock_rate=94.0, shelf_capacity=85.0),
                models.KPI(scenario_name="Aggressive", sales_per_linear_ft=18.2, private_brand_pct=15.0, in_stock_rate=91.0, shelf_capacity=92.0),
            ]
            db.add_all(kpis)
            db.commit()

        # Check if scenarios already exist
        if db.query(models.AssortmentScenario).count() == 0:
            scenarios = [
                models.AssortmentScenario(name="Conservative", sales_lift=1.2, pb_change=0.5, description="Conservative scenario focusing on low-risk adjustments."),
                models.AssortmentScenario(name="Balanced", sales_lift=3.5, pb_change=2.1, description="Balanced scenario optimizing sales and private brand goals."),
                models.AssortmentScenario(name="Aggressive", sales_lift=6.8, pb_change=-1.5, description="Aggressive scenario maximizing sales lift with higher risk."),
            ]
            db.add_all(scenarios)
            db.commit()
    finally:
        db.close()

seed_data()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(assortment.router, prefix="/api/v1", tags=["assortment"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the DG Cluster Assortment Advisor Microservice"}
