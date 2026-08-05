from fastapi import status


def test_reviewer_evaluation_scoring(client, auth_headers):
    # Researcher creates & submits proposal in Biology department
    pi_headers = auth_headers("test@example.com")
    prop_res = client.post(
        "/api/v1/proposals",
        json={
            "title": "Bio Genetics Proposal",
            "abstract": "Genetic mapping research",
            "requested_budget": 80000.0,
            "department": "Biochemistry",
            "status": "SUBMITTED",
        },
        headers=pi_headers,
    )
    proposal_id = prop_res.json()["id"]

    # Reviewer in Biology evaluates non-COI proposal
    reviewer_headers = auth_headers("reviewer@example.com")
    score_payload = {
        "score": 88,
        "methodology_score": 90,
        "impact_score": 85,
        "feasibility_score": 89,
        "comments": "High scientific merit and clear methodology.",
    }
    score_res = client.post(
        f"/api/v1/evaluations/{proposal_id}/score",
        json=score_payload,
        headers=reviewer_headers,
    )
    assert score_res.status_code == status.HTTP_200_OK
    data = score_res.json()
    assert data["score"] == 88
    assert data["status"] == "COMPLETED"


def test_evaluation_coi_prevention(client, auth_headers):
    # Researcher in Biology creates proposal
    pi_headers = auth_headers("test@example.com")
    prop_res = client.post(
        "/api/v1/proposals",
        json={
            "title": "COI Test Proposal",
            "abstract": "Testing COI prevention",
            "requested_budget": 50000.0,
            "department": "Biology",  # Same department as reviewer@example.com
            "status": "SUBMITTED",
        },
        headers=pi_headers,
    )
    proposal_id = prop_res.json()["id"]

    # Reviewer in same department attempts to score -> should be forbidden (COI)
    reviewer_headers = auth_headers("reviewer@example.com")
    score_res = client.post(
        f"/api/v1/evaluations/{proposal_id}/score",
        json={"score": 90, "comments": "Attempting COI score"},
        headers=reviewer_headers,
    )
    assert score_res.status_code == status.HTTP_403_FORBIDDEN
    assert "Conflict of Interest" in score_res.json()["detail"]
