import os
import json
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from server import schemas, crud
from server.database import Base, engine, get_db
from server.api.v1.endpoints import password_reset

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DG Cluster Assortment Advisor API",
    description="Decision-support tool for Dollar General category managers to optimize Snacks product assortment.",
    version="1.0.0",
)

# CORS Middleware Configuration
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


# --- DG Cluster Assortment Advisor Endpoints ---


@app.get("/api/v1/kpis", response_model=schemas.KPISchema, tags=["Assortment Advisor"])
def get_kpis():
    """
    Retrieves the key performance indicators for the Snacks category.
    """
    try:
        return crud.get_kpis()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection or query fails: {str(e)}",
        )


@app.get(
    "/api/v1/skus", response_model=List[schemas.SKUSchema], tags=["Assortment Advisor"]
)
def get_skus(
    sort_by: Optional[str] = Query(
        None,
        description="Field to sort by (e.g., 'sales_per_linear_ft', '-sales_per_linear_ft')",
    ),
    filter_status: Optional[str] = Query(
        None,
        description="Filter by status badge (e.g., 'GROW', 'MAINTAIN', 'SWAP', 'REDUCE')",
    ),
):
    """
    Retrieves a list of Snacks SKUs with performance data. Supports sorting and filtering.
    """
    valid_sorts = [
        "sales_per_linear_ft",
        "-sales_per_linear_ft",
        "in_stock_rate",
        "-in_stock_rate",
        "sku",
        "-sku",
        "status",
        "-status",
    ]
    if sort_by and sort_by not in valid_sorts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid sort parameter. Allowed values: {valid_sorts}",
        )

    valid_statuses = ["GROW", "MAINTAIN", "SWAP", "REDUCE"]
    if filter_status and filter_status.upper() not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid filter_status parameter. Allowed values: {valid_statuses}",
        )

    return crud.get_skus(sort_by=sort_by, filter_status=filter_status)


@app.get(
    "/api/v1/scenarios/{scenario_name}",
    response_model=schemas.ScenarioSchema,
    tags=["Assortment Advisor"],
)
def get_scenario(scenario_name: str):
    """
    Retrieves the projected impact and SKU actions for a given scenario.
    """
    scenario = crud.get_scenario(scenario_name)
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scenario '{scenario_name}' not found. Choose from: Conservative, Balanced, Aggressive.",
        )
    return scenario


@app.post(
    "/api/v1/assortment-plans",
    response_model=schemas.AssortmentPlanResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Assortment Advisor"],
)
def create_assortment_plan(
    plan_in: schemas.AssortmentPlanCreate, db: Session = Depends(get_db)
):
    """
    Submits a new assortment plan for approval and storage.
    """
    try:
        db_plan = crud.create_assortment_plan(db, plan_in)
        # Map DB model to response schema
        return schemas.AssortmentPlanResponse(
            id=db_plan.id,
            scenario_name=db_plan.scenario_name,
            created_at=db_plan.created_at,
            submitted_by=db_plan.submitted_by,
            audit_trail_id=db_plan.audit_trail_id,
            guardrail_status=json.loads(db_plan.guardrail_status),
            sku_actions=[
                schemas.SKUActionSchema(sku=act.sku, action=act.action)
                for act in db_plan.sku_actions
            ],
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create assortment plan: {str(e)}",
        )


@app.get(
    "/api/v1/assortment-plans/{plan_id}",
    response_model=schemas.AssortmentPlanResponse,
    tags=["Assortment Advisor"],
)
def get_assortment_plan(plan_id: UUID, db: Session = Depends(get_db)):
    """
    Retrieves the details of a submitted assortment plan for the audit trail.
    """
    db_plan = crud.get_assortment_plan(db, plan_id)
    if not db_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assortment plan with ID {plan_id} not found.",
        )
    return schemas.AssortmentPlanResponse(
        id=db_plan.id,
        scenario_name=db_plan.scenario_name,
        created_at=db_plan.created_at,
        submitted_by=db_plan.submitted_by,
        audit_trail_id=db_plan.audit_trail_id,
        guardrail_status=json.loads(db_plan.guardrail_status),
        sku_actions=[
            schemas.SKUActionSchema(sku=act.sku, action=act.action)
            for act in db_plan.sku_actions
        ],
    )
