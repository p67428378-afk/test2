from fastapi import status


def test_committee_approve_award(client, auth_headers):
    # Researcher creates proposal
    pi_headers = auth_headers("test@example.com")
    prop_res = client.post(
        "/api/v1/proposals",
        json={
            "title": "Clean Energy Proposal",
            "abstract": "Solar efficiency research",
            "requested_budget": 100000.0,
            "status": "UNDER_REVIEW",
        },
        headers=pi_headers,
    )
    proposal_id = prop_res.json()["id"]

    # Committee member approves funding
    committee_headers = auth_headers("committee@example.com")
    award_payload = {
        "proposal_id": proposal_id,
        "allocated_budget": 100000.0,
        "decision_notes": "Approved in full after committee review.",
        "status": "APPROVED",
    }
    approve_res = client.post(
        "/api/v1/awards/approve",
        json=award_payload,
        headers=committee_headers,
    )
    assert approve_res.status_code == status.HTTP_201_CREATED
    data = approve_res.json()
    assert data["proposal_id"] == proposal_id
    assert data["status"] == "ACTIVE"


def test_partial_funding_requires_revision(client, auth_headers):
    pi_headers = auth_headers("test@example.com")
    prop_res = client.post(
        "/api/v1/proposals",
        json={
            "title": "Robotics Proposal",
            "abstract": "Robotic automation research",
            "requested_budget": 120000.0,
            "status": "UNDER_REVIEW",
        },
        headers=pi_headers,
    )
    proposal_id = prop_res.json()["id"]

    # Committee approves partial funding ($90,000 instead of $120,000)
    committee_headers = auth_headers("committee@example.com")
    award_payload = {
        "proposal_id": proposal_id,
        "allocated_budget": 90000.0,
        "requires_revised_budget": True,
        "decision_notes": "Partial funding approved; requires revised budget.",
        "status": "APPROVED",
    }
    approve_res = client.post(
        "/api/v1/awards/approve",
        json=award_payload,
        headers=committee_headers,
    )
    assert approve_res.status_code == status.HTTP_201_CREATED
    data = approve_res.json()
    assert data["status"] == "PENDING_REVISION"
    assert data["requires_revised_budget"] is True
