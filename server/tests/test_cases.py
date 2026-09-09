def test_case_crud_and_evidence_assignment(client, investigator_headers):
    # 1. Create a new case
    case_payload = {
        "case_number": "CASE-2026-999",
        "title": "Operation Nightfall",
        "description": "Counter-surveillance forensic investigation",
        "status": "Active",
    }
    create_res = client.post(
        "/api/v1/cases", json=case_payload, headers=investigator_headers
    )
    assert create_res.status_code == 201
    case_data = create_res.json()
    case_id = case_data["id"]
    assert case_data["case_number"] == "CASE-2026-999"

    # 2. List cases
    list_res = client.get("/api/v1/cases", headers=investigator_headers)
    assert list_res.status_code == 200
    cases_list = list_res.json()
    assert any(c["case_number"] == "CASE-2026-999" for c in cases_list)

    # 3. Assign evidence to case
    assign_res = client.post(
        f"/api/v1/cases/{case_id}/evidence",
        json={"evidence_ids": ["EVID-1005"]},
        headers=investigator_headers,
    )
    assert assign_res.status_code == 200
    detail_data = assign_res.json()
    assert any(e["evidence_code"] == "EVID-1005" for e in detail_data["evidence_items"])

    # 4. Get case details
    get_res = client.get(f"/api/v1/cases/{case_id}", headers=investigator_headers)
    assert get_res.status_code == 200
    assert len(get_res.json()["evidence_items"]) == 1

    # 5. Unassign evidence from case
    unassign_res = client.delete(
        f"/api/v1/cases/{case_id}/evidence/EVID-1005",
        headers=investigator_headers,
    )
    assert unassign_res.status_code == 200
    assert len(unassign_res.json()["evidence_items"]) == 0


def test_case_stats_summary(client, investigator_headers):
    res = client.get("/api/v1/cases/stats/summary", headers=investigator_headers)
    assert res.status_code == 200
    stats = res.json()
    assert "active_cases" in stats
    assert "total_evidence_items" in stats
    assert "unassigned_artifacts" in stats
