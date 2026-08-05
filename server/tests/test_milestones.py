from datetime import datetime, timedelta
from fastapi import status


def test_milestone_creation_and_submission(client, auth_headers):
    # Setup proposal and award
    admin_headers = auth_headers("admin@example.com")
    pi_headers = auth_headers("test@example.com")

    prop_res = client.post(
        "/api/v1/proposals",
        json={
            "title": "AI Ethics Study",
            "abstract": "Ethics in AI",
            "requested_budget": 50000.0,
        },
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

    # Create milestone
    due = (datetime.utcnow() + timedelta(days=30)).isoformat()
    m_res = client.post(
        "/api/v1/milestones",
        json={
            "award_id": award_id,
            "title": "Milestone 1: Literature Review",
            "due_date": due,
        },
        headers=pi_headers,
    )
    assert m_res.status_code == status.HTTP_201_CREATED
    milestone_id = m_res.json()["id"]

    # Submit milestone
    sub_res = client.post(
        f"/api/v1/milestones/{milestone_id}/submit",
        json={
            "progress_report": "Completed literature review of 50 papers.",
            "deliverable_url": "/uploads/lit_review.pdf",
        },
        headers=pi_headers,
    )
    assert sub_res.status_code == status.HTTP_200_OK
    assert sub_res.json()["status"] == "SUBMITTED"


def test_overdue_milestone_detection(client, auth_headers):
    admin_headers = auth_headers("admin@example.com")
    pi_headers = auth_headers("test@example.com")

    prop_res = client.post(
        "/api/v1/proposals",
        json={
            "title": "Neuroscience Study",
            "abstract": "Brain imaging",
            "requested_budget": 60000.0,
        },
        headers=pi_headers,
    )
    proposal_id = prop_res.json()["id"]

    award_res = client.post(
        "/api/v1/awards/approve",
        json={
            "proposal_id": proposal_id,
            "allocated_budget": 60000.0,
            "status": "APPROVED",
        },
        headers=admin_headers,
    )
    award_id = award_res.json()["id"]

    # Create past-due milestone
    past_due = (datetime.utcnow() - timedelta(days=5)).isoformat()
    client.post(
        "/api/v1/milestones",
        json={"award_id": award_id, "title": "Overdue Milestone", "due_date": past_due},
        headers=pi_headers,
    )

    # Fetch milestones -> triggers overdue detection
    list_res = client.get(f"/api/v1/milestones/{award_id}", headers=pi_headers)
    assert list_res.status_code == status.HTTP_200_OK
    milestones = list_res.json()
    assert len(milestones) >= 1
    assert milestones[0]["status"] == "OVERDUE"
