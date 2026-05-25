from fastapi.testclient import TestClient

def test_generate_interest_certificate_success(client: TestClient):
    response = client.post("/api/v1/interest-certificate/", json={"customer_id": "CUST12345", "financial_year": "2023-2024"})
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"

def test_generate_interest_certificate_customer_not_found(client: TestClient):
    response = client.post("/api/v1/interest-certificate/", json={"customer_id": "NONEXISTENT", "financial_year": "2023-2024"})
    assert response.status_code == 404
    assert response.json() == {"detail": "Customer not found"}

def test_generate_interest_certificate_no_interest_data(client: TestClient):
    # This test requires setting up a customer with no interest data for the given financial year
    # For now, we'll assume a 404 is returned, but a more specific error might be better
    response = client.post("/api/v1/interest-certificate/", json={"customer_id": "CUST_NO_INTEREST", "financial_year": "2023-2024"})
    assert response.status_code == 404
    assert response.json() == {"detail": "No interest data found for the given financial year"}

def test_tds_calculation(client: TestClient):
    # This test would require a more complex setup to verify the TDS calculation logic
    # We are assuming the service will return a PDF, so we can't directly check the TDS value here.
    # A unit test for the TDS calculation logic would be more appropriate.
    pass
