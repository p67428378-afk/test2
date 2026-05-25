from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from app.schemas.form16a import Form16ARequest
from app.services import cbs_service, traces_service, digital_signature_service, pdf_service

router = APIRouter()

@router.post("/generate", response_class=Response)
def generate_form16a(request: Form16ARequest):
    try:
        cbs_data = cbs_service.fetch_tds_data(request.customerPan, request.financialYear)
        traces_pdf = traces_service.download_form16a(request.customerPan, request.financialYear)
        
        # In a real implementation, we would extract data from the TRACES PDF.
        # For now, we'll use a mock dictionary.
        traces_data = {"tds_amount": 9800.0} 

        reconciliation_summary_pdf = pdf_service.generate_reconciliation_summary(cbs_data, traces_data)
        
        signed_form16a = digital_signature_service.sign_pdf(traces_pdf)

        final_pdf = pdf_service.merge_pdfs(signed_form16a, reconciliation_summary_pdf)

        return Response(content=final_pdf, media_type="application/pdf")

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
