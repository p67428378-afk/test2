import pytest


def test_create_and_link_publication(client):
    # Get artifact
    artifacts_res = client.get("/api/v1/artifacts")
    artifact_id = artifacts_res.json()["items"][0]["id"]

    pub_payload = {
        "title": "Stratigraphic Sequences and Ceramic Typology of the Levant",
        "authors": "Dr. Helena Troy, Dr. Jane Doe",
        "journal_publisher": "Levantine Archaeology Bulletin",
        "publication_date": "2026-06-15",
        "doi": "10.1080/lab.2026.4421",
        "artifact_ids": [artifact_id]
    }
    create_res = client.post("/api/v1/publications", json=pub_payload)
    assert create_res.status_code == 201
    pub_data = create_res.json()
    assert pub_data["title"] == pub_payload["title"]
    assert artifact_id in pub_data["linked_artifact_ids"]
    pub_id = pub_data["id"]

    # Get publication
    get_res = client.get(f"/api/v1/publications/{pub_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == pub_id


def test_explicit_link_endpoint(client):
    # Create another artifact
    sites_res = client.get("/api/v1/sites")
    site_id = sites_res.json()["items"][0]["id"]

    art_res = client.post("/api/v1/artifacts", json={
        "site_id": site_id,
        "artifact_code": "ART-PUB-LINK-01",
        "material": "Ceramic",
        "context_layer": "Stratum IV",
        "depth_meters": 3.1,
        "excavation_date": "2026-03-10",
    })
    new_art_id = art_res.json()["id"]

    # Create publication without links
    pub_res = client.post("/api/v1/publications", json={
        "title": "New Horizons in Ceramic Petrology",
        "authors": "Marcus Vance",
        "journal_publisher": "Archaeometry Today",
        "publication_date": "2026-07-01",
    })
    pub_id = pub_res.json()["id"]

    # Link via /api/v1/publications/link
    link_res = client.post("/api/v1/publications/link", json={
        "publication_id": pub_id,
        "artifact_id": new_art_id,
    })
    assert link_res.status_code == 200
    assert new_art_id in link_res.json()["linked_artifact_ids"]


def test_list_and_delete_publication(client):
    res = client.get("/api/v1/publications")
    assert res.status_code == 200
    assert "items" in res.json()
    assert len(res.json()["items"]) >= 1

    # Create and delete
    temp_res = client.post("/api/v1/publications", json={
        "title": "Temporary Publication to Delete",
        "authors": "Anonymous",
        "journal_publisher": "Draft Monograph",
        "publication_date": "2026-01-01",
    })
    temp_id = temp_res.json()["id"]

    del_res = client.delete(f"/api/v1/publications/{temp_id}")
    assert del_res.status_code == 204
    assert client.get(f"/api/v1/publications/{temp_id}").status_code == 404
