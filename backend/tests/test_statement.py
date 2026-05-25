
import pytest
from fastapi.testclient import TestClient
from datetime import date
from backend.app.models.transaction import Transaction
from backend.app.services.statement_service import populate_db

@pytest.fixture(autouse=True)
def setup_db(db_session):
    populate_db(db_session)

def test_generate_statement_success(test_client):
    response = test_client.post("/statements/", json={
        "account_number": "1234567890",
        "start_date": "2023-01-01",
        "end_date": "2023-01-31",
        "format": "pdf"
    })
    assert response.status_code == 200
    assert response.headers['content-type'] == 'application/pdf'

def test_generate_statement_invalid_date_range(test_client):
    response = test_client.post("/statements/", json={
        "account_number": "1234567890",
        "start_date": "2023-02-01",
        "end_date": "2023-01-31",
        "format": "pdf"
    })
    assert response.status_code == 400

def test_generate_statement_excel_success(test_client):
    response = test_client.post("/statements/", json={
        "account_number": "1234567890",
        "start_date": "2023-01-01",
        "end_date": "2023-01-31",
        "format": "excel"
    })
    assert response.status_code == 200
    assert response.headers['content-type'] == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

def test_generate_statement_no_transactions(test_client):
    response = test_client.post("/statements/", json={
        "account_number": "0987654321",
        "start_date": "2023-01-01",
        "end_date": "2023-01-31",
        "format": "pdf"
    })
    assert response.status_code == 200
    # Even with no transactions, a statement should be generated
    assert response.headers['content-type'] == 'application/pdf'
