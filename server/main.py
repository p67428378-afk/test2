from fastapi import FastAPI, Depends, HTTPException, Query
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from datetime import datetime

from server.database import get_db, init_db, seed_data
from server.schemas import (
    KPISchema,
    SKUSchema,
    ScenarioCalculateRequest,
    ScenarioCalculateResponse,
    AssortmentReviewRequest,
    AssortmentReviewResponse,
    GuardrailCheck,
    SKUAction,
    AuditTrailSummary,
)
from server import crud
from server.api.v1.endpoints import password_reset

# Initialize DB and seed data
init_db()
db_session = next(get_db())
try:
    seed_data(db_session)
finally:
    db_session.close()

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

# Include original password reset router
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])


@app.get("/api/v1/kpis", response_model=KPISchema)
def read_kpis(db: Session = Depends(get_db)):
    kpis = crud.get_kpis(db)
    if not kpis:
        raise HTTPException(status_code=500, detail="KPIs not initialized")
    return kpis


@app.get("/api/v1/skus", response_model=List[SKUSchema])
def read_skus(status: Optional[str] = Query(None), db: Session = Depends(get_db)):
    valid_statuses = ["GROW", "MAINTAIN", "SWAP", "REDUCE"]
    if status and status.upper() not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status filter value. Must be one of {valid_statuses}",
        )
    return crud.get_skus(db, status=status.upper() if status else None)


@app.post("/api/v1/scenarios/calculate", response_model=ScenarioCalculateResponse)
def calculate_scenario(
    payload: ScenarioCalculateRequest, db: Session = Depends(get_db)
):
    scenario_name = payload.scenario_name.capitalize()
    if scenario_name not in ["Conservative", "Balanced", "Aggressive"]:
        raise HTTPException(status_code=400, detail="Invalid scenario name provided")

    # Mock calculations based on scenario type
    if scenario_name == "Conservative":
        projected_sales_lift = 1.5
        projected_margin_lift = 0.8
        private_brand_pct = 21.0
        shelf_cap = 86.0
        sku_actions = [
            SKUAction(
                sku_id="1",
                sku_name="Clover Valley Potato Chips 10oz",
                action="MAINTAIN",
            ),
            SKUAction(
                sku_id="2",
                sku_name="Clover Valley Tortilla Chips 12oz",
                action="MAINTAIN",
            ),
            SKUAction(
                sku_id="3", sku_name="Brand X Cheese Puffs 8oz", action="MAINTAIN"
            ),
            SKUAction(sku_id="4", sku_name="Brand Y Pretzels 16oz", action="REDUCE"),
            SKUAction(
                sku_id="5",
                sku_name="Clover Valley Animal Crackers 12oz",
                action="MAINTAIN",
            ),
        ]
    elif scenario_name == "Balanced":
        projected_sales_lift = 4.2
        projected_margin_lift = 2.5
        private_brand_pct = 22.5
        shelf_cap = 85.0
        sku_actions = [
            SKUAction(
                sku_id="1", sku_name="Clover Valley Potato Chips 10oz", action="GROW"
            ),
            SKUAction(
                sku_id="2",
                sku_name="Clover Valley Tortilla Chips 12oz",
                action="MAINTAIN",
            ),
            SKUAction(sku_id="3", sku_name="Brand X Cheese Puffs 8oz", action="SWAP"),
            SKUAction(sku_id="4", sku_name="Brand Y Pretzels 16oz", action="REDUCE"),
            SKUAction(
                sku_id="5", sku_name="Clover Valley Animal Crackers 12oz", action="GROW"
            ),
        ]
    else:  # Aggressive
        projected_sales_lift = 8.5
        projected_margin_lift = 5.0
        private_brand_pct = 26.0
        shelf_cap = 92.0  # Exceeds 90% limit
        sku_actions = [
            SKUAction(
                sku_id="1", sku_name="Clover Valley Potato Chips 10oz", action="GROW"
            ),
            SKUAction(
                sku_id="2", sku_name="Clover Valley Tortilla Chips 12oz", action="GROW"
            ),
            SKUAction(sku_id="3", sku_name="Brand X Cheese Puffs 8oz", action="SWAP"),
            SKUAction(sku_id="4", sku_name="Brand Y Pretzels 16oz", action="REDUCE"),
            SKUAction(
                sku_id="5", sku_name="Clover Valley Animal Crackers 12oz", action="GROW"
            ),
        ]

    # Guardrail checks
    pb_status = "PASSED" if private_brand_pct > 20.0 else "FAILED"
    pb_msg = f"Private Brand % remains above 20% (Current: {private_brand_pct}%)"

    sc_status = "PASSED" if shelf_cap < 90.0 else "FAILED"
    sc_msg = f"Shelf Capacity remains below 90% (Current: {shelf_cap}%)"

    guardrails = [
        GuardrailCheck(name="Private Brand %", status=pb_status, message=pb_msg),
        GuardrailCheck(name="Shelf Capacity", status=sc_status, message=sc_msg),
    ]

    return ScenarioCalculateResponse(
        scenario_name=scenario_name,
        projected_sales_lift=projected_sales_lift,
        projected_margin_lift=projected_margin_lift,
        guardrails=guardrails,
        sku_actions=sku_actions,
    )


@app.post("/api/v1/assortment-reviews", response_model=AssortmentReviewResponse)
def submit_assortment_review(
    payload: AssortmentReviewRequest, db: Session = Depends(get_db)
):
    scenario_name = payload.scenario_name.capitalize()
    if scenario_name not in ["Conservative", "Balanced", "Aggressive"]:
        raise HTTPException(status_code=400, detail="Invalid scenario name provided")

    # Guardrail check for Aggressive scenario
    if scenario_name == "Aggressive":
        raise HTTPException(
            status_code=400,
            detail="Cannot submit scenario with failing guardrails (Shelf Capacity exceeds 90%)",
        )

    submitted_by = "Category Manager"
    review = crud.create_assortment_review(
        db, scenario_name=scenario_name, submitted_by=submitted_by
    )

    submission_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat() + "Z"

    return AssortmentReviewResponse(
        id=review.id,
        scenario_name=review.scenario_name,
        submitted_by=review.submitted_by,
        created_at=review.created_at,
        status="SUBMITTED",
        audit_trail_summary=AuditTrailSummary(
            submission_id=submission_id, timestamp=timestamp
        ),
    )
