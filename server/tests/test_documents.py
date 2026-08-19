import io
from datetime import date


def test_document_upload_and_get(client):
    today_str = date.today().isoformat()
    p_res = client.post(
        "/api/v1/products",
        json={
            "product_name": "Canon Camera",
            "serial_number": "CAN-8811",
            "purchase_date": today_str,
            "duration_months": 24,
        },
    ).json()
    product_id = p_res["id"]

    # Upload fake receipt image
    file_content = b"Fake receipt PNG image content"
    files = {"file": ("receipt_canon.png", io.BytesIO(file_content), "image/png")}
    data = {"product_id": product_id}

    upload_res = client.post("/api/v1/documents/upload", data=data, files=files)
    assert upload_res.status_code == 201
    receipt = upload_res.json()
    assert receipt["file_name"] == "receipt_canon.png"
    assert receipt["mime_type"] == "image/png"
    assert receipt["product_id"] == product_id
    receipt_id = receipt["id"]

    # Get receipt details
    get_res = client.get(f"/api/v1/documents/{receipt_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == receipt_id


def test_document_upload_invalid_product(client):
    file_content = b"PDF receipt content"
    files = {"file": ("receipt.pdf", io.BytesIO(file_content), "application/pdf")}
    data = {"product_id": "non-existent-uuid"}

    res = client.post("/api/v1/documents/upload", data=data, files=files)
    assert res.status_code == 404
