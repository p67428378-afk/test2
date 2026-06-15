import pytest
from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_calculate_addition():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 12.0, "operand2": 3.0, "operator": "+"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["operand1"] == 12.0
    assert data["operand2"] == 3.0
    assert data["operator"] == "+"
    assert data["result"] == 15.0
    assert data["error"] is None

def test_calculate_subtraction():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 12.0, "operand2": 3.0, "operator": "-"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["operand1"] == 12.0
    assert data["operand2"] == 3.0
    assert data["operator"] == "-"
    assert data["result"] == 9.0
    assert data["error"] is None

def test_calculate_multiplication():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 12.0, "operand2": 3.0, "operator": "*"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["operand1"] == 12.0
    assert data["operand2"] == 3.0
    assert data["operator"] == "*"
    assert data["result"] == 36.0
    assert data["error"] is None

def test_calculate_division():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 12.0, "operand2": 3.0, "operator": "/"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["operand1"] == 12.0
    assert data["operand2"] == 3.0
    assert data["operator"] == "/"
    assert data["result"] == 4.0
    assert data["error"] is None

def test_calculate_division_by_zero():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 12.0, "operand2": 0.0, "operator": "/"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Division by zero"

def test_calculate_invalid_operator():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 12.0, "operand2": 3.0, "operator": "%"},
    )
    assert response.status_code == 422  # Pydantic validation error
