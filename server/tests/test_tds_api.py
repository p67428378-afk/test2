
from fastapi.testclient import TestClient
from server.main import app
from server.database import get_db, TestingSessionLocal
from server.models.tds_configuration import TDSConfiguration
from datetime import datetime
import uuid

client = TestClient(app)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

def test_read_tds_configurations():
    response = client.get("/api/v1/tds/configurations")
    assert response.status_code == 200
    data = response.json()
    assert "configurations" in data

def test_update_tds_configuration():
    # Create a dummy config to update
    db = TestingSessionLocal()
    customer_category = f"Test-{uuid.uuid4()}"
    config = TDSConfiguration(
        customer_category=customer_category,
        min_interest_threshold=10000,
        tds_rate=10,
        effective_date=datetime.now()
    )
    db.add(config)
    db.commit()
    db.refresh(config)
    config_id = config.id

    update_data = {
        "min_interest_threshold": 12000,
        "tds_rate": 12,
        "effective_date": datetime.now().isoformat(),
    }
    response = client.put(f"/api/v1/tds/configurations/{config_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["min_interest_threshold"] == 12000
    assert data["tds_rate"] == 12

    # Clean up the created config
    db.delete(config)
    db.commit()
    db.close()
