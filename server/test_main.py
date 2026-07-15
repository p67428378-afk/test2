import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app

# Setup in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "DG Cluster Assortment Advisor" in response.json()["message"]


def test_get_kpis():
    # First request triggers startup event or we can just call the endpoint
    # Since we drop/create tables per test, let's verify the response
    response = client.get("/api/v1/kpis/snacks/small-town-value")
    assert response.status_code == 200
    data = response.json()
    assert "sales_per_linear_ft" in data
    assert "private_brand_percentage" in data
    assert "in_stock_rate" in data
    assert "shelf_capacity_percentage" in data


def test_get_sku_performance():
    response = client.get(
        "/api/v1/skus/performance?category=snacks&cluster=small-town-value"
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        first_sku = data[0]
        assert "sku_id" in first_sku
        assert "sku_number" in first_sku
        assert "product_name" in first_sku
        assert "scenarios" in first_sku
        assert "Balanced" in first_sku["scenarios"]


def test_get_sku_performance_invalid():
    response = client.get(
        "/api/v1/skus/performance?category=invalid&cluster=small-town-value"
    )
    assert response.status_code == 400


def test_submit_assortment_guardrail_violation():
    # Get SKUs first to get valid UUIDs
    response = client.get(
        "/api/v1/skus/performance?category=snacks&cluster=small-town-value"
    )
    skus = response.json()

    # Create a payload that reduces/swaps all private brand SKUs to trigger guardrail violation (< 20%)
    sku_actions = []
    for sku in skus:
        if sku["is_private_brand"]:
            sku_actions.append({"sku_id": sku["sku_id"], "action": "SWAP"})
        else:
            sku_actions.append({"sku_id": sku["sku_id"], "action": "GROW"})

    payload = {"scenario_selected": "Aggressive", "sku_actions": sku_actions}

    response = client.post("/api/v1/assortment/submit", json=payload)
    assert response.status_code == 400
    assert "Guardrail violation" in response.json()["detail"]


def test_submit_assortment_success():
    response = client.get(
        "/api/v1/skus/performance?category=snacks&cluster=small-town-value"
    )
    skus = response.json()

    # Maintain or grow private brands to keep PB % high
    sku_actions = []
    for sku in skus:
        if sku["is_private_brand"]:
            sku_actions.append({"sku_id": sku["sku_id"], "action": "GROW"})
        else:
            sku_actions.append({"sku_id": sku["sku_id"], "action": "REDUCE"})

    payload = {"scenario_selected": "Balanced", "sku_actions": sku_actions}

    response = client.post("/api/v1/assortment/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "submission_id" in data
    assert "audit_trail_summary" in data
