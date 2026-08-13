import uuid
from fastapi.testclient import TestClient


def test_finish_tournament_and_verify_certificates(client: TestClient):
    t_res = client.post(
        "/api/v1/tournaments",
        json={"name": "Certificate Championship 2026", "total_rounds": 1},
    )
    t_id = t_res.json()["id"]

    client.post(
        f"/api/v1/tournaments/{t_id}/players",
        json={
            "full_name": "Champion Player",
            "email": "champ@test.com",
            "rating": 2200,
        },
    )
    client.post(
        f"/api/v1/tournaments/{t_id}/players",
        json={"full_name": "Runner Up", "email": "runner@test.com", "rating": 2000},
    )

    # Finish tournament
    finish_res = client.post(f"/api/v1/tournaments/{t_id}/finish")
    assert finish_res.status_code == 200
    f_data = finish_res.json()
    assert f_data["status"] == "COMPLETED"
    assert f_data["issued_certificates_count"] == 2
    assert len(f_data["certificates"]) == 2

    # Verify a certificate via public endpoint
    cert_uuid = f_data["certificates"][0]["verification_uuid"]
    verify_res = client.get(f"/api/v1/certificates/verify/{cert_uuid}")
    assert verify_res.status_code == 200
    v_data = verify_res.json()
    assert v_data["valid"] is True
    assert v_data["tournament_name"] == "Certificate Championship 2026"
    assert "player_name" in v_data

    # Download PDF certificate
    pdf_res = client.get(f"/api/v1/certificates/{cert_uuid}/pdf")
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert pdf_res.content.startswith(b"%PDF")


def test_verify_non_existent_certificate_returns_404(client: TestClient):
    fake_uuid = str(uuid.uuid4())
    res = client.get(f"/api/v1/certificates/verify/{fake_uuid}")
    assert res.status_code == 404
    assert "Certificate invalid or authentic record not found" in res.json()["detail"]
