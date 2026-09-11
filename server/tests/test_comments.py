from datetime import date, timedelta


def test_comments_and_visibility(client, auth_headers, vendor_auth_headers):
    today = date.today()
    next_year = today + timedelta(days=365)

    # Create a contract
    c_resp = client.post(
        "/api/v1/contracts",
        json={
            "title": "Comment Test Contract",
            "vendor_name": "Acme Corp",
            "effective_date": today.isoformat(),
            "termination_date": next_year.isoformat(),
            "total_value": 75000.0,
        },
        headers=auth_headers,
    )
    contract_id = c_resp.json()["id"]

    # Internal user posts a public comment
    pub_comment_resp = client.post(
        f"/api/v1/contracts/{contract_id}/comments",
        json={
            "content": "Public comment for vendor review.",
            "clause_reference": "Section 1",
            "is_internal_only": False,
        },
        headers=auth_headers,
    )
    assert pub_comment_resp.status_code == 201

    # Internal user posts an internal-only comment
    priv_comment_resp = client.post(
        f"/api/v1/contracts/{contract_id}/comments",
        json={
            "content": "Internal risk evaluation note.",
            "clause_reference": "Section 4",
            "is_internal_only": True,
        },
        headers=auth_headers,
    )
    assert priv_comment_resp.status_code == 201

    # Fetch comments as internal user -> should see both (2 comments)
    int_list_resp = client.get(
        f"/api/v1/contracts/{contract_id}/comments", headers=auth_headers
    )
    assert int_list_resp.status_code == 200
    int_comments = int_list_resp.json()
    assert len(int_comments) == 2

    # Fetch comments as vendor rep -> should see only public comment (1 comment)
    vend_list_resp = client.get(
        f"/api/v1/contracts/{contract_id}/comments", headers=vendor_auth_headers
    )
    assert vend_list_resp.status_code == 200
    vend_comments = vend_list_resp.json()
    assert len(vend_comments) == 1
    assert vend_comments[0]["is_internal_only"] is False
