def test_register_storage_container(client):
    payload = {
        "container_code": "CRATE-2026-99",
        "room_name": "Vault Room 2",
        "rack_number": "R-10",
        "bin_number": "B-05",
        "description": "Reinforced steel case for delicate metallic finds.",
    }
    response = client.post("/api/v1/custody/storage-containers", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["container_code"] == "CRATE-2026-99"
    assert data["room_name"] == "Vault Room 2"


def test_list_storage_containers(client):
    response = client.get("/api/v1/custody/storage-containers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_record_custody_transfer(client):
    artifacts_res = client.get("/api/v1/artifacts")
    artifact_id = artifacts_res.json()[0]["id"]

    members_res = client.get("/api/v1/teams/members/all")
    releasing_id = members_res.json()[0]["id"]
    receiving_id = members_res.json()[1]["id"] if len(members_res.json()) > 1 else releasing_id

    containers_res = client.get("/api/v1/custody/storage-containers")
    container_id = containers_res.json()[0]["id"]

    payload = {
        "artifact_id": artifact_id,
        "container_id": container_id,
        "releasing_custodian_id": releasing_id,
        "receiving_custodian_id": receiving_id,
        "notes": "Transferred for XRF analysis preparation.",
    }
    response = client.post("/api/v1/custody/transfer", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["artifact_id"] == artifact_id
    assert data["container_id"] == container_id
    assert data["notes"] == "Transferred for XRF analysis preparation."


def test_get_custody_history(client):
    artifacts_res = client.get("/api/v1/artifacts")
    artifact_id = artifacts_res.json()[0]["id"]

    response = client.get(f"/api/v1/custody/history/{artifact_id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["artifact_id"] == artifact_id


def test_generate_qr_code(client):
    artifacts_res = client.get("/api/v1/artifacts")
    artifact_id = artifacts_res.json()[0]["id"]

    response = client.get(f"/api/v1/qr/generate/artifact/{artifact_id}")
    assert response.status_code == 200
    data = response.json()
    assert "base64_image" in data
    assert data["base64_image"].startswith("data:image/png;base64,")
    assert "qr_data" in data
