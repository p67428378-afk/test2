def test_process_donation_success(client):
    # Get a campaign
    camp_resp = client.get("/api/v1/campaigns")
    campaign = camp_resp.json()["items"][0]
    initial_amount = campaign["current_amount"]

    payload = {
        "campaign_id": campaign["id"],
        "donor_name": "Jane Doe",
        "donor_email": "jane@example.com",
        "amount": 50.00,
    }
    response = client.post("/api/v1/donations", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["amount"] == 50.00
    assert data["payment_status"] == "Completed"
    assert "transaction_id" in data
    assert data["transaction_id"].startswith("TXN-")

    # Verify campaign current_amount updated instantly
    updated_camp = client.get(f"/api/v1/campaigns/{campaign['id']}").json()
    assert updated_camp["current_amount"] == initial_amount + 50.00


def test_process_donation_zero_amount_rejected(client):
    camp_resp = client.get("/api/v1/campaigns")
    campaign_id = camp_resp.json()["items"][0]["id"]

    payload = {
        "campaign_id": campaign_id,
        "donor_name": "John Doe",
        "donor_email": "john@example.com",
        "amount": 0.00,
    }
    response = client.post("/api/v1/donations", json=payload)
    assert response.status_code in [400, 422]


def test_process_donation_negative_amount_rejected(client):
    camp_resp = client.get("/api/v1/campaigns")
    campaign_id = camp_resp.json()["items"][0]["id"]

    payload = {
        "campaign_id": campaign_id,
        "donor_name": "John Doe",
        "donor_email": "john@example.com",
        "amount": -25.00,
    }
    response = client.post("/api/v1/donations", json=payload)
    assert response.status_code in [400, 422]


def test_admin_list_donations(client, admin_headers):
    # Make a donation first
    camp_resp = client.get("/api/v1/campaigns")
    campaign_id = camp_resp.json()["items"][0]["id"]
    client.post(
        "/api/v1/donations",
        json={
            "campaign_id": campaign_id,
            "donor_name": "Alice Smith",
            "donor_email": "alice@example.com",
            "amount": 100.00,
        },
    )

    response = client.get("/api/v1/donations", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] >= 1


def test_admin_export_csv_donations(client, admin_headers):
    # Make a donation
    camp_resp = client.get("/api/v1/campaigns")
    campaign_id = camp_resp.json()["items"][0]["id"]
    client.post(
        "/api/v1/donations",
        json={
            "campaign_id": campaign_id,
            "donor_name": "Bob Builder",
            "donor_email": "bob@example.com",
            "amount": 25.00,
        },
    )

    response = client.get("/api/v1/donations?export_csv=true", headers=admin_headers)
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")
    csv_content = response.text
    assert "Transaction ID" in csv_content
    assert "Bob Builder" in csv_content


def test_authenticated_donor_my_donations(client, donor_headers):
    # Make a donation with donor headers
    camp_resp = client.get("/api/v1/campaigns")
    campaign_id = camp_resp.json()["items"][0]["id"]
    client.post(
        "/api/v1/donations",
        json={
            "campaign_id": campaign_id,
            "donor_name": "Test Donor",
            "donor_email": "test@example.com",
            "amount": 75.00,
        },
        headers=donor_headers,
    )

    response = client.get("/api/v1/donations/my-donations", headers=donor_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert data["items"][0]["amount"] == 75.00
