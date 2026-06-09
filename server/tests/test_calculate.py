import pytest
import time
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server import models

# Use the same database URL as test_password_reset.py to avoid conflicts
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Override get_db globally
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_db():
    # Clear calculations table before each test
    db = TestingSessionLocal()
    try:
        db.query(models.Calculation).delete()
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()
    yield

def test_calculate_add():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 5, "operator": "add"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["operand1"] == 10
    assert data["operand2"] == 5
    assert data["operator"] == "add"
    assert data["result"] == 15
    assert data["formula"] == "10 + 5"
    assert data["status"] == "success"
    assert "id" in data
    assert "created_at" in data

def test_calculate_subtract():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 5, "operator": "subtract"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 5
    assert data["formula"] == "10 - 5"

def test_calculate_multiply():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 5, "operator": "multiply"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 50
    assert data["formula"] == "10 * 5"

def test_calculate_divide():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 5, "operator": "divide"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 2
    assert data["formula"] == "10 / 5"

def test_calculate_divide_by_zero():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 0, "operator": "divide"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Cannot divide by zero"

    # Verify it was saved to the database as an error
    history_response = client.get("/api/v1/calculations")
    assert history_response.status_code == 200
    history = history_response.json()
    assert len(history) == 1
    assert history[0]["operand1"] == 10
    assert history[0]["operand2"] == 0
    assert history[0]["operator"] == "divide"
    assert history[0]["result"] is None
    assert history[0]["formula"] == "10 / 0"
    assert history[0]["status"] == "error"

def test_get_calculations_history():
    # Perform two calculations with a delay to ensure different timestamps
    client.post("/api/v1/calculate", json={"operand1": 10, "operand2": 5, "operator": "add"})
    time.sleep(1)
    client.post("/api/v1/calculate", json={"operand1": 20, "operand2": 4, "operator": "divide"})

    response = client.get("/api/v1/calculations")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    # Ordered by created_at desc
    assert data[0]["formula"] == "20 / 4"
    assert data[0]["result"] == 5
    assert data[1]["formula"] == "10 + 5"
    assert data[1]["result"] == 15

def test_clear_calculations_history():
    # Perform a calculation
    client.post("/api/v1/calculate", json={"operand1": 10, "operand2": 5, "operator": "add"})

    # Verify history is not empty
    response = client.get("/api/v1/calculations")
    assert len(response.json()) == 1

    # Clear history
    clear_response = client.delete("/api/v1/calculations")
    assert clear_response.status_code == 200
    assert clear_response.json() == {"message": "Calculation history cleared successfully"}

    # Verify history is empty
    response = client.get("/api/v1/calculations")
    assert len(response.json()) == 0
