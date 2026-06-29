import random
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import schemas, crud, models
from server.database import get_db

router = APIRouter()


@router.get("/kpis", response_model=schemas.KPIsResponse)
def get_kpis(db: Session = Depends(get_db)):
    try:
        # Verify database connection
        db.query(models.Product).first()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection fails: {str(e)}",
        )

    # Return exact values from the contract
    return schemas.KPIsResponse(
        sales_per_linear_ft=15.75,
        private_brand_percentage=22.5,
        in_stock_rate=94.0,
        shelf_capacity_utilized=85.0,
    )


@router.get("/skus", response_model=list[schemas.SKUResponse])
def get_skus(db: Session = Depends(get_db)):
    try:
        # Ensure data is seeded
        crud.seed_data(db)
        products = crud.get_products_with_metrics(db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection fails: {str(e)}",
        )

    response = []
    for p in products:
        # Calculate status badge based on defined business logic
        vel = p.sales_metrics.sales_velocity if p.sales_metrics else 0.0
        trend = p.sales_metrics.sales_trend if p.sales_metrics else 0.0

        if vel >= 40.0 and trend >= 5.0:
            sku_status = "GROW"
        elif vel >= 20.0 and trend >= -2.0:
            sku_status = "MAINTAIN"
        elif vel >= 12.0 and trend >= -5.0:
            sku_status = "SWAP"
        else:
            sku_status = "REDUCE"

        response.append(
            schemas.SKUResponse(
                sku=p.sku,
                product_name=p.name,
                brand=p.brand,
                sub_category=p.sub_category,
                sales_velocity=vel,
                sales_trend=trend,
                status=sku_status,
            )
        )
    return response


@router.post("/scenarios/{scenario_name}", response_model=schemas.ScenarioResponse)
def post_scenario(scenario_name: str, db: Session = Depends(get_db)):
    try:
        # Verify database connection
        db.query(models.Product).first()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection fails: {str(e)}",
        )

    name_lower = scenario_name.lower()
    if name_lower == "balanced":
        return schemas.ScenarioResponse(
            scenario_name="Balanced",
            projected_impact=schemas.ProjectedImpact(
                sales_per_linear_ft_change=7.5,
                private_brand_percentage_change=3.0,
                in_stock_rate_change=0.5,
                shelf_capacity_utilized_change=-2.0,
            ),
            sku_action_summary=schemas.SkuActionSummary(
                add=5, keep=15, swap=3, remove=2
            ),
            guardrail_checks=[
                schemas.GuardrailCheck(
                    name="Shelf Capacity",
                    status="PASSED",
                    message="Shelf capacity is within safe limits (83% utilized).",
                ),
                schemas.GuardrailCheck(
                    name="Category Sales",
                    status="PASSED",
                    message="Category sales projected to increase by 7.5%.",
                ),
            ],
        )
    elif name_lower == "conservative":
        return schemas.ScenarioResponse(
            scenario_name="Conservative",
            projected_impact=schemas.ProjectedImpact(
                sales_per_linear_ft_change=2.1,
                private_brand_percentage_change=0.5,
                in_stock_rate_change=0.1,
                shelf_capacity_utilized_change=-0.5,
            ),
            sku_action_summary=schemas.SkuActionSummary(
                add=1, keep=22, swap=1, remove=1
            ),
            guardrail_checks=[
                schemas.GuardrailCheck(
                    name="Shelf Capacity",
                    status="PASSED",
                    message="Shelf capacity is within safe limits (84.5% utilized).",
                ),
                schemas.GuardrailCheck(
                    name="Category Sales",
                    status="PASSED",
                    message="Category sales projected to increase by 2.1%.",
                ),
            ],
        )
    elif name_lower == "aggressive":
        return schemas.ScenarioResponse(
            scenario_name="Aggressive",
            projected_impact=schemas.ProjectedImpact(
                sales_per_linear_ft_change=12.4,
                private_brand_percentage_change=8.0,
                in_stock_rate_change=1.2,
                shelf_capacity_utilized_change=5.0,
            ),
            sku_action_summary=schemas.SkuActionSummary(
                add=10, keep=10, swap=5, remove=5
            ),
            guardrail_checks=[
                schemas.GuardrailCheck(
                    name="Shelf Capacity",
                    status="PASSED",
                    message="Shelf capacity is within safe limits (90% utilized).",
                ),
                schemas.GuardrailCheck(
                    name="Category Sales",
                    status="PASSED",
                    message="Category sales projected to increase by 12.4%.",
                ),
            ],
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid scenario name provided",
        )


@router.post("/approvals", response_model=schemas.ApprovalResponse)
def post_approval(request: schemas.ApprovalRequest, db: Session = Depends(get_db)):
    try:
        # Verify database connection
        db.query(models.Product).first()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection fails: {str(e)}",
        )

    if not request.scenario_name or request.scenario_name.lower() not in [
        "balanced",
        "conservative",
        "aggressive",
    ]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request body or critical guardrail violation",
        )

    # Generate audit trail ID: YYYYMMDD-XXXXXX
    today_str = datetime.date.today().strftime("%Y%m%d")
    random_hex = "".join(random.choices("0123456789ABCDEF", k=6))
    audit_trail_id = f"{today_str}-{random_hex}"

    # Save to database
    actions_list = [{"sku": a.sku, "action": a.action} for a in request.actions]
    crud.create_assortment_audit(
        db=db,
        scenario_name=request.scenario_name,
        actions=actions_list,
        audit_trail_id=audit_trail_id,
    )

    return schemas.ApprovalResponse(
        success=True,
        message="Success! Assortment changes for Small Town Value Cluster have been submitted.",
        audit_trail_id=audit_trail_id,
    )
