from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

def test_generate_form16a_success(client: TestClient):
    with patch('app.services.cbs_service.fetch_tds_data') as mock_fetch_tds, \
         patch('app.services.traces_service.download_form16a') as mock_download_form16a, \
         patch('app.services.digital_signature_service.sign_pdf') as mock_sign_pdf, \
         patch('app.services.pdf_service.generate_reconciliation_summary') as mock_generate_summary, \
         patch('app.services.pdf_service.merge_pdfs') as mock_merge_pdfs:

        mock_fetch_tds.return_value = {"tds_amount": 10000.0}
        mock_download_form16a.return_value = b"traces_pdf_content"
        mock_generate_summary.return_value = b"summary_pdf_content"
        mock_sign_pdf.return_value = b"signed_pdf_content"
        mock_merge_pdfs.return_value = b"final_pdf_content"

        response = client.post("/api/v1/form16a/generate", json={"customerPan": "ABCDE1234F", "financialYear": "2023-2024"})

        assert response.status_code == 200
        assert response.headers['content-type'] == 'application/pdf'
        assert response.content == b"final_pdf_content"

def test_generate_form16a_invalid_pan(client: TestClient):
    response = client.post("/api/v1/form16a/generate", json={"customerPan": "INVALIDPAN", "financialYear": "2023-2024"})
    assert response.status_code == 422 # pydantic validation error is 422


def test_generate_form16a_invalid_fy(client: TestClient):
    response = client.post("/api/v1/form16a/generate", json={"customerPan": "ABCDE1234F", "financialYear": "2023/2024"})
    assert response.status_code == 422 # pydantic validation error is 422
