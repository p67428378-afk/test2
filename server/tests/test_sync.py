import uuid


def test_batch_offline_sync(client):
    unique_suffix = uuid.uuid4().hex[:6]
    tx_site_code = f"SITE-SYNC-{unique_suffix}"
    tx_art_code = f"ART-SYNC-{unique_suffix}"

    batch_payload = {
        "transactions": [
            {
                "client_tx_id": f"TX-{unique_suffix}-01",
                "payload_type": "create_site",
                "payload": {
                    "name": "Sync Field Site",
                    "site_code": tx_site_code,
                    "region": "Anatolia",
                    "historical_period": "Early Bronze",
                    "latitude": 38.4237,
                    "longitude": 27.1428,
                    "altitude_meters": 35.0,
                    "description": "Logged during remote field exploration.",
                },
                "client_timestamp": "2026-05-18T10:00:00Z",
            },
            {
                "client_tx_id": f"TX-{unique_suffix}-02",
                "payload_type": "create_artifact",
                "payload": {
                    "artifact_code": tx_art_code,
                    "material": "Obsidian Blade",
                    "context_layer": "Stratum I",
                    "depth_meters": 0.45,
                    "x_offset_meters": -0.2,
                    "y_offset_meters": 0.8,
                    "z_depth_meters": -0.45,
                },
                "client_timestamp": "2026-05-18T10:05:00Z",
            },
        ]
    }

    response = client.post("/api/v1/sync/batch", json=batch_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_received"] == 2
    assert data["synced_count"] == 2
    assert data["failed_count"] == 0
    assert len(data["results"]) == 2
    assert data["results"][0]["status"] == "SYNCED"
    assert data["results"][1]["status"] == "SYNCED"

    # Verify that the site actually exists
    site_res = client.get("/api/v1/sites")
    assert any(s["site_code"] == tx_site_code for s in site_res.json())

    # Verify that the artifact actually exists
    art_res = client.get("/api/v1/artifacts")
    assert any(a["artifact_code"] == tx_art_code for a in art_res.json())


def test_sync_status(client):
    response = client.get("/api/v1/sync/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "server_time" in data
    assert "total_synced_transactions" in data
