import uuid
import json
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from server import models, schemas

# Static Mock Data for Snacks Category
MOCK_KPIS = {
    "sales_per_linear_ft": 15.75,
    "private_brand_percentage": 28.4,
    "in_stock_rate": 96.2,
    "shelf_capacity": 84.0,
}

MOCK_SKUS: List[Dict[str, Any]] = [
    {
        "sku": "Lay's Classic 13oz",
        "sales_per_linear_ft": 18.20,
        "is_private_brand": False,
        "in_stock_rate": 98.5,
        "status": "MAINTAIN",
    },
    {
        "sku": "DG Clover Valley Potato Chips 10oz",
        "sales_per_linear_ft": 22.40,
        "is_private_brand": True,
        "in_stock_rate": 94.2,
        "status": "GROW",
    },
    {
        "sku": "Cheetos Crunchy 8.5oz",
        "sales_per_linear_ft": 16.90,
        "is_private_brand": False,
        "in_stock_rate": 97.1,
        "status": "MAINTAIN",
    },
    {
        "sku": "Clover Valley Pretzels 16oz",
        "sales_per_linear_ft": 14.50,
        "is_private_brand": True,
        "in_stock_rate": 92.0,
        "status": "GROW",
    },
    {
        "sku": "Slow-Seller Cookies 12oz",
        "sales_per_linear_ft": 6.20,
        "is_private_brand": False,
        "in_stock_rate": 99.8,
        "status": "REDUCE",
    },
]

MOCK_SCENARIOS: Dict[str, Dict[str, Any]] = {
    "conservative": {
        "scenario_name": "Conservative",
        "projected_sales_impact": 1.5,
        "projected_private_brand": 28.8,
        "guardrails": {
            "private_brand_goal_met": False,
            "shelf_capacity_within_limits": True,
        },
        "sku_actions": [
            {"sku": "Lay's Classic 13oz", "action": "KEEP"},
            {"sku": "DG Clover Valley Potato Chips 10oz", "action": "KEEP"},
            {"sku": "Cheetos Crunchy 8.5oz", "action": "KEEP"},
            {"sku": "Clover Valley Pretzels 16oz", "action": "KEEP"},
            {"sku": "Slow-Seller Cookies 12oz", "action": "REMOVE"},
        ],
    },
    "balanced": {
        "scenario_name": "Balanced",
        "projected_sales_impact": 4.2,
        "projected_private_brand": 29.5,
        "guardrails": {
            "private_brand_goal_met": True,
            "shelf_capacity_within_limits": True,
        },
        "sku_actions": [
            {"sku": "Lay's Classic 13oz", "action": "KEEP"},
            {"sku": "DG Clover Valley Potato Chips 10oz", "action": "GROW"},
            {"sku": "Cheetos Crunchy 8.5oz", "action": "KEEP"},
            {"sku": "Clover Valley Pretzels 16oz", "action": "GROW"},
            {"sku": "Slow-Seller Cookies 12oz", "action": "REMOVE"},
            {"sku": "Clover Valley Tortilla Chips", "action": "ADD"},
            {"sku": "Brand X", "action": "SWAP"},
        ],
    },
    "aggressive": {
        "scenario_name": "Aggressive",
        "projected_sales_impact": 7.8,
        "projected_private_brand": 31.2,
        "guardrails": {
            "private_brand_goal_met": True,
            "shelf_capacity_within_limits": False,
        },
        "sku_actions": [
            {"sku": "Lay's Classic 13oz", "action": "SWAP"},
            {"sku": "DG Clover Valley Potato Chips 10oz", "action": "GROW"},
            {"sku": "Cheetos Crunchy 8.5oz", "action": "SWAP"},
            {"sku": "Clover Valley Pretzels 16oz", "action": "GROW"},
            {"sku": "Slow-Seller Cookies 12oz", "action": "REMOVE"},
            {"sku": "Clover Valley Tortilla Chips", "action": "ADD"},
            {"sku": "Clover Valley Cheese Crackers", "action": "ADD"},
        ],
    },
}


def get_kpis() -> Dict[str, float]:
    return MOCK_KPIS


def get_skus(
    sort_by: Optional[str] = None, filter_status: Optional[str] = None
) -> List[Dict[str, Any]]:
    skus = list(MOCK_SKUS)
    if filter_status:
        skus = [s for s in skus if str(s["status"]).upper() == filter_status.upper()]
    if sort_by:
        reverse = False
        if sort_by.startswith("-"):
            sort_by = sort_by[1:]
            reverse = True
        if sort_by in ["sales_per_linear_ft", "in_stock_rate", "sku", "status"]:
            field = sort_by
            skus.sort(key=lambda x: x[field], reverse=reverse)
    return skus


def get_scenario(scenario_name: str) -> Optional[Dict[str, Any]]:
    name_key = scenario_name.lower()
    if name_key not in MOCK_SCENARIOS:
        return None
    return MOCK_SCENARIOS[name_key]


def create_assortment_plan(
    db: Session, plan_in: schemas.AssortmentPlanCreate
) -> models.AssortmentPlan:
    scenario_data = get_scenario(plan_in.scenario_name)
    if not scenario_data:
        raise ValueError(f"Scenario '{plan_in.scenario_name}' not found")

    # Generate a unique audit trail ID
    audit_trail_id = f"AP-{uuid.uuid4().hex[:5].upper()}-STV"

    db_plan = models.AssortmentPlan(
        id=uuid.uuid4(),
        scenario_name=scenario_data["scenario_name"],
        submitted_by=plan_in.submitted_by,
        audit_trail_id=audit_trail_id,
        guardrail_status=json.dumps(scenario_data["guardrails"]),
    )
    db.add(db_plan)
    db.flush()

    for action in scenario_data["sku_actions"]:
        db_action = models.PlanSKUAction(
            id=uuid.uuid4(),
            assortment_plan_id=db_plan.id,
            sku=action["sku"],
            action=action["action"],
        )
        db.add(db_action)

    db.commit()
    db.refresh(db_plan)
    return db_plan


def get_assortment_plan(
    db: Session, plan_id: uuid.UUID
) -> Optional[models.AssortmentPlan]:
    return (
        db.query(models.AssortmentPlan)
        .filter(models.AssortmentPlan.id == plan_id)
        .first()
    )
