
import base64

def test_create_submission_success(client):
    # Test case for a successful submission (non-senior citizen)
    form_data = "This is a test PDF content."
    form_base64 = base64.b64encode(form_data.encode('utf-8')).decode('utf-8')

    response = client.post(
        "/api/v1/forms/submissions",
        json={
            "customer_pan": "ABCDE1234F",
            "financial_year": "2024-25",
            "declared_income": 200000,
            "digitally_signed_form_base64": form_base64
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUBMITTED"
    assert "Submission received and is being processed" not in data["message"]
    assert data["submission_id"] is not None

def test_create_submission_ineligible(client):
    # Test case for a rejected submission due to high income
    form_data = "This is another test PDF content."
    form_base64 = base64.b64encode(form_data.encode('utf-8')).decode('utf-8')

    response = client.post(
        "/api/v1/forms/submissions",
        json={
            "customer_pan": "ABCDE1234F",
            "financial_year": "2024-25",
            "declared_income": 300000,
            "digitally_signed_form_base64": form_base64
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "REJECTED"
    assert "Declared income exceeds the general limit" in data["message"]

def test_get_submission_status(client):
    # First, create a submission to retrieve
    form_data = "PDF for retrieval test."
    form_base64 = base64.b64encode(form_data.encode('utf-8')).decode('utf-8')
    
    create_response = client.post(
        "/api/v1/forms/submissions",
        json={
            "customer_pan": "FGHIJ5678K",
            "financial_year": "2024-25",
            "declared_income": 150000,
            "digitally_signed_form_base64": form_base64
        }
    )
    submission_id = create_response.json()["submission_id"]

    # Now, get the status
    get_response = client.get(f"/api/v1/forms/submissions/{submission_id}")
    assert get_response.status_code == 200
    data = get_response.json()
    assert data["submission_id"] == submission_id
    assert data["customer_pan"] == "FGHIJ5678K"
    assert data["status"] == "SUBMITTED"

def test_get_submission_not_found(client):
    # Test retrieving a non-existent submission
    non_existent_id = "a1b2c3d4-e5f6-7890-1234-567890abcdef"
    response = client.get(f"/api/v1/forms/submissions/{non_existent_id}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Submission not found"
