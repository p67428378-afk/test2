import io
import base64
from PIL import Image


def test_classify_material_valid(client):
    artifacts_res = client.get("/api/v1/artifacts")
    artifact_id = artifacts_res.json()[0]["id"]

    # Generate a dummy valid 10x10 PNG
    img = Image.new("RGB", (10, 10), color="brown")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b64_str = base64.b64encode(buf.getvalue()).decode("utf-8")

    payload = {
        "artifact_id": artifact_id,
        "image_base64": b64_str,
    }
    response = client.post("/api/v1/ml/classify-material", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["artifact_id"] == artifact_id
    assert "predicted_material" in data
    assert "confidence_score" in data
    assert isinstance(data["anomalies_detected"], list)
    assert isinstance(data["requires_manual_override"], bool)


def test_classify_material_corrupt_image(client):
    artifacts_res = client.get("/api/v1/artifacts")
    artifact_id = artifacts_res.json()[0]["id"]

    payload = {
        "artifact_id": artifact_id,
        "image_base64": "not_a_valid_image_payload_corrupt_bytes!!!",
    }
    response = client.post("/api/v1/ml/classify-material", json=payload)
    assert response.status_code in (400, 422)


def test_classify_material_nonexistent_artifact(client):
    payload = {
        "artifact_id": "00000000-0000-0000-0000-000000000000",
    }
    response = client.post("/api/v1/ml/classify-material", json=payload)
    assert response.status_code == 404
