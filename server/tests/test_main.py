from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the MathFlow Calculator API"}

def test_calculate_addition():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 5, "operator": "+"}
    )
    assert response.status_code == 200
    assert response.json() == {"result": 15.0}

def test_calculate_subtraction():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 5, "operator": "-"}
    )
    assert response.status_code == 200
    assert response.json() == {"result": 5.0}

def test_calculate_multiplication():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 5, "operator": "*"}
    )
    assert response.status_code == 200
    assert response.json() == {"result": 50.0}

def test_calculate_division():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 5, "operator": "/"}
    )
    assert response.status_code == 200
    assert response.json() == {"result": 2.0}

def test_calculate_division_by_zero():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 0, "operator": "/"}
    )
    assert response.status_code == 400
    assert "Division by zero" in response.json()["detail"]

def test_calculate_invalid_operator():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 5, "operator": "%"}
    )
    # Pydantic Literal validation will fail with 422 Unprocessable Entity
    assert response.status_code == 422
