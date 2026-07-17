from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from server import models, schemas, crud
from server.database import Base, engine, get_db
from server.api.v1.endpoints import password_reset

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DG Cluster Assortment Advisor API")

# CORS Middleware
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include password reset router
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])


# Seed Data Function
def seed_data(db: Session):
    # Check if already seeded
    if db.query(models.KPIData).first() is not None:
        return

    # Seed KPIs
    kpi = models.KPIData(
        sales_per_linear_ft=15.75,
        private_brand_pct=22.0,
        in_stock_rate=98.2,
        shelf_capacity=85.0,
        sales_trend_pct=4.2,
        private_brand_target=25.0,
        in_stock_target=95.0,
        shelf_capacity_range_min=80.0,
        shelf_capacity_range_max=90.0,
    )
    db.add(kpi)

    # Seed Products
    products = [
        models.Product(
            sku="48291",
            name="Clover Valley Potato Chips 10oz",
            sales_ytd=14250.00,
            units=5700,
            gm_pct=42.10,
            recommendation="GROW",
            is_private_brand=True,
            brand="Clover Valley",
        ),
        models.Product(
            sku="19482",
            name="Lays Classic Potato Chips 8oz",
            sales_ytd=18900.00,
            units=6300,
            gm_pct=28.50,
            recommendation="MAINTAIN",
            is_private_brand=False,
            brand="Lays",
        ),
        models.Product(
            sku="38291",
            name="Clover Valley Cheese Crackers 12oz",
            sales_ytd=8400.00,
            units=4200,
            gm_pct=45.00,
            recommendation="GROW",
            is_private_brand=True,
            brand="Clover Valley",
        ),
        models.Product(
            sku="88291",
            name="Generic Brand Pretzels 16oz",
            sales_ytd=2100.00,
            units=1050,
            gm_pct=18.00,
            recommendation="REDUCE",
            is_private_brand=False,
            brand="Generic",
        ),
        models.Product(
            sku="57201",
            name="Brand Y Tortilla Chips 12oz",
            sales_ytd=3400.00,
            units=1360,
            gm_pct=22.00,
            recommendation="SWAP",
            is_private_brand=False,
            brand="Brand Y",
        ),
    ]
    for p in products:
        db.add(p)
    db.commit()


# Run seed on startup
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    try:
        seed_data(db)
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Welcome to the DG Cluster Assortment Advisor API"}


@app.get("/api/v1/kpis", response_model=schemas.KPIDataResponse)
def get_kpis(db: Session = Depends(get_db)):
    kpis = crud.get_kpis(db)
    if not kpis:
        raise HTTPException(status_code=500, detail="KPI data not found")
    return kpis


@app.get("/api/v1/skus", response_model=schemas.SKUListResponse)
def get_skus(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    brand: Optional[str] = None,
    status: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = None,
    db: Session = Depends(get_db),
):
    items, total = crud.get_skus(
        db,
        skip=skip,
        limit=limit,
        search=search,
        brand=brand,
        status=status,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@app.get("/api/v1/scenarios", response_model=List[schemas.ScenarioResponse])
def get_scenarios():
    return [
        {
            "id": "conservative",
            "name": "Conservative",
            "description": "Minimize disruption, low risk swaps.",
            "private_brand_pct": 23.5,
            "projected_sales_pct": 1.2,
            "swaps_count": 2,
            "guardrails": {
                "gm_pct_impact": "Passed",
                "private_brand_share": "Warning",
                "shelf_space_limits": "Passed",
            },
        },
        {
            "id": "balanced",
            "name": "Balanced",
            "description": "Moderate shift towards Private Brand targets.",
            "private_brand_pct": 25.2,
            "projected_sales_pct": 3.5,
            "swaps_count": 5,
            "guardrails": {
                "gm_pct_impact": "Passed",
                "private_brand_share": "Passed",
                "shelf_space_limits": "Passed",
            },
        },
        {
            "id": "aggressive",
            "name": "Aggressive",
            "description": "Maximize PB penetration, high risk.",
            "private_brand_pct": 28.0,
            "projected_sales_pct": 5.8,
            "swaps_count": 12,
            "guardrails": {
                "gm_pct_impact": "Passed",
                "private_brand_share": "Passed",
                "shelf_space_limits": "Warning",
            },
        },
    ]


@app.post("/api/v1/submit", response_model=schemas.SubmitPlanResponse)
def submit_plan(plan_in: schemas.SubmitPlanRequest, db: Session = Depends(get_db)):
    # Validate scenario
    if plan_in.selected_scenario not in ["conservative", "balanced", "aggressive"]:
        raise HTTPException(status_code=422, detail="Invalid scenario selected")

    # Check critical guardrails (e.g., if aggressive has too many swaps or something, but here we just submit)
    manager_name = "Sarah Jenkins"  # Default manager name as per design spec
    db_plan = crud.create_assortment_plan(db, plan_in, manager_name)

    return {
        "success": True,
        "audit_id": db_plan.audit_id,
        "scenario": db_plan.selected_scenario,
        "manager_name": db_plan.manager_name,
        "submitted_at": db_plan.submitted_at,
    }
