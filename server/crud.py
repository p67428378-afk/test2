from sqlalchemy.orm import Session
from server import models, schemas
import uuid
from datetime import date, datetime
from typing import Optional, List

def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()

def get_user_by_mobile_number(db: Session, mobile_number: str):
    return db.query(models.User).filter(models.User.mobile_number == mobile_number).first()

def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at)
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp

def get_otp(db: Session, otp_session_id: str):
    return db.query(models.OTP).filter(models.OTP.id == otp_session_id).first()

def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True
    db.commit()
    db.refresh(otp)
    return otp

def create_password_history(db: Session, user_id: str, hashed_password: str):
    db_password_history = models.PasswordHistory(user_id=user_id, hashed_password=hashed_password)
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history

def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user


# --- Assortment Advisor CRUD Operations ---

def seed_data(db: Session):
    # Check if products already exist
    if db.query(models.Product).first() is not None:
        return

    # 1. Seed Products
    products_data = [
        {"sku": "SKU-1001", "name": "Clover Valley Potato Chips", "brand": "Clover Valley", "category": "Snacks", "is_private_brand": True},
        {"sku": "SKU-1002", "name": "Lay's Classic Potato Chips", "brand": "Lay's", "category": "Snacks", "is_private_brand": False},
        {"sku": "SKU-1003", "name": "Clover Valley Cheese Curls", "brand": "Clover Valley", "category": "Snacks", "is_private_brand": True},
        {"sku": "SKU-1004", "name": "Doritos Nacho Cheese", "brand": "Doritos", "category": "Snacks", "is_private_brand": False},
        {"sku": "SKU-1005", "name": "Clover Valley Pretzels", "brand": "Clover Valley", "category": "Snacks", "is_private_brand": True},
        {"sku": "SKU-1006", "name": "Pringles Sour Cream & Onion", "brand": "Pringles", "category": "Snacks", "is_private_brand": False},
    ]
    for p in products_data:
        db.add(models.Product(**p))

    # 2. Seed Store
    store = models.Store(name="Small Town Value Store #1", cluster="Small Town Value Cluster")
    db.add(store)
    db.flush()  # Get store_id

    # 3. Seed Sales
    sales_data = [
        {"sku": "SKU-1001", "store_id": store.store_id, "date": date(2026, 6, 1), "units_sold": 5000, "price": 2.50, "sales_amount": 12500.50},
        {"sku": "SKU-1002", "store_id": store.store_id, "date": date(2026, 6, 1), "units_sold": 6100, "price": 2.98, "sales_amount": 18200.00},
        {"sku": "SKU-1003", "store_id": store.store_id, "date": date(2026, 6, 1), "units_sold": 1800, "price": 2.29, "sales_amount": 4120.00},
        {"sku": "SKU-1004", "store_id": store.store_id, "date": date(2026, 6, 1), "units_sold": 4800, "price": 3.02, "sales_amount": 14500.00},
        {"sku": "SKU-1005", "store_id": store.store_id, "date": date(2026, 6, 1), "units_sold": 950, "price": 2.21, "sales_amount": 2100.00},
        {"sku": "SKU-1006", "store_id": store.store_id, "date": date(2026, 6, 1), "units_sold": 3200, "price": 2.78, "sales_amount": 8900.00},
    ]
    for s in sales_data:
        db.add(models.Sales(**s))

    # 4. Seed Inventory
    inventory_data = [
        {"sku": "SKU-1001", "store_id": store.store_id, "stock_on_hand": 200, "shelf_capacity": 500, "in_stock_rate": 94.2},
        {"sku": "SKU-1002", "store_id": store.store_id, "stock_on_hand": 150, "shelf_capacity": 400, "in_stock_rate": 95.0},
        {"sku": "SKU-1003", "store_id": store.store_id, "stock_on_hand": 100, "shelf_capacity": 300, "in_stock_rate": 93.5},
        {"sku": "SKU-1004", "store_id": store.store_id, "stock_on_hand": 120, "shelf_capacity": 350, "in_stock_rate": 96.0},
        {"sku": "SKU-1005", "store_id": store.store_id, "stock_on_hand": 80, "shelf_capacity": 200, "in_stock_rate": 91.0},
        {"sku": "SKU-1006", "store_id": store.store_id, "stock_on_hand": 90, "shelf_capacity": 250, "in_stock_rate": 92.5},
    ]
    for i in inventory_data:
        db.add(models.Inventory(**i))

    # 5. Seed Scenarios
    scenarios_data = [
        {
            "name": "Conservative",
            "description": "Focus on low-risk, high-margin SKUs with minimal changes.",
            "projected_sales": 14.50,
            "projected_pb_percentage": 21.00,
            "projected_in_stock_rate": 96.00,
            "projected_shelf_capacity": 75.00,
            "actions": {
                "SKU-1001": "MAINTAIN",
                "SKU-1002": "MAINTAIN",
                "SKU-1003": "MAINTAIN",
                "SKU-1004": "MAINTAIN",
                "SKU-1005": "REDUCE",
                "SKU-1006": "MAINTAIN",
            }
        },
        {
            "name": "Balanced",
            "description": "Balance sales performance, shelf space, and private brand goals.",
            "projected_sales": 16.10,
            "projected_pb_percentage": 22.40,
            "projected_in_stock_rate": 96.50,
            "projected_shelf_capacity": 87.00,
            "actions": {
                "SKU-1001": "GROW",
                "SKU-1002": "MAINTAIN",
                "SKU-1003": "GROW",
                "SKU-1004": "MAINTAIN",
                "SKU-1005": "REDUCE",
                "SKU-1006": "SWAP",
            }
        },
        {
            "name": "Aggressive",
            "description": "Maximize private brand penetration and sales growth with higher churn.",
            "projected_sales": 18.20,
            "projected_pb_percentage": 25.50,
            "projected_in_stock_rate": 93.00,
            "projected_shelf_capacity": 94.00,
            "actions": {
                "SKU-1001": "GROW",
                "SKU-1002": "SWAP",
                "SKU-1003": "GROW",
                "SKU-1004": "SWAP",
                "SKU-1005": "REDUCE",
                "SKU-1006": "SWAP",
            }
        }
    ]

    for s_data in scenarios_data:
        scen = models.Scenario(
            name=s_data["name"],
            description=s_data["description"],
            projected_sales=s_data["projected_sales"],
            projected_pb_percentage=s_data["projected_pb_percentage"],
            projected_in_stock_rate=s_data["projected_in_stock_rate"],
            projected_shelf_capacity=s_data["projected_shelf_capacity"]
        )
        db.add(scen)
        db.flush()  # Get scen.id

        for sku, action in s_data["actions"].items():
            db.add(models.ScenarioAction(
                scenario_id=scen.id,
                sku=sku,
                action=action
            ))

    db.commit()

