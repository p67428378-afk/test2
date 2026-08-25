from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from server.models import User, Warehouse, Item, Inventory
from server.core.security import get_password_hash

_SEED_USERS = [
    {
        "email": "test@example.com",
        "password": "testpassword",
        "full_name": "Test User",
        "role": "staff",
    },
    {
        "email": "admin@example.com",
        "password": "adminpassword",
        "full_name": "Admin User",
        "role": "admin",
    },
]

_SEED_WAREHOUSES = [
    {"name": "Warehouse A", "location": "New York, NY"},
    {"name": "Warehouse B", "location": "San Francisco, CA"},
]

_SEED_ITEMS = [
    {
        "sku": "SKU-9901",
        "name": "Wireless Mouse",
        "description": "Ergonomic wireless mouse",
        "category": "Electronics",
        "unit_price": 25.0,
        "reorder_threshold": 10,
    },
    {
        "sku": "SKU-9902",
        "name": "Mechanical Keyboard",
        "description": "RGB mechanical keyboard",
        "category": "Electronics",
        "unit_price": 80.0,
        "reorder_threshold": 5,
    },
    {
        "sku": "SKU-9903",
        "name": "Office Chair",
        "description": "Comfortable office chair",
        "category": "Furniture",
        "unit_price": 150.0,
        "reorder_threshold": 3,
    },
]


def seed_data(db: Session):
    # 1. Seed Users
    for u in _SEED_USERS:
        if db.query(User).filter(User.email == u["email"]).first():
            continue
        db_user = User(
            email=u["email"],
            hashed_password=get_password_hash(u["password"]),
            full_name=u["full_name"],
            role=u["role"],
            is_active=True,
        )
        db.add(db_user)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()

    # 2. Seed Warehouses
    warehouses = []
    for w in _SEED_WAREHOUSES:
        db_wh = db.query(Warehouse).filter(Warehouse.name == w["name"]).first()
        if not db_wh:
            db_wh = Warehouse(name=w["name"], location=w["location"])
            db.add(db_wh)
            try:
                db.commit()
                db.refresh(db_wh)
            except IntegrityError:
                db.rollback()
                db_wh = db.query(Warehouse).filter(Warehouse.name == w["name"]).first()
        warehouses.append(db_wh)

    # 3. Seed Items
    items = []
    for i in _SEED_ITEMS:
        db_item = db.query(Item).filter(Item.sku == i["sku"]).first()
        if not db_item:
            db_item = Item(
                sku=i["sku"],
                name=i["name"],
                description=i["description"],
                category=i["category"],
                unit_price=i["unit_price"],
                reorder_threshold=i["reorder_threshold"],
            )
            db.add(db_item)
            try:
                db.commit()
                db.refresh(db_item)
            except IntegrityError:
                db.rollback()
                db_item = db.query(Item).filter(Item.sku == i["sku"]).first()
        items.append(db_item)

    # 4. Seed Inventory (Initial stock levels)
    for item in items:
        for wh in warehouses:
            existing_inv = (
                db.query(Inventory)
                .filter(Inventory.item_id == item.id, Inventory.warehouse_id == wh.id)
                .first()
            )
            if not existing_inv:
                # Seed some initial stock
                stock = (
                    15
                    if item.sku == "SKU-9901"
                    else (4 if item.sku == "SKU-9902" else 8)
                )
                db_inv = Inventory(
                    item_id=item.id, warehouse_id=wh.id, current_stock=stock
                )
                db.add(db_inv)
                try:
                    db.commit()
                except IntegrityError:
                    db.rollback()
