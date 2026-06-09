from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import crud, schemas, models
from server.database import get_db
from datetime import datetime

router = APIRouter()

@router.get("/dashboard-data", response_model=schemas.DashboardDataResponse)
def get_dashboard_data(db: Session = Depends(get_db)):
    # Ensure initial data is seeded
    crud.seed_initial_data(db)
    
    skus = crud.get_all_skus(db)
    
    kpis = schemas.DashboardKPIs(
        sales_per_linear_ft=schemas.KPIMetric(value=1250.5, change=5.2, unit="$"),
        private_brand_pct=schemas.KPIMetric(value=32.0, change=1.5, unit="%"),
        in_stock_rate=schemas.KPIMetric(value=94.5, change=-0.8, unit="%"),
        shelf_capacity=schemas.KPIMetric(value=85.0, change=2.0, unit="%")
    )
    
    return schemas.DashboardDataResponse(kpis=kpis, skus=skus)

@router.get("/scenario/{scenario_name}", response_model=schemas.ScenarioResponse)
def get_scenario(scenario_name: str, db: Session = Depends(get_db)):
    # Ensure initial data is seeded
    crud.seed_initial_data(db)
    
    scenario = crud.get_scenario_by_name(db, scenario_name)
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scenario '{scenario_name}' not found"
        )
    
    actions = crud.get_scenario_actions(db, scenario.scenario_id)
    
    # Map actions to schema
    action_schemas = []
    for act in actions:
        action_schemas.append(
            schemas.ScenarioActionSchema(
                sku_id=act.sku_id,
                name=act.sku.name,
                action_type=act.action_type
            )
        )
        
    # Define projected metrics and guardrails based on scenario name
    name_lower = scenario_name.lower()
    if name_lower == "balanced":
        projected_metrics = schemas.DashboardKPIs(
            sales_per_linear_ft=schemas.KPIMetric(value=1280.0, change=2.4, unit="$"),
            private_brand_pct=schemas.KPIMetric(value=34.5, change=2.5, unit="%"),
            in_stock_rate=schemas.KPIMetric(value=95.0, change=0.5, unit="%"),
            shelf_capacity=schemas.KPIMetric(value=82.0, change=-3.0, unit="%")
        )
        guardrails = [
            schemas.GuardrailCheck(
                name="Private Brand % Goal",
                status="PASSED",
                message="Private Brand % is 34.5%, which meets the 30% target."
            ),
            schemas.GuardrailCheck(
                name="Shelf Capacity Limit",
                status="PASSED",
                message="Shelf capacity is 82%, which is within the 90% limit."
            )
        ]
    elif name_lower == "conservative":
        projected_metrics = schemas.DashboardKPIs(
            sales_per_linear_ft=schemas.KPIMetric(value=1210.0, change=-3.2, unit="$"),
            private_brand_pct=schemas.KPIMetric(value=31.0, change=-1.0, unit="%"),
            in_stock_rate=schemas.KPIMetric(value=97.5, change=3.0, unit="%"),
            shelf_capacity=schemas.KPIMetric(value=78.0, change=-7.0, unit="%")
        )
        guardrails = [
            schemas.GuardrailCheck(
                name="Private Brand % Goal",
                status="PASSED",
                message="Private Brand % is 31.0%, which meets the 30% target."
            ),
            schemas.GuardrailCheck(
                name="Shelf Capacity Limit",
                status="PASSED",
                message="Shelf capacity is 78%, which is within the 90% limit."
            )
        ]
    elif name_lower == "aggressive":
        projected_metrics = schemas.DashboardKPIs(
            sales_per_linear_ft=schemas.KPIMetric(value=1350.0, change=7.9, unit="$"),
            private_brand_pct=schemas.KPIMetric(value=38.0, change=6.0, unit="%"),
            in_stock_rate=schemas.KPIMetric(value=91.0, change=-3.5, unit="%"),
            shelf_capacity=schemas.KPIMetric(value=92.0, change=7.0, unit="%")
        )
        guardrails = [
            schemas.GuardrailCheck(
                name="Private Brand % Goal",
                status="PASSED",
                message="Private Brand % is 38.0%, which meets the 30% target."
            ),
            schemas.GuardrailCheck(
                name="Shelf Capacity Limit",
                status="FAILED",
                message="Shelf capacity is 92%, which exceeds the 90% limit."
            )
        ]
    else:
        projected_metrics = schemas.DashboardKPIs(
            sales_per_linear_ft=schemas.KPIMetric(value=1250.5, change=5.2, unit="$"),
            private_brand_pct=schemas.KPIMetric(value=32.0, change=1.5, unit="%"),
            in_stock_rate=schemas.KPIMetric(value=94.5, change=-0.8, unit="%"),
            shelf_capacity=schemas.KPIMetric(value=85.0, change=2.0, unit="%")
        )
        guardrails = []

    return schemas.ScenarioResponse(
        scenario_name=scenario.name,
        projected_metrics=projected_metrics,
        actions=action_schemas,
        guardrails=guardrails
    )

@router.post("/submit-assortment", response_model=schemas.SubmitAssortmentResponse)
def submit_assortment(payload: schemas.SubmitAssortmentRequest, db: Session = Depends(get_db)):
    # Ensure initial data is seeded
    crud.seed_initial_data(db)
    
    scenario = crud.get_scenario_by_name(db, payload.scenario_name)
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid scenario name: '{payload.scenario_name}'"
        )
        
    if not payload.actions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Actions list cannot be empty"
        )
        
    # Create submission
    user_id = "category.manager@dollargeneral.com"
    submission = crud.create_assortment_submission(db, user_id, scenario.scenario_id)
    
    # Create details
    for act in payload.actions:
        # Verify SKU exists
        sku = db.query(models.SKUPerformance).filter(models.SKUPerformance.sku_id == act.sku_id).first()
        if not sku:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"SKU '{act.sku_id}' not found"
            )
        crud.create_submission_detail(db, submission.submission_id, act.sku_id, act.action_type)
        
    now_str = datetime.utcnow().strftime("%Y-%m-%d %I:%M %p")
    summary = f"Assortment for Small Town Value Cluster submitted by {user_id} at {now_str} UTC under the '{scenario.name}' scenario."
    
    audit_trail = schemas.AuditTrailSchema(
        submission_id=submission.submission_id,
        user_id=user_id,
        timestamp=submission.timestamp.isoformat() + "Z",
        scenario_name=scenario.name,
        summary=summary
    )
    
    return schemas.SubmitAssortmentResponse(
        status="SUCCESS",
        audit_trail=audit_trail
    )