def get_kpis(db: Session) -> schemas.KPIResponse:
    # Ensure data is seeded
    seed_data(db)
    return schemas.KPIResponse(
        sales_per_linear_ft=schemas.KPIMetric(value=15.75, change_percentage=4.2, trend="up"),
        private_brand_percentage=schemas.KPIMetric(value=18.5, change_percentage=-1.2, trend="down"),
        in_stock_rate=schemas.KPIMetric(value=94.2, change_percentage=0.5, trend="up"),
        shelf_capacity=schemas.KPIMetric(value=82.0, change_percentage=0.0, trend="stable")
    )

def get_skus(db: Session, sort_by: Optional[str] = None, sort_order: Optional[str] = None, status: Optional[str] = None) -> List[schemas.SKUResponse]:
    # Ensure data is seeded
    seed_data(db)

    # Static list of SKUs with their metrics as defined in the requirements
    skus_list = [
        schemas.SKUResponse(sku="SKU-1001", name="Clover Valley Potato Chips", brand="Clover Valley", is_private_brand=True, sales=12500.50, profit_margin=35.2, units_sold=5000, days_of_supply=12, status="GROW"),
        schemas.SKUResponse(sku="SKU-1002", name="Lay's Classic Potato Chips", brand="Lay's", is_private_brand=False, sales=18200.00, profit_margin=24.0, units_sold=6100, days_of_supply=8, status="MAINTAIN"),
        schemas.SKUResponse(sku="SKU-1003", name="Clover Valley Cheese Curls", brand="Clover Valley", is_private_brand=True, sales=4120.00, profit_margin=35.0, units_sold=1800, days_of_supply=24, status="GROW"),
        schemas.SKUResponse(sku="SKU-1004", name="Doritos Nacho Cheese", brand="Doritos", is_private_brand=False, sales=14500.00, profit_margin=22.5, units_sold=4800, days_of_supply=6, status="MAINTAIN"),
        schemas.SKUResponse(sku="SKU-1005", name="Clover Valley Pretzels", brand="Clover Valley", is_private_brand=True, sales=2100.00, profit_margin=18.0, units_sold=950, days_of_supply=45, status="REDUCE"),
        schemas.SKUResponse(sku="SKU-1006", name="Pringles Sour Cream & Onion", brand="Pringles", is_private_brand=False, sales=8900.00, profit_margin=21.0, units_sold=3200, days_of_supply=14, status="SWAP"),
    ]

    # Filter by status
    if status:
        skus_list = [s for s in skus_list if s.status.upper() == status.upper()]

    # Sort
    if sort_by:
        reverse = True if sort_order and sort_order.lower() == "desc" else False
        
        def get_sort_key(item):
            val = getattr(item, sort_by, None)
            if val is None:
                return ""
            if isinstance(val, str):
                return val.lower()
            return val

        skus_list.sort(key=get_sort_key, reverse=reverse)

    return skus_list

