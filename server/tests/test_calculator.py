import pytest
from starlette.testclient import TestClient
from server.services.calculator import (
    CalculatorService,
    DivisionByZeroError,
    InvalidSyntaxError,
)


def test_health_check(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_basic_addition(client: TestClient):
    response = client.post("/api/v1/calculate", json={"expression": "12 + 8"})
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 20.0
    assert data["expression"] == "12 + 8"
    assert data["status"] == "success"
    assert "timestamp" in data


def test_basic_subtraction(client: TestClient):
    response = client.post("/api/v1/calculate", json={"expression": "50 - 15"})
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 35.0
    assert data["status"] == "success"


def test_basic_multiplication(client: TestClient):
    response = client.post("/api/v1/calculate", json={"expression": "6 * 7"})
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 42.0
    assert data["status"] == "success"


def test_basic_division(client: TestClient):
    response = client.post("/api/v1/calculate", json={"expression": "50 / 2"})
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 25.0
    assert data["status"] == "success"


def test_modulo_operation(client: TestClient):
    response = client.post("/api/v1/calculate", json={"expression": "10 % 3"})
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 1.0
    assert data["status"] == "success"


def test_floating_point_precision(client: TestClient):
    response = client.post("/api/v1/calculate", json={"expression": "0.1 + 0.2"})
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 0.3


def test_decimal_arithmetic(client: TestClient):
    response = client.post("/api/v1/calculate", json={"expression": "12.5 * 2.5"})
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 31.25


def test_negative_numbers_and_precedence(client: TestClient):
    response = client.post("/api/v1/calculate", json={"expression": "-5 + 10 * 2"})
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 15.0


def test_parentheses_expression(client: TestClient):
    response = client.post("/api/v1/calculate", json={"expression": "(2 + 3) * 4"})
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 20.0


def test_unicode_operator_symbols(client: TestClient):
    response_mul = client.post("/api/v1/calculate", json={"expression": "12 × 3"})
    assert response_mul.status_code == 200
    assert response_mul.json()["result"] == 36.0

    response_div = client.post("/api/v1/calculate", json={"expression": "10 ÷ 2"})
    assert response_div.status_code == 200
    assert response_div.json()["result"] == 5.0

    response_sub = client.post("/api/v1/calculate", json={"expression": "15 − 5"})
    assert response_sub.status_code == 200
    assert response_sub.json()["result"] == 10.0


def test_division_by_zero(client: TestClient):
    response = client.post("/api/v1/calculate", json={"expression": "10 / 0"})
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "Cannot divide by zero"
    assert data["error_code"] == "DIVISION_BY_ZERO"


def test_modulo_by_zero(client: TestClient):
    response = client.post("/api/v1/calculate", json={"expression": "10 % 0"})
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "Cannot divide by zero"
    assert data["error_code"] == "DIVISION_BY_ZERO"


def test_invalid_syntax_characters(client: TestClient):
    response = client.post("/api/v1/calculate", json={"expression": "abc + 12"})
    assert response.status_code == 422
    data = response.json()
    assert data["error_code"] == "INVALID_SYNTAX"


def test_invalid_syntax_operators(client: TestClient):
    response = client.post("/api/v1/calculate", json={"expression": "10 +* 5"})
    assert response.status_code == 422
    data = response.json()
    assert data["error_code"] == "INVALID_SYNTAX"


def test_empty_expression(client: TestClient):
    response = client.post("/api/v1/calculate", json={"expression": "   "})
    assert response.status_code == 422
    data = response.json()
    assert data["error_code"] == "INVALID_SYNTAX"


def test_service_unit_tests():
    svc = CalculatorService()
    assert svc.evaluate("100 / 4") == 25.0
    assert svc.evaluate("0.1 + 0.2") == 0.3

    with pytest.raises(DivisionByZeroError):
        svc.evaluate("5 / 0")

    with pytest.raises(InvalidSyntaxError):
        svc.evaluate("import os")

    with pytest.raises(InvalidSyntaxError):
        svc.evaluate("")
