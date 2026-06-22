def test_submit_contact_form_success(client):
    payload = {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "message": "I would like to inquire about a custom portrait session.",
    }
    response = client.post("/api/v1/contact", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "success"
    assert data["message"] == "Inquiry received"


def test_submit_contact_form_invalid_email(client):
    payload = {
        "name": "Jane Smith",
        "email": "invalid-email",
        "message": "I would like to inquire about a custom portrait session.",
    }
    response = client.post("/api/v1/contact", json=payload)
    assert response.status_code == 422
