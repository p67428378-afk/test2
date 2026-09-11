from datetime import date, timedelta


def test_workflow_approval_lifecycle(
    client, auth_headers, legal_auth_headers, finance_auth_headers
):
    today = date.today()
    next_year = today + timedelta(days=365)

    # 1. Create contract in Draft state
    c_resp = client.post(
        "/api/v1/contracts",
        json={
            "title": "Approval Lifecycle Contract",
            "vendor_name": "Acme Corp",
            "effective_date": today.isoformat(),
            "termination_date": next_year.isoformat(),
            "total_value": 200000.0,
        },
        headers=auth_headers,
    )
    contract_id = c_resp.json()["id"]
    assert c_resp.json()["status"] == "Draft"

    # 2. Submit to Legal Review
    sub_resp = client.post(
        f"/api/v1/contracts/{contract_id}/approvals",
        json={"action": "SUBMIT", "comments": "Submitting for legal review"},
        headers=auth_headers,
    )
    assert sub_resp.status_code == 200
    assert sub_resp.json()["status"] == "Legal Review"

    # 3. Legal approves -> Finance Approval
    leg_resp = client.post(
        f"/api/v1/contracts/{contract_id}/approvals",
        json={"action": "APPROVE", "comments": "Legal terms approved"},
        headers=legal_auth_headers,
    )
    assert leg_resp.status_code == 200
    assert leg_resp.json()["status"] == "Finance Approval"

    # 4. Rejection without comments -> 400 Bad Request
    rej_fail = client.post(
        f"/api/v1/contracts/{contract_id}/approvals",
        json={"action": "REJECT", "comments": ""},
        headers=finance_auth_headers,
    )
    assert rej_fail.status_code == 400

    # 5. Rejection with comments -> Draft
    rej_succ = client.post(
        f"/api/v1/contracts/{contract_id}/approvals",
        json={"action": "REJECT", "comments": "Budget allocation insufficient"},
        headers=finance_auth_headers,
    )
    assert rej_succ.status_code == 200
    assert rej_succ.json()["status"] == "Draft"

    # Check workflow history
    hist_resp = client.get(
        f"/api/v1/contracts/{contract_id}/approvals", headers=auth_headers
    )
    assert hist_resp.status_code == 200
    history = hist_resp.json()
    assert len(history) >= 4
