from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from server import crud, schemas


def test_request_snack(client: TestClient, db: Session):
    response = client.post(
        "/api/v1/snacks/", json={"snack_name": "chips", "quantity": 1}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["snack_name"] == "chips"
    assert data["quantity"] == 1


def test_read_snacks(client: TestClient, db: Session):
    crud.create_snack(db, schemas.SnackCreate(name="test_snack_4"))
    response = client.get("/api/v1/snacks/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["name"] == "test_snack_4"
