from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
from datetime import datetime
from contextlib import asynccontextmanager

from server.database import Base, engine, get_db, SessionLocal
from server import models, schemas, crud
from server.api.v1.endpoints import password_reset


# Seed initial data helper
def seed_data(db: Session):
    # Check if SKUs already exist
    if db.query(models.SKU).first() is not None:
        return

    # Seed test user for QA/Dev login
    test_user = (
        db.query(models.User).filter(models.User.login_id == "test@example.com").first()
    )
    if not test_user:
        db_user = models.User(
            login_id="test@example.com",
            mobile_number="1234567890",
            hashed_password="testpassword",
            security_question="What is your favorite color?",
            security_answer_hash="blue",
        )
        db.add(db_user)
        db.commit()

    # Seed Snacks SKUs
    snacks_data = [
        {
            "sku_number": "SKU-1001",
            "product_name": "Clover Valley Potato Chips 10oz",
            "is_private_brand": True,
            "sales": 12500.00,
            "units": 5000,
            "margin_percentage": 35.5,
            "scenarios": {
                "Conservative": "MAINTAIN",
                "Balanced": "GROW",
                "Aggressive": "GROW",
            },
        },
        {
            "sku_number": "SKU-1002",
            "product_name": "Lay's Classic Potato Chips 8oz",
            "is_private_brand": False,
            "sales": 24000.00,
            "units": 8000,
            "margin_percentage": 18.0,
            "scenarios": {
                "Conservative": "MAINTAIN",
                "Balanced": "MAINTAIN",
                "Aggressive": "REDUCE",
            },
        },
        {
            "sku_number": "SKU-1003",
            "product_name": "Clover Valley Tortilla Chips 12oz",
            "is_private_brand": True,
            "sales": 9800.00,
            "units": 4000,
            "margin_percentage": 38.0,
            "scenarios": {
                "Conservative": "GROW",
                "Balanced": "GROW",
                "Aggressive": "GROW",
            },
        },
        {
            "sku_number": "SKU-1004",
            "product_name": "Doritos Nacho Cheese 9oz",
            "is_private_brand": False,
            "sales": 31000.00,
            "units": 10000,
            "margin_percentage": 15.5,
            "scenarios": {
                "Conservative": "MAINTAIN",
                "Balanced": "MAINTAIN",
                "Aggressive": "SWAP",
            },
        },
        {
            "sku_number": "SKU-1005",
            "product_name": "Clover Valley Cheese Curls 7oz",
            "is_private_brand": True,
            "sales": 6200.00,
            "units": 3100,
            "margin_percentage": 42.0,
            "scenarios": {
                "Conservative": "MAINTAIN",
                "Balanced": "GROW",
                "Aggressive": "GROW",
            },
        },
        {
            "sku_number": "SKU-1006",
            "product_name": "Cheetos Crunchy 8.5oz",
            "is_private_brand": False,
            "sales": 18500.00,
            "units": 6100,
            "margin_percentage": 16.5,
            "scenarios": {
                "Conservative": "REDUCE",
                "Balanced": "SWAP",
                "Aggressive": "SWAP",
            },
        },
        {
            "sku_number": "SKU-1007",
            "product_name": "Clover Valley Pretzels 16oz",
            "is_private_brand": True,
            "sales": 4500.00,
            "units": 2250,
            "margin_percentage": 40.0,
            "scenarios": {
                "Conservative": "MAINTAIN",
                "Balanced": "MAINTAIN",
                "Aggressive": "GROW",
            },
        },
        {
            "sku_number": "SKU-1008",
            "product_name": "Rold Gold Tiny Twists 16oz",
            "is_private_brand": False,
            "sales": 11200.00,
            "units": 3700,
            "margin_percentage": 20.0,
            "scenarios": {
                "Conservative": "REDUCE",
                "Balanced": "REDUCE",
                "Aggressive": "REDUCE",
            },
        },
    ]

    for item in snacks_data:
        sku = models.SKU(
            sku_number=item["sku_number"],
            product_name=item["product_name"],
            category="snacks",
            is_private_brand=item["is_private_brand"],
        )
        db.add(sku)
        db.commit()
        db.refresh(sku)

        # Add performance
        perf = models.SKUPerformance(
            sku_id=sku.id,
            sales=item["sales"],
            units=item["units"],
            margin_percentage=item["margin_percentage"],
        )
        db.add(perf)

        # Add scenarios
        for s_name, action in item["scenarios"].items():
            scen = models.AssortmentScenario(
                sku_id=sku.id, scenario_name=s_name, action=action
            )
            db.add(scen)
        db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)
    # Seed data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="DG Cluster Assortment Advisor & Password Reset API", lifespan=lifespan
)

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

