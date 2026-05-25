
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import json

def test_create_application(client: TestClient, setup_db: Session):
    # First, create a credit card offering to apply for
    offering_data = {
        "name": "Test Card",
        "description": "A test card",
        "features": ["Feature 1", "Feature 2"],
        "benefits": ["Benefit 1", "Benefit 2"],
        "eligibility_criteria": "Everyone is eligible"
    }
    response = client.post("/api/credit-cards/", json=offering_data)
    assert response.status_code == 200
    db_offering = response.json()

    application_data = {
        "credit_card_id": str(db_offering["id"]),
        "applicant": {
            "first_name": "John",
            "last_name": "Doe",
            "address_line_1": "123 Main St",
            "city": "Anytown",
            "state": "CA",
            "zip_code": "12345",
            "phone_number": "555-555-5555",
            "email_address": "johndoe@example.com"
        },
        "financial_info": {
            "annual_income": 100000.0,
            "credit_score": 750
        },
        "employment_info": {
            "employer_name": "Test Corp",
            "employer_address": "456 Market St",
            "job_title": "Software Engineer",
            "employment_start_date": "2022-01-01"
        }
    }

    response = client.post(
        "/api/applications/",
        data={"application": json.dumps(application_data)},
        files={"account_statement": ("statement.pdf", b"This is a test statement.", "application/pdf")}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["applicant"]["email_address"] == "johndoe@example.com"
    assert data["status"] == "Submitted"
