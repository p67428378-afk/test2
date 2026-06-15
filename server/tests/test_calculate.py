import pytest
from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_calculate_post_add():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 5, "operator": "+"}
    )
    assert response.status_code == 200
    assert response.json() == {"result": 15.0}

def test_calculate_post_subtract():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 5, "operator": "-"}
    )
    assert response.status_code == 200
    assert response.json() == {"result": 5.0}

def test_calculate_post_multiply():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 5, "operator": "*"}
    )
    assert response.status_code == 200
    assert response.json() == {"result": 50.0}

def test_calculate_post_divide():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 5, "operator": "/"}
    )
    assert response.status_code == 200
    assert response.json() == {"result": 2.0}

def test_calculate_post_divide_by_zero():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 0, "operator": "/"}
    )
    assert response.status_code == 400
    assert "detail" in response.json()

def test_calculate_post_invalid_operator():
    response = client.post(
        "/api/v1/calculate",
        json={"operand1": 10, "operand2": 5, "operator": "invalid"}
    )
    assert response.status_code == 422

def test_calculate_get_add():
    response = client.get(
        "/api/v1/calculate",
        params={"operand1": 10, "operand2": 5, "operator": "+"}
    )
    assert response.status_code == 200
    assert response.json() == {"result": 15.0}

def test_calculate_get_subtract():
    response = client.get(
        "/api/v1/calculate",
        params={"operand1": 10, "operand2": 5, "operator": "-"}
    )
    assert response.status_code == 200
    assert response.json() == {"result": 5.0}

def test_calculate_get_multiply():
    response = client.get(
        "/api/v1/calculate",
        params={"operand1": 10, "operand2": 5, "operator": "*"}
    )
    assert response.status_code == 200
    assert response.json() == {"result": 50.0}

def test_calculate_get_divide():
    response = client.get(
        "/api/v1/calculate",
        params={"operand1": 10, "operand2": 5, "operator": "/"}
    )
    assert response.status_code == 200
    assert response.json() == {"result": 2.0}

def test_calculate_get_divide_by_zero():
    response = client.get(
        "/api/v1/calculate",
        params={"operand1": 10, "operand2": 0, "operator": "/"}
    )
    assert response.status_code == 400
    assert "detail" in response.json()

def test_calculate_get_invalid_operator():
    response = client.get(
        "/api/v1/calculate",
        params={"operand1": 10, "operand2": 5, "operator": "invalid"}
    )
    assert response.status_code == 400
    assert "detail" in response.json()
