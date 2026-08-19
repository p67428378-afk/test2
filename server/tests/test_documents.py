import io
from datetime import date


def test_upload_and_get_document(client):
    today = date.today().isoformat()
    # Create product
    product_res = client.post(
        "/api/v1/products",
        json={
            "product_name": "Apple MacBook Pro 16",
            "serial_number": "MBP16-2026-X1",
            "brand": "Apple",
            "category": "Computers",
            "purchase_date": today,
            "duration_months": 12,
        },
    )
    product_id = product_res.json()["id"]

    # Upload receipt document
    file_content = b"%PDF-1.4 Mock Receipt Document Content for Warranty"
    file_tuple = ("receipt.pdf", io.BytesIO(file_content), "application/pdf")

    upload_res = client.post(
        "/api/v1/documents/upload",
        data={"product_id": product_id},
        files={"file": file_tuple},
    )
    assert upload_res.status_code == 201
    doc_data = upload_res.json()
    assert doc_data["file_name"] == "receipt.pdf"
    assert doc_data["mime_type"] == "application/pdf"
    receipt_id = doc_data["id"]

    # Get document details
    get_res = client.get(f"/api/v1/documents/{receipt_id}")
    assert get_res.status_code == 200
    assert get_res.json()["product_id"] == product_id

    # Download document file
    download_res = client.get(f"/api/v1/documents/{receipt_id}/file")
    assert download_res.status_code == 200
    assert download_res.content == file_content
