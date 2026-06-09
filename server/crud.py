from sqlalchemy.orm import Session
from server.models import Product, Scenario, ScenarioItem, Approval
from server.schemas import GuardrailStatus
import datetime

INITIAL_STATUS_MAP = {
    "CV-POT-01": "GROW",
    "LAYS-CLA-02": "MAINTAIN",
    "CV-PRE-03": "REDUCE",
    "DOR-NCH-04": "MAINTAIN",
    "CV-TOR-05": "SWAP",
    "CHE-CRU-06": "MAINTAIN",
    "CV-CHS-07": "GROW"
}

def get_kpis(db: Session):
    products = db.query(Product).all()
    if not products:
        return {
            "sales_linear_ft": 0.0,
            "private_brand_pct": 0.0,
            "in_stock_rate": 0.0,
            "shelf_capacity": 0.0
        }

    total_sales = sum(p.sales for p in products)
    total_shelf_space = sum(p.shelf_space for p in products)
    total_private_brand_sales = sum(p.sales for p in products if p.is_private_brand)
    in_stock_count = sum(1 for p in products if p.in_stock)
    total_skus = len(products)

    sales_linear_ft = round(total_sales / total_shelf_space, 2) if total_shelf_space > 0 else 0.0
    private_brand_pct = round((total_private_brand_sales / total_sales) * 100, 1) if total_sales > 0 else 0.0
    in_stock_rate = round((in_stock_count / total_skus) * 100, 1) if total_skus > 0 else 0.0
    
    # Capacity utilization based on 82.9 ft total capacity
    shelf_capacity = round((total_shelf_space / 82.9) * 100, 1) if total_shelf_space > 0 else 0.0

    return {
        "sales_linear_ft": sales_linear_ft,
        "private_brand_pct": private_brand_pct,
        "in_stock_rate": in_stock_rate,
        "shelf_capacity": shelf_capacity
    }

def get_skus(db: Session):
    products = db.query(Product).all()
    result = []
    for p in products:
        status = INITIAL_STATUS_MAP.get(p.sku, "MAINTAIN")
        result.append({
            "product_id": p.product_id,
            "sku": p.sku,
            "name": p.name,
            "margin": p.margin,
            "sales": p.sales,
            "shelf_space": p.shelf_space,
            "in_stock": p.in_stock,
            "is_private_brand": p.is_private_brand,
            "status": status
        })
    return result

def get_scenarios(db: Session):
    scenarios = db.query(Scenario).all()
    result = []
    for s in scenarios:
        items = db.query(ScenarioItem).filter(ScenarioItem.scenario_id == s.scenario_id).all()
        items_to_add = []
        items_to_remove = []
        for item in items:
            if item.action == "ADD":
                items_to_add.append({
                    "sku": item.sku,
                    "name": item.name,
                    "is_private_brand": item.is_private_brand,
                    "shelf_space": item.shelf_space
                })
            elif item.action == "REMOVE":
                items_to_remove.append({
                    "product_id": item.product_id,
                    "sku": item.sku,
                    "name": item.name
                })
        result.append({
            "scenario_id": s.scenario_id,
            "name": s.name,
            "description": s.description,
            "projected_sales_lift": s.projected_sales_lift,
            "new_private_brand_pct": s.new_private_brand_pct,
            "shelf_space_impact_ft": s.shelf_space_impact_ft,
            "items_to_add": items_to_add,
            "items_to_remove": items_to_remove
        })
    return result

def select_scenario(db: Session, scenario_id: str):
    scenario = db.query(Scenario).filter(Scenario.scenario_id == scenario_id).first()
    if not scenario:
        return None
    
    # Reset all selections
    db.query(Scenario).update({Scenario.is_selected: False})
    scenario.is_selected = True
    db.commit()
    db.refresh(scenario)
    return scenario

def check_guardrails(db: Session, scenario: Scenario):
    # 1. New SKU limit check: New SKUs must not exceed 20% of total assortment
    total_skus = db.query(Product).count()
    items_to_add_count = db.query(ScenarioItem).filter(
        ScenarioItem.scenario_id == scenario.scenario_id,
        ScenarioItem.action == "ADD"
    ).count()
    
    ratio = items_to_add_count / total_skus if total_skus > 0 else 0.0
    new_sku_limit_check = "PASS" if ratio <= 0.20 else "FAIL"

    # 2. Private Brand check: Private Brand % must not fall below current level
    kpis = get_kpis(db)
    current_pb_pct = kpis["private_brand_pct"]
    private_brand_check = "PASS" if scenario.new_private_brand_pct >= current_pb_pct else "FAIL"

    # 3. Shelf space check: Total required shelf space must not exceed capacity (80.0 ft)
    products = db.query(Product).all()
    current_shelf_space = sum(p.shelf_space for p in products)
    new_shelf_space = current_shelf_space + scenario.shelf_space_impact_ft
    shelf_space_check = "PASS" if new_shelf_space <= 80.0 else "FAIL"

    return GuardrailStatus(
        new_sku_limit_check=new_sku_limit_check,
        private_brand_check=private_brand_check,
        shelf_space_check=shelf_space_check
    )

def create_approval(db: Session, scenario_id: str, approver_name: str):
    scenario = db.query(Scenario).filter(Scenario.scenario_id == scenario_id).first()
    if not scenario:
        return None, None

    status = check_guardrails(db, scenario)
    
    # If any guardrail fails, we do not save the approval and return failure
    if status.new_sku_limit_check == "FAIL" or status.private_brand_check == "FAIL" or status.shelf_space_check == "FAIL":
        return None, status

    approval = Approval(
        scenario_id=scenario_id,
        approver_name=approver_name,
        guardrail_status={
            "new_sku_limit_check": status.new_sku_limit_check,
            "private_brand_check": status.private_brand_check,
            "shelf_space_check": status.shelf_space_check
        }
    )
    db.add(approval)
    db.commit()
    db.refresh(approval)
    return approval, status
