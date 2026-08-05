from fastapi import status


def test_expense_logging_and_financial_report(client, auth_headers):
    admin_headers = auth_headers("admin@example.com")
    pi_headers = auth_headers("test@example.com")

    # Create proposal and award with $100,000 budget
    prop_res = client.post(
        "/api/v1/proposals",
        json={
            "title": "Data Science Grant",
            "abstract": "Big data analytics",
            "requested_budget": 100000.0,
        },
        headers=pi_headers,
    )
    proposal_id = prop_res.json()["id"]

    award_res = client.post(
        "/api/v1/awards/approve",
        json={
            "proposal_id": proposal_id,
            "allocated_budget": 100000.0,
            "status": "APPROVED",
        },
        headers=admin_headers,
    )
    award_id = award_res.json()["id"]

    # Log $25,000 Personnel expense
    exp1_res = client.post(
        "/api/v1/financial-reports/expense",
        json={
            "award_id": award_id,
            "category": "PERSONNEL",
            "amount": 25000.0,
            "description": "Postdoc stipend Q1",
        },
        headers=pi_headers,
    )
    assert exp1_res.status_code == status.HTTP_201_CREATED

    # Log $5,000 Equipment expense
    exp2_res = client.post(
        "/api/v1/financial-reports/expense",
        json={
            "award_id": award_id,
            "category": "EQUIPMENT",
            "amount": 5000.0,
            "description": "GPU Workstation",
        },
        headers=pi_headers,
    )
    assert exp2_res.status_code == status.HTTP_201_CREATED

    # Fetch financial report
    report_res = client.get(f"/api/v1/financial-reports/{award_id}", headers=pi_headers)
    assert report_res.status_code == status.HTTP_200_OK
    report = report_res.json()

    assert float(report["allocated_budget"]) == 100000.0
    assert float(report["total_expenses"]) == 30000.0
    assert float(report["remaining_budget"]) == 70000.0
    assert report["burn_rate_percentage"] == 30.0
    assert float(report["category_breakdown"]["PERSONNEL"]) == 25000.0
    assert float(report["category_breakdown"]["EQUIPMENT"]) == 5000.0


def test_invalid_expense_category(client, auth_headers):
    admin_headers = auth_headers("admin@example.com")
    pi_headers = auth_headers("test@example.com")

    prop_res = client.post(
        "/api/v1/proposals",
        json={"title": "Test Grant", "abstract": "Test", "requested_budget": 50000.0},
        headers=pi_headers,
    )
    proposal_id = prop_res.json()["id"]

    award_res = client.post(
        "/api/v1/awards/approve",
        json={
            "proposal_id": proposal_id,
            "allocated_budget": 50000.0,
            "status": "APPROVED",
        },
        headers=admin_headers,
    )
    award_id = award_res.json()["id"]

    exp_res = client.post(
        "/api/v1/financial-reports/expense",
        json={
            "award_id": award_id,
            "category": "INVALID_CAT",
            "amount": 1000.0,
            "description": "Invalid expense",
        },
        headers=pi_headers,
    )
    assert exp_res.status_code == status.HTTP_400_BAD_REQUEST
