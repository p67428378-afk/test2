from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import schemas, crud
from typing import Optional

router = APIRouter()


@router.get("/kpis", response_model=schemas.KPIResponse)
def read_kpis(db: Session = Depends(get_db)):
    """
    Retrieves the four main KPI values for the header strip.
    """
    try:
        kpis = crud.get_kpis(db)
        return kpis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection fails or calculation error occurs: {str(e)}",
        )


def get_sku_status(
    scenario_name: str,
    is_private_brand: bool,
    weekly_sales: float,
    profit_margin: float,
    days_of_supply: int,
) -> str:
    scenario_name = scenario_name.lower()
    if scenario_name == "conservative":
        if days_of_supply < 5:
            return "REDUCE"
        elif profit_margin < 20.0:
            return "SWAP"
        elif weekly_sales > 4500.0:
            return "GROW"
        else:
            return "MAINTAIN"
    elif scenario_name == "balanced":
        if days_of_supply < 4:
            return "REDUCE"
        elif profit_margin < 18.0:
            return "SWAP"
        elif weekly_sales > 4000.0:
            return "GROW"
        else:
            return "MAINTAIN"
    elif scenario_name == "aggressive":
        if is_private_brand:
            return "GROW"
        elif profit_margin < 15.0:
            return "SWAP"
        elif days_of_supply < 3:
            return "REDUCE"
        else:
            return "MAINTAIN"
    else:
        return "MAINTAIN"


@router.get("/scenarios/{scenario_name}", response_model=schemas.ScenarioResponse)
def read_scenario(
    scenario_name: str,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = "asc",
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Retrieves the SKU list and projected impacts for a given scenario.
    Supports sorting, filtering, and searching.
    """
    scenario_name_lower = scenario_name.lower()
    if scenario_name_lower not in ["conservative", "balanced", "aggressive"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scenario name '{scenario_name}' is invalid. Must be one of: conservative, balanced, aggressive.",
        )

    try:
        scenario = crud.get_scenario_by_name(db, scenario_name_lower)
        if not scenario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scenario '{scenario_name}' not found in database.",
            )

        products = crud.get_products_with_metrics(db)

        skus = []
        grow_count = 0
        maintain_count = 0
        reduce_count = 0
        swap_count = 0

        for p in products:
            if p.performance_metrics:
                metric = p.performance_metrics[0]
                weekly_sales = float(metric.weekly_sales)
                profit_margin = float(metric.profit_margin)
                stock_level = int(metric.stock_level)
                days_of_supply = int(metric.days_of_supply)
            else:
                weekly_sales = 0.0
                profit_margin = 0.0
                stock_level = 0
                days_of_supply = 0

            sku_status = get_sku_status(
                scenario_name_lower,
                p.is_private_brand,
                weekly_sales,
                profit_margin,
                days_of_supply,
            )

            # Apply search filter
            if search:
                search_lower = search.lower()
                if (
                    search_lower not in p.sku_name.lower()
                    and search_lower not in p.upc.lower()
                ):
                    continue

            # Apply status filter
            if status_filter and status_filter.upper() != sku_status:
                continue

            if sku_status == "GROW":
                grow_count += 1
            elif sku_status == "MAINTAIN":
                maintain_count += 1
            elif sku_status == "REDUCE":
                reduce_count += 1
            elif sku_status == "SWAP":
                swap_count += 1

            skus.append(
                schemas.SKUPerformanceSchema(
                    sku_name=p.sku_name,
                    upc=p.upc,
                    weekly_sales=weekly_sales,
                    profit_margin=profit_margin,
                    stock_level=stock_level,
                    days_of_supply=days_of_supply,
                    status=sku_status,
                )
            )

        # Apply sorting
        if sort_by:
            reverse = sort_order.lower() == "desc"
            if sort_by == "sku_name":
                skus.sort(key=lambda x: x.sku_name, reverse=reverse)
            elif sort_by == "upc":
                skus.sort(key=lambda x: x.upc, reverse=reverse)
            elif sort_by == "weekly_sales":
                skus.sort(key=lambda x: x.weekly_sales, reverse=reverse)
            elif sort_by == "profit_margin":
                skus.sort(key=lambda x: x.profit_margin, reverse=reverse)
            elif sort_by == "stock_level":
                skus.sort(key=lambda x: x.stock_level, reverse=reverse)
            elif sort_by == "days_of_supply":
                skus.sort(key=lambda x: x.days_of_supply, reverse=reverse)
            elif sort_by == "status":
                skus.sort(key=lambda x: x.status, reverse=reverse)

        total_count = len(products) if len(products) > 0 else 1
        new_items_pct = (grow_count / total_count) * 100.0

        # Guardrail checks
        private_brand_passed = float(scenario.projected_private_brand_pct) > 20.0
        shelf_capacity_passed = float(scenario.projected_shelf_capacity_pct) < 95.0
        new_items_passed = new_items_pct < 10.0  # Guardrail: New Items < 10%

        return schemas.ScenarioResponse(
            scenario_name=scenario.name,
            projected_sales_impact_pct=float(scenario.projected_sales_impact_pct),
            projected_private_brand_pct=float(scenario.projected_private_brand_pct),
            projected_shelf_capacity_pct=float(scenario.projected_shelf_capacity_pct),
            action_counts=schemas.ActionCountsSchema(
                grow=grow_count,
                maintain=maintain_count,
                reduce=reduce_count,
                swap=swap_count,
            ),
            guardrails=schemas.GuardrailsSchema(
                private_brand_passed=private_brand_passed,
                shelf_capacity_passed=shelf_capacity_passed,
                new_items_passed=new_items_passed,
            ),
            skus=skus,
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection fails: {str(e)}",
        )


@router.post(
    "/assortment-decisions",
    response_model=schemas.AssortmentDecisionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_decision(
    decision: schemas.AssortmentDecisionRequest, db: Session = Depends(get_db)
):
    """
    Submits the final assortment decision for auditing.
    """
    if decision.scenario_applied.lower() not in [
        "conservative",
        "balanced",
        "aggressive",
    ]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid scenario applied: '{decision.scenario_applied}'",
        )

    try:
        scenario = crud.get_scenario_by_name(db, decision.scenario_applied)
        if not scenario:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Scenario '{decision.scenario_applied}' not found.",
            )

        # Calculate new items percentage from action counts
        total_actions = (
            decision.action_counts.grow
            + decision.action_counts.maintain
            + decision.action_counts.reduce
            + decision.action_counts.swap
        )
        total_actions = total_actions if total_actions > 0 else 1
        new_items_pct = (decision.action_counts.grow / total_actions) * 100.0

        # Guardrail checks
        private_brand_passed = float(scenario.projected_private_brand_pct) > 20.0
        shelf_capacity_passed = float(scenario.projected_shelf_capacity_pct) < 95.0
        new_items_passed = new_items_pct < 10.0  # Guardrail: New Items < 10%

        if (
            not private_brand_passed
            or not shelf_capacity_passed
            or not new_items_passed
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Guardrail check fails. Cannot submit assortment changes.",
            )

        result = crud.create_assortment_decision(db, decision)
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database write fails: {str(e)}",
        )
