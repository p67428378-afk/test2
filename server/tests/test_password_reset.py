import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from server.database import Base, get_db
from server.main import app

# Setup SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite://"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override get_db dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    # Create tables and seed data
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    from server.database import seed_data

    seed_data(db)
    db.close()
    yield
    # Do not drop tables to avoid locking issues, SQLite in-memory is discarded anyway


client = TestClient(app)


def test_get_kpis():
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "sales_per_linear_ft" in data
    assert data["sales_per_linear_ft"] == 15.75
    assert data["private_brand_percentage"] == 22.5


def test_get_skus():
    response = client.get("/api/v1/skus")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
    assert data[0]["name"] == "Clover Valley Potato Chips 10oz"


def test_get_skus_filtered():
    response = client.get("/api/v1/skus?status=GROW")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    for item in data:
        assert item["status"] == "GROW"


def test_get_skus_invalid_filter():
    response = client.get("/api/v1/skus?status=INVALID")
    assert response.status_code == 400


def test_calculate_scenario_balanced():
    response = client.post(
        "/api/v1/scenarios/calculate", json={"scenario_name": "Balanced"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "Balanced"
    assert data["projected_sales_lift"] == 4.2
    assert len(data["guardrails"]) == 2
    assert data["guardrails"][0]["status"] == "PASSED"


def test_calculate_scenario_invalid():
    response = client.post(
        "/api/v1/scenarios/calculate", json={"scenario_name": "Invalid"}
    )
    assert response.status_code == 400


def test_submit_assortment_review():
    response = client.post(
        "/api/v1/assortment-reviews", json={"scenario_name": "Balanced"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["scenario_name"] == "Balanced"
    assert data["status"] == "SUBMITTED"
    assert "audit_trail_summary" in data
    assert "submission_id" in data["audit_trail_summary"]


def test_submit_assortment_review_invalid():
    response = client.post(
        "/api/v1/assortment-reviews", json={"scenario_name": "Aggressive"}
    )
    assert response.status_code == 400