def get_scenarios(db: Session) -> List[schemas.ScenarioResponse]:
    # Ensure data is seeded
    seed_data(db)

    scenarios = db.query(models.Scenario).all()
    response_list = []
    for s in scenarios:
        # Get actions
        actions = db.query(models.ScenarioAction).filter(models.ScenarioAction.scenario_id == s.id).all()
        sku_actions = [schemas.SKUAction(sku=a.sku, action=a.action) for a in actions]

        # Guardrails
        pb_passed = float(s.projected_pb_percentage) >= 20.0
        capacity_passed = float(s.projected_shelf_capacity) <= 90.0

        response_list.append(schemas.ScenarioResponse(
            id=str(s.id),
            name=s.name,
            description=s.description,
            projected_sales=float(s.projected_sales),
            projected_pb_percentage=float(s.projected_pb_percentage),
            projected_in_stock_rate=float(s.projected_in_stock_rate),
            projected_shelf_capacity=float(s.projected_shelf_capacity),
            guardrails=schemas.Guardrails(
                private_brand_target_passed=pb_passed,
                shelf_capacity_passed=capacity_passed
            ),
            sku_actions=sku_actions
        ))
    return response_list

def submit_scenario(db: Session, request: schemas.SubmitScenarioRequest) -> Optional[models.Submission]:
    # Ensure data is seeded
    seed_data(db)

    # Find scenario
    try:
        scen_uuid = uuid.UUID(request.scenario_id)
        scenario = db.query(models.Scenario).filter(models.Scenario.id == scen_uuid).first()
    except ValueError:
        scenario = db.query(models.Scenario).filter(models.Scenario.name.ilike(request.scenario_id)).first()

    if not scenario:
        return None

    # Check guardrails
    pb_passed = float(scenario.projected_pb_percentage) >= 20.0
    capacity_passed = float(scenario.projected_shelf_capacity) <= 90.0

    if not (pb_passed and capacity_passed) and not request.acknowledge_violations:
        raise ValueError("Guardrail violations not acknowledged")

    # Create submission
    audit_id = f"AUDIT-{uuid.uuid4().hex[:8].upper()}"
    status = "APPROVED" if (pb_passed and capacity_passed) else "PENDING_ACKNOWLEDGED"

    db_submission = models.Submission(
        scenario_id=scenario.id,
        submitted_by=request.submitted_by,
        audit_id=audit_id,
        status=status
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission
