from server.app.models import SKU, ScenarioModel, GuardrailRule


def run_seed(db):
    # Seed SKUs if empty
    if db.query(SKU).count() == 0:
        skus_data = [
            {
                "sku_code": "SKU-1001",
                "product_name": "DG Choice Potato Chips 10oz",
                "sub_category": "Salty Snacks",
                "sales_volume_weekly": 145.0,
                "margin_pct": 38.5,
                "linear_space_ft": 1.5,
                "is_private_brand": True,
                "status_badge": "GROW",
            },
            {
                "sku_code": "SKU-1002",
                "product_name": "Slow-Mo Snack Mix 4oz",
                "sub_category": "Trail Mix",
                "sales_volume_weekly": 12.0,
                "margin_pct": 18.0,
                "linear_space_ft": 0.8,
                "is_private_brand": False,
                "status_badge": "REDUCE",
            },
            {
                "sku_code": "SKU-1003",
                "product_name": "Lay's Classic Potato Chips 8oz",
                "sub_category": "Salty Snacks",
                "sales_volume_weekly": 125.0,
                "margin_pct": 28.4,
                "linear_space_ft": 2.0,
                "is_private_brand": False,
                "status_badge": "MAINTAIN",
            },
            {
                "sku_code": "SKU-1004",
                "product_name": "Generic Brand Pretzels 12oz",
                "sub_category": "Salty Snacks",
                "sales_volume_weekly": 15.0,
                "margin_pct": 15.2,
                "linear_space_ft": 0.8,
                "is_private_brand": False,
                "status_badge": "REDUCE",
            },
            {
                "sku_code": "SKU-1005",
                "product_name": "Doritos Nacho Cheese 9.25oz",
                "sub_category": "Salty Snacks",
                "sales_volume_weekly": 118.7,
                "margin_pct": 31.0,
                "linear_space_ft": 2.0,
                "is_private_brand": False,
                "status_badge": "MAINTAIN",
            },
            {
                "sku_code": "SKU-1006",
                "product_name": "Clover Valley Trail Mix 8oz",
                "sub_category": "Trail Mix",
                "sales_volume_weekly": 85.0,
                "margin_pct": 48.5,
                "linear_space_ft": 1.0,
                "is_private_brand": True,
                "status_badge": "GROW",
            },
            {
                "sku_code": "SKU-1007",
                "product_name": "Old Brand Pork Rinds 4oz",
                "sub_category": "Salty Snacks",
                "sales_volume_weekly": 18.0,
                "margin_pct": 22.0,
                "linear_space_ft": 0.8,
                "is_private_brand": False,
                "status_badge": "SWAP",
            },
            {
                "sku_code": "SKU-1008",
                "product_name": "Clover Valley Tortilla Chips 13oz",
                "sub_category": "Salty Snacks",
                "sales_volume_weekly": 114.0,
                "margin_pct": 39.2,
                "linear_space_ft": 1.8,
                "is_private_brand": True,
                "status_badge": "MAINTAIN",
            },
            {
                "sku_code": "SKU-1009",
                "product_name": "Cheez-It Original 12.4oz",
                "sub_category": "Salty Snacks",
                "sales_volume_weekly": 98.0,
                "margin_pct": 32.0,
                "linear_space_ft": 1.5,
                "is_private_brand": False,
                "status_badge": "MAINTAIN",
            },
            {
                "sku_code": "SKU-1010",
                "product_name": "Clover Valley Cheese Curls 8.5oz",
                "sub_category": "Salty Snacks",
                "sales_volume_weekly": 92.0,
                "margin_pct": 44.0,
                "linear_space_ft": 1.2,
                "is_private_brand": True,
                "status_badge": "GROW",
            },
            {
                "sku_code": "SKU-1011",
                "product_name": "Pringles Original 5.2oz",
                "sub_category": "Salty Snacks",
                "sales_volume_weekly": 105.0,
                "margin_pct": 29.5,
                "linear_space_ft": 1.0,
                "is_private_brand": False,
                "status_badge": "MAINTAIN",
            },
            {
                "sku_code": "SKU-1012",
                "product_name": "Clover Valley Roasted Peanuts 16oz",
                "sub_category": "Nuts & Seeds",
                "sales_volume_weekly": 142.0,
                "margin_pct": 42.1,
                "linear_space_ft": 1.5,
                "is_private_brand": True,
                "status_badge": "GROW",
            },
            {
                "sku_code": "SKU-1013",
                "product_name": "Planters Salted Cashews 8oz",
                "sub_category": "Nuts & Seeds",
                "sales_volume_weekly": 76.0,
                "margin_pct": 35.0,
                "linear_space_ft": 1.0,
                "is_private_brand": False,
                "status_badge": "MAINTAIN",
            },
            {
                "sku_code": "SKU-1014",
                "product_name": "Clover Valley Choc Chip Cookies 13oz",
                "sub_category": "Cookies",
                "sales_volume_weekly": 88.0,
                "margin_pct": 41.0,
                "linear_space_ft": 1.5,
                "is_private_brand": True,
                "status_badge": "MAINTAIN",
            },
            {
                "sku_code": "SKU-1015",
                "product_name": "Oreo Sandwich Cookies 14.3oz",
                "sub_category": "Cookies",
                "sales_volume_weekly": 130.0,
                "margin_pct": 30.0,
                "linear_space_ft": 2.0,
                "is_private_brand": False,
                "status_badge": "MAINTAIN",
            },
            {
                "sku_code": "SKU-1016",
                "product_name": "Old Style Corn Chips 10oz",
                "sub_category": "Salty Snacks",
                "sales_volume_weekly": 22.0,
                "margin_pct": 21.0,
                "linear_space_ft": 1.0,
                "is_private_brand": False,
                "status_badge": "SWAP",
            },
            {
                "sku_code": "SKU-1017",
                "product_name": "Clover Valley Pretzels 16oz",
                "sub_category": "Salty Snacks",
                "sales_volume_weekly": 95.0,
                "margin_pct": 45.0,
                "linear_space_ft": 1.5,
                "is_private_brand": True,
                "status_badge": "MAINTAIN",
            },
        ]
        for item in skus_data:
            db.add(SKU(**item))
        db.commit()

    # Seed Scenario Models if empty
    if db.query(ScenarioModel).count() == 0:
        scenarios_data = [
            {
                "scenario_name": "Conservative",
                "projected_sales_lift_pct": 2.1,
                "projected_private_brand_pct": 27.2,
                "shelf_capacity_impact_pct": 91.5,
            },
            {
                "scenario_name": "Balanced",
                "projected_sales_lift_pct": 4.5,
                "projected_private_brand_pct": 29.1,
                "shelf_capacity_impact_pct": 94.0,
            },
            {
                "scenario_name": "Aggressive",
                "projected_sales_lift_pct": 7.8,
                "projected_private_brand_pct": 32.5,
                "shelf_capacity_impact_pct": 98.2,
            },
        ]
        for item in scenarios_data:
            db.add(ScenarioModel(**item))
        db.commit()

    # Seed Guardrail Rules if empty
    if db.query(GuardrailRule).count() == 0:
        guardrails_data = [
            {
                "rule_name": "MIN_PRIVATE_BRAND_SHARE",
                "metric_key": "private_brand_mix_pct",
                "operator": ">=",
                "threshold_value": 25.0,
                "is_active": True,
            },
            {
                "rule_name": "MAX_SHELF_CAPACITY",
                "metric_key": "shelf_capacity_impact_pct",
                "operator": "<=",
                "threshold_value": 100.0,
                "is_active": True,
            },
            {
                "rule_name": "MIN_IN_STOCK_IMPACT",
                "metric_key": "in_stock_rate_pct",
                "operator": ">=",
                "threshold_value": 95.0,
                "is_active": True,
            },
        ]
        for item in guardrails_data:
            db.add(GuardrailRule(**item))
        db.commit()
