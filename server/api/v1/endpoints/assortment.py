from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from server import schemas, crud
from server.database import get_db

router = APIRouter()


# Mock Role-Based Access Control (RBAC) dependency
def verify_category_manager(x_user_role: str = Header(default="Category Manager")):
    if x_user_role != "Category Manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Role 'Category Manager' required.",
        )
    return x_user_role


@router.get("/assortment/dashboard", response_model=schemas.DashboardResponse)
def get_dashboard_data(
    db: Session = Depends(get_db), current_role: str = Depends(verify_category_manager)
):
    try:
        # 1. Fetch products and metrics
        products = crud.get_products_with_metrics(db)
        sku_performance = []

        status_map = {
            "SKU-1001": "GROW",
            "SKU-8492": "MAINTAIN",
            "SKU-3104": "GROW",
            "SKU-5521": "SWAP",
            "SKU-1192": "MAINTAIN",
            "SKU-7743": "GROW",
            "SKU-2281": "REDUCE",
        }

        for product in products:
            metric = (
                product.performance_metrics[0] if product.performance_metrics else None
            )
            if metric:
                sku_performance.append(
                    schemas.SkuPerformance(
                        id=product.id,
                        sku=product.sku,
                        name=product.name,
                        private_brand_percent=metric.private_brand_percent,
                        sales_per_linear_ft=metric.sales_per_linear_ft,
                        in_stock_rate=metric.in_stock_rate,
                        shelf_capacity=metric.shelf_capacity,
                        status=status_map.get(product.sku, "MAINTAIN"),
                    )
                )

        # 2. Fetch scenarios
        db_scenarios = crud.get_scenarios(db)
        scenarios = []
        for s in db_scenarios:
            scenarios.append(
                schemas.ScenarioImpact(
                    name=s.name,
                    projected_impact=schemas.KpiMetrics(**s.rules["projected_impact"]),
                    guardrails=schemas.Guardrails(**s.rules["guardrails"]),
                    sku_actions=[
                        schemas.SkuAction(**action) for action in s.rules["sku_actions"]
                    ],
                )
            )

        # 3. Define current KPI metrics (as specified in the WorkSpec)
        kpi_metrics = schemas.KpiMetrics(
            in_stock_rate=96.2,
            private_brand_percent=24.5,
            sales_per_linear_ft=450.5,
            shelf_capacity=1200,
        )

        return schemas.DashboardResponse(
            kpi_metrics=kpi_metrics,
            scenarios=scenarios,
            sku_performance=sku_performance,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error when fetching dashboard data: {str(e)}",
        )


@router.post("/assortment/submit", response_model=schemas.AssortmentSubmitResponse)
def submit_assortment_plan(
    payload: schemas.AssortmentSubmitRequest,
    db: Session = Depends(get_db),
    current_role: str = Depends(verify_category_manager),
):
    # Validate scenario name
    valid_scenarios = ["Conservative", "Balanced", "Aggressive"]
    if payload.scenario_name not in valid_scenarios:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid scenario name. Must be one of {valid_scenarios}",
        )

    # Validate empty SKU actions list
    if not payload.sku_actions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SKU actions list cannot be empty",
        )

    try:
        submitted_by = "category_manager@dollargeneral.com"
        submission = crud.create_assortment_submission(db, payload, submitted_by)

        return schemas.AssortmentSubmitResponse(
            audit_trail_id=submission.audit_trail_id,
            scenario_name=submission.scenario_name,
            sku_actions_count=len(payload.sku_actions),
            status="SUCCESS",
            submitted_at=submission.created_at,
            submitted_by=submission.submitted_by,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error during submission: {str(e)}",
        )
