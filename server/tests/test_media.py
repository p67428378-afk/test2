import pytest


def test_create_and_get_media_asset(client):
    sites_res = client.get("/api/v1/sites")
    site_id = sites_res.json()["items"][0]["id"]

    media_payload = {
        "site_id": site_id,
        "file_name": "trench_section_north.png",
        "file_url": "https://storage.googleapis.com/archeo-bucket/trench_section_north.png",
        "media_type": "image/png",
        "file_size_bytes": 2048576,
        "caption": "North trench stratigraphy cross-section showing volcanic ash horizon.",
        "camera_metadata": {
            "camera": "Sony A7R IV",
            "focal_length": "24mm",
            "iso": 200
        }
    }
    res = client.post("/api/v1/media/upload", json=media_payload)
    assert res.status_code == 201
    media_data = res.json()
    assert media_data["file_name"] == "trench_section_north.png"
    assert media_data["site_id"] == site_id
    media_id = media_data["id"]

    # Get
    get_res = client.get(f"/api/v1/media/{media_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == media_id


def test_list_and_delete_media(client):
    res = client.get("/api/v1/media")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert len(data["items"]) >= 1

    # Upload and delete
    post_res = client.post("/api/v1/media/upload", json={
        "file_name": "temp_delete.jpg",
        "file_url": "https://storage.googleapis.com/temp.jpg",
        "media_type": "image/jpeg",
        "file_size_bytes": 1024,
    })
    temp_id = post_res.json()["id"]

    del_res = client.delete(f"/api/v1/media/{temp_id}")
    assert del_res.status_code == 204
    assert client.get(f"/api/v1/media/{temp_id}").status_code == 404
