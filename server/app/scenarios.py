from sqlalchemy.orm import Session
from server.app import models, schemas

def get_scenario_data(db: Session, scenario_name: str) -> schemas.ScenarioResponse:
    name_lower = scenario_name.lower()
    products = db.query(models.Product).all()

    # Default fallback if no products seeded yet
    if not products:
        # Seed them inline
        from server.app.crud import seed_products
        seed_products(db)
        products = db.query(models.Product).all()

    sku_action_list = []

    if name_lower == "conservative":
        projected_sales = 128000.0
        projected_private_brand_pct = 21.5
        projected_shelf_capacity_pct = 82.0
        sku_count = 440
        actions = {"add": 5, "keep": 430, "remove": 5, "swap": 2}
        guardrails = schemas.GuardrailsInfo(
            message="All guardrails passed.",
            private_brand_passed=True,
            sku_count_passed=True
        )
        # Map actions for our seeded products
        for p in products:
            action = "KEEP"
            if p.sku == "SKU-1004":
                action = "KEEP"
            elif p.sku == "SKU-1006":
                action = "KEEP"
            sku_action_list.append(schemas.SKUActionItem(
                sku=p.sku,
                name=p.name,
                is_private_brand=p.is_private_brand,
                action=action
            ))

    elif name_lower == "balanced":
        projected_sales = 135000.0
        projected_private_brand_pct = 26.5
        projected_shelf_capacity_pct = 85.0
        sku_count = 450
        actions = {"add": 15, "keep": 413, "remove": 12, "swap": 10}
        guardrails = schemas.GuardrailsInfo(
            message="All guardrails passed.",
            private_brand_passed=True,
            sku_count_passed=True
        )
        for p in products:
            action = "KEEP"
            if p.sku == "SKU-1004":
                action = "SWAP"
            elif p.sku == "SKU-1006":
                action = "REMOVE"
            sku_action_list.append(schemas.SKUActionItem(
                sku=p.sku,
                name=p.name,
                is_private_brand=p.is_private_brand,
                action=action
            ))

    elif name_lower == "aggressive":
        projected_sales = 155000.0
        projected_private_brand_pct = 38.0
        projected_shelf_capacity_pct = 92.0
        sku_count = 480
        actions = {"add": 45, "keep": 380, "remove": 35, "swap": 20}
        guardrails = schemas.GuardrailsInfo(
            message="Private brand % and shelf capacity exceed recommended limits.",
            private_brand_passed=False,
            sku_count_passed=False
        )
        for p in products:
            action = "KEEP"
            if p.sku == "SKU-1002" or p.sku == "SKU-1005":
                action = "GROW"
            elif p.sku == "SKU-1004":
                action = "SWAP"
            elif p.sku == "SKU-1006":
                action = "REMOVE"
            sku_action_list.append(schemas.SKUActionItem(
                sku=p.sku,
                name=p.name,
                is_private_brand=p.is_private_brand,
                action=action
            ))
    else:
        raise ValueError("Invalid scenario name")

    return schemas.ScenarioResponse(
        scenario_name=scenario_name,
        projected_sales=projected_sales,
        projected_private_brand_pct=projected_private_brand_pct,
        projected_shelf_capacity_pct=projected_shelf_capacity_pct,
        sku_count=sku_count,
        actions=actions,
        guardrails=guardrails,
        sku_action_list=sku_action_list
    )
