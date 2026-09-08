import base64
import json


def test_export_itinerary_json(client):
    create_res = client.post(
        "/api/v1/recommendations",
        json={
            "destination": "Tokyo",
            "budget": 150.0,
            "currency": "USD",
            "interests": ["Food"],
        },
    )
    assert create_res.status_code == 201
    rec_id = create_res.json()["id"]

    export_res = client.post(
        "/api/v1/recommendations/export",
        json={
            "recommendation_id": rec_id,
            "export_format": "json",
            "include_cost_summary": True,
        },
    )
    assert export_res.status_code == 200
    data = export_res.json()
    assert "export_id" in data
    assert data["recommendation_id"] == rec_id
    assert data["file_name"].endswith(".json")
    assert data["mime_type"] == "application/json"
    assert "share_url" in data

    decoded = base64.b64decode(data["content_base64"]).decode("utf-8")
    parsed_json = json.loads(decoded)
    assert parsed_json["destination"] == "Tokyo"
    assert len(parsed_json["items"]) > 0
    assert "cost_summary" in parsed_json


def test_export_itinerary_pdf(client):
    create_res = client.post(
        "/api/v1/recommendations",
        json={
            "destination": "Kyoto",
            "budget": 120.0,
            "currency": "USD",
            "interests": ["Culture"],
        },
    )
    assert create_res.status_code == 201
    rec_id = create_res.json()["id"]

    export_res = client.post(
        "/api/v1/recommendations/export",
        json={
            "recommendation_id": rec_id,
            "export_format": "pdf",
            "include_cost_summary": True,
        },
    )
    assert export_res.status_code == 200
    data = export_res.json()
    assert data["file_name"].endswith(".pdf")
    assert data["mime_type"] == "application/pdf"
    assert len(data["content_base64"]) > 0


def test_export_itinerary_share_link(client):
    create_res = client.post(
        "/api/v1/recommendations",
        json={"destination": "London", "budget": 300.0, "currency": "GBP"},
    )
    assert create_res.status_code == 201
    rec_id = create_res.json()["id"]

    export_res = client.post(
        "/api/v1/recommendations/export",
        json={
            "recommendation_id": rec_id,
            "export_format": "link",
        },
    )
    assert export_res.status_code == 200
    data = export_res.json()
    assert f"share={rec_id}" in data["share_url"]


def test_export_itinerary_not_found(client):
    export_res = client.post(
        "/api/v1/recommendations/export",
        json={
            "recommendation_id": "non-existent-rec-id",
            "export_format": "json",
        },
    )
    assert export_res.status_code == 404
