from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from server import crud, schemas


def test_read_inventory_items(client: TestClient, db: Session):
    snack = crud.create_snack(db, schemas.SnackCreate(name="test_snack"))
    crud.create_inventory_item(
        db, schemas.InventoryItemCreate(snack_id=snack.id, quantity=10, location="A1")
    )
    response = client.get("/api/v1/inventory/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["quantity"] == 10


def test_update_inventory_item(client: TestClient, db: Session):
    snack = crud.create_snack(db, schemas.SnackCreate(name="test_snack_2"))
    item = crud.create_inventory_item(
        db, schemas.InventoryItemCreate(snack_id=snack.id, quantity=10, location="A1")
    )
    response = client.put(f"/api/v1/inventory/{item.id}", json={"quantity": 5})
    assert response.status_code == 200
    data = response.json()
    assert data["quantity"] == 5


def test_consume_inventory_item(client: TestClient, db: Session):
    snack = crud.create_snack(db, schemas.SnackCreate(name="test_snack_3"))
    item = crud.create_inventory_item(
        db, schemas.InventoryItemCreate(snack_id=snack.id, quantity=10, location="A1")
    )
    response = client.put(
        f"/api/v1/inventory/{item.id}/consume", json={"quantity_consumed": 3}
    )
    assert response.status_code == 200
    db.refresh(item)
    assert item.quantity == 7
