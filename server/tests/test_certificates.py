import pytest
from server.services.signing_service import SigningService

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_request_certificate_success(client):
    # Valid account and valid OTP
    payload = {
        "account_number": "1002948571",
        "otp": "123456",
        "purpose": "Visa Application"
    }
    response = client.post("/api/v1/certificates", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["account_number"] == "1002948571"
    assert data["customer_id"] == "CUST-99281"
    assert data["purpose"] == "Visa Application"
    assert data["status"] == "SUCCESS"
    assert "id" in data
    assert "generated_pdf_url" in data

    # Verify download
    download_url = data["generated_pdf_url"]
    download_response = client.get(download_url)
    assert download_response.status_code == 200
    assert download_response.headers["content-type"] == "application/pdf"
    
    # Verify digital signature
    pdf_bytes = download_response.content
    assert SigningService.verify_signature(pdf_bytes) is True

def test_request_certificate_invalid_otp(client):
    # Valid account but invalid OTP
    payload = {
        "account_number": "1002948571",
        "otp": "000000",
        "purpose": "Visa Application"
    }
    response = client.post("/api/v1/certificates", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "OTP validation failed"

    # Verify it was logged as FAILED in history
    list_response = client.get("/api/v1/certificates")
    assert list_response.status_code == 200
    list_data = list_response.json()
    assert list_data["total"] == 1
    assert list_data["items"][0]["status"] == "FAILED"
    assert list_data["items"][0]["failure_reason"] == "OTP validation failed"

def test_request_certificate_invalid_account(client):
    # Invalid account but valid OTP
    payload = {
        "account_number": "9999999999",
        "otp": "123456",
        "purpose": "Visa Application"
    }
    response = client.post("/api/v1/certificates", json=payload)
    assert response.status_code == 404
    assert response.json()["detail"] == "Account number not found in CBS"

    # Verify it was logged as FAILED in history
    list_response = client.get("/api/v1/certificates")
    assert list_response.status_code == 200
    list_data = list_response.json()
    assert list_data["total"] == 1
    assert list_data["items"][0]["status"] == "FAILED"
    assert list_data["items"][0]["failure_reason"] == "Account number not found in CBS"

def test_list_certificates_pagination(client):
    # Create multiple requests
    for i in range(5):
        payload = {
            "account_number": "1002948571",
            "otp": "123456",
            "purpose": f"Purpose {i}"
        }
        client.post("/api/v1/certificates", json=payload)

    response = client.get("/api/v1/certificates?skip=0&limit=3")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 3
    assert data["total"] == 5
    assert data["page"] == 1

def test_download_not_found(client):
    response = client.get("/api/v1/certificates/non-existent-id/download")
    assert response.status_code == 404
    assert response.json()["detail"] == "Certificate request not found"
