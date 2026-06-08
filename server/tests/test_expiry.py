from datetime import datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from server import crud, schemas


def test_read_expiry_alerts(client: TestClient, db: Session):
    snack = crud.create_snack(db, schemas.SnackCreate(name="test_snack_5"))
    expiry_date = datetime.utcnow() + timedelta(days=3)
    crud.create_inventory_item(
        db,
        schemas.InventoryItemCreate(
            snack_id=snack.id, quantity=10, location="A1", expiry_date=expiry_date
        ),
    )
    response = client.get("/api/v1/expiry-alerts/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["snack_name"] == "test_snack_5"
    assert data[0]["alert_status"] == "critical"
