from sqlalchemy.orm import Session
from app.models.interest_certificate import InterestCertificate
from app.schemas.interest_certificate import InterestCertificateCreate
from app.core.config import settings
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io

class InterestCertificateService:
    def get_interest_data(self, customer_id: str, financial_year: str):
        # This is a mock implementation. In a real application, this would fetch data from a core banking system.
        if customer_id == "CUST12345":
            return {"savings_interest": 5000, "fd_interest": 15000}
        elif customer_id == "CUST_NO_INTEREST":
            return None
        else:
            return None

    def calculate_tds(self, total_interest: float) -> float:
        return total_interest * settings.TDS_RATE

    def generate_pdf(self, certificate_data: dict) -> bytes:
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)

        p.drawString(100, 750, f"Interest Certificate for Financial Year {certificate_data['financial_year']}")
        p.drawString(100, 730, f"Customer ID: {certificate_data['customer_id']}")
        p.drawString(100, 700, f"Total Interest from Savings: {certificate_data['savings_interest']}")
        p.drawString(100, 680, f"Total Interest from FDs: {certificate_data['fd_interest']}")
        p.drawString(100, 660, f"Total Interest: {certificate_data['total_interest']}")
        p.drawString(100, 640, f"Total TDS Deducted: {certificate_data['tds_deducted']}")
        p.drawString(100, 620, f"Net Interest: {certificate_data['net_interest']}")

        p.showPage()
        p.save()

        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes

    def create_certificate(self, db: Session, certificate: InterestCertificateCreate) -> InterestCertificate:
        db_certificate = InterestCertificate(**certificate.dict())
        db.add(db_certificate)
        db.commit()
        db.refresh(db_certificate)
        return db_certificate

interest_certificate_service = InterestCertificateService()
