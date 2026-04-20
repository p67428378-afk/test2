from fastapi.testclient import TestClient

def test_generate_statement(client: TestClient):
    response = client.post(
        "/statements/",
        json={"account_number": "1234567890", "start_date": "2023-01-01", "end_date": "2023-01-31"},
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"

def test_generate_statement_excel(client: TestClient):
    response = client.post(
        "/statements/",
        json={"account_number": "1234567890", "start_date": "2023-01-01", "end_date": "2023-01-31", "format": "excel"},
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

def test_invalid_account_number(client: TestClient):
    response = client.post(
        "/statements/",
        json={"account_number": "invalid", "start_date": "2023-01-01", "end_date": "2023-01-31"},
    )
    assert response.status_code == 422

def test_invalid_date_range(client: TestClient):
    response = client.post(
        "/statements/",
        json={"account_number": "1234567890", "start_date": "2023-01-31", "end_date": "2023-01-01"},
    )
    assert response.status_code == 400