# Include existing password reset router
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the DG Cluster Assortment Advisor & Password Reset API"
    }


@app.get(
    "/api/v1/kpis/snacks/small-town-value", response_model=schemas.KPIMetricsResponse
)
def get_kpis(db: Session = Depends(get_db)):
    # Ensure data is seeded if not already
    seed_data(db)

    skus = db.query(models.SKU).filter(models.SKU.category == "snacks").all()
    total_sales = 0.0
    pb_sales = 0.0
    for sku in skus:
        perf = (
            db.query(models.SKUPerformance)
            .filter(models.SKUPerformance.sku_id == sku.id)
            .first()
        )
        if perf:
            total_sales += float(perf.sales)
            if sku.is_private_brand:
                pb_sales += float(perf.sales)

    sales_per_linear_ft = round(total_sales / 120.0, 2) if total_sales > 0 else 0.0
    pb_percentage = (
        round((pb_sales / total_sales) * 100.0, 2) if total_sales > 0 else 0.0
    )

    return {
        "sales_per_linear_ft": sales_per_linear_ft,
        "private_brand_percentage": pb_percentage,
        "in_stock_rate": 96.4,
        "shelf_capacity_percentage": 88.2,
    }


@app.get(
    "/api/v1/skus/performance", response_model=List[schemas.SKUPerformanceResponse]
)
def get_sku_performance(
    category: str = Query("snacks", description="Category filter"),
    cluster: str = Query("small-town-value", description="Cluster filter"),
    db: Session = Depends(get_db),
):
    if category.lower() != "snacks" or cluster.lower() != "small-town-value":
        raise HTTPException(
            status_code=400, detail="Invalid category or cluster parameter"
        )

    # Ensure data is seeded if not already
    seed_data(db)

    results = crud.get_all_skus_with_performance_and_scenarios(
        db, category=category.lower()
    )
    return results


@app.post("/api/v1/assortment/submit", response_model=schemas.AssortmentSubmitResponse)
def submit_assortment(
    payload: schemas.AssortmentSubmitRequest, db: Session = Depends(get_db)
):
    # Ensure data is seeded if not already
    seed_data(db)

    total_projected_sales = 0.0
    pb_projected_sales = 0.0

    sku_action_map = {item.sku_id: item.action for item in payload.sku_actions}

    skus = db.query(models.SKU).filter(models.SKU.category == "snacks").all()
    for sku in skus:
        perf = (
            db.query(models.SKUPerformance)
            .filter(models.SKUPerformance.sku_id == sku.id)
            .first()
        )
        if not perf:
            continue

        action = sku_action_map.get(sku.id, "MAINTAIN")
        multiplier = 1.0
        if action == "GROW":
            multiplier = 1.25
        elif action == "REDUCE":
            multiplier = 0.5
        elif action == "SWAP":
            multiplier = 0.0

        projected_sales = float(perf.sales) * multiplier
        total_projected_sales += projected_sales
        if sku.is_private_brand:
            pb_projected_sales += projected_sales

    projected_pb_pct = (
        (pb_projected_sales / total_projected_sales * 100.0)
        if total_projected_sales > 0
        else 0.0
    )

    if projected_pb_pct < 20.0:
        raise HTTPException(
            status_code=400,
            detail=f"Guardrail violation: Projected Private Brand % ({projected_pb_pct:.1f}%) falls below the 20.0% target.",
        )

    # Log submission
    actions_dict = {str(item.sku_id): item.action for item in payload.sku_actions}
    submission = crud.create_submission_log(
        db=db,
        user_id="manager@dollargeneral.com",
        scenario_selected=payload.scenario_selected,
        actions_payload=actions_dict,
    )

    audit_summary = (
        f"Assortment plan submitted successfully for Small Town Value Cluster (Snacks). "
        f"Scenario: {payload.scenario_selected}. Total SKUs affected: {len(payload.sku_actions)}. "
        f"Projected Private Brand Share: {projected_pb_pct:.1f}%."
    )

    return {
        "submission_id": submission.id,
        "status": "SUCCESS",
        "scenario_selected": payload.scenario_selected,
        "actions_submitted_count": len(payload.sku_actions),
        "manager_email": "manager@dollargeneral.com",
        "timestamp": datetime.utcnow(),
        "audit_trail_summary": audit_summary,
    }
