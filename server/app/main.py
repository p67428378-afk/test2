from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from server.app import models, schemas, crud, database, scenarios

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="DG Cluster Assortment Advisor API",
    description="API for Dollar General category managers to optimize Snacks product assortment.",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # Seed initial products if empty
    db = database.SessionLocal()
    try:
        crud.seed_products(db)
    finally:
        db.close()

@app.get("/api/v1/kpis", response_model=schemas.KPIResponse)
def get_kpis(db: Session = Depends(database.get_db)):
    # Return main KPI values for the dashboard header strip
    return schemas.KPIResponse(
        in_stock_rate=94.1,
        private_brand_pct=22.4,
        sales_per_linear_ft=125.5,
        sales_trend_pct=5.2,
        shelf_capacity_pct=88.0
    )

@app.get("/api/v1/skus", response_model=List[schemas.SKUResponse])
def get_skus(db: Session = Depends(database.get_db)):
    # Return a list of all snack SKUs with their performance data
    products = crud.get_products(db)
    return products

@app.get("/api/v1/scenarios/{scenario_name}", response_model=schemas.ScenarioResponse)
def get_scenario(scenario_name: str, db: Session = Depends(database.get_db)):
    try:
        return scenarios.get_scenario_data(db, scenario_name)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.post("/api/v1/assortment-plans", response_model=schemas.AssortmentPlanResponse)
def create_assortment_plan(plan_in: schemas.AssortmentPlanCreate, db: Session = Depends(database.get_db)):
    try:
        plan = crud.create_assortment_plan(db, plan_in)
        return plan
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create assortment plan: {str(e)}"
        )
