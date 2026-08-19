def test_get_technicians(client):
    response = client.get("/api/v1/technicians")
    assert response.status_code == 200
    techs = response.json()
    assert isinstance(techs, list)
    assert len(techs) >= 1
    emails = [t["email"] for t in techs]
    assert "john.doe@eb.gov" in emails
    assert "test@example.com" in emails
