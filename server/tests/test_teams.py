import pytest


def test_create_team_and_assign_members(client):
    sites_res = client.get("/api/v1/sites")
    site_id = sites_res.json()["items"][0]["id"]

    # Create team
    team_res = client.post("/api/v1/teams", json={
        "team_name": "Stratigraphy Unit Delta",
        "site_id": site_id,
    })
    assert team_res.status_code == 201
    team_data = team_res.json()
    team_id = team_data["id"]
    assert team_data["team_name"] == "Stratigraphy Unit Delta"

    # Assign member
    member_res = client.post(f"/api/v1/teams/{team_id}/members", json={
        "full_name": "Dr. Helena Troy",
        "role": "Director",
        "email": "helena.troy@excavation.org",
        "phone": "+1-555-4321",
    })
    assert member_res.status_code == 201
    member_data = member_res.json()
    assert member_data["full_name"] == "Dr. Helena Troy"
    assert member_data["team_id"] == team_id

    # Get team details with members
    get_res = client.get(f"/api/v1/teams/{team_id}")
    assert get_res.status_code == 200
    team_detail = get_res.json()
    assert len(team_detail["members"]) >= 1
    assert team_detail["members"][0]["full_name"] == "Dr. Helena Troy"


def test_list_all_teams_and_members(client):
    res_teams = client.get("/api/v1/teams")
    assert res_teams.status_code == 200
    assert "items" in res_teams.json()

    res_members = client.get("/api/v1/teams/members/all")
    assert res_members.status_code == 200
    assert isinstance(res_members.json(), list)
    assert len(res_members.json()) >= 1


def test_delete_team(client):
    team_res = client.post("/api/v1/teams", json={"team_name": "Temp Team to Delete"})
    team_id = team_res.json()["id"]

    del_res = client.delete(f"/api/v1/teams/{team_id}")
    assert del_res.status_code == 204

    assert client.get(f"/api/v1/teams/{team_id}").status_code == 404
