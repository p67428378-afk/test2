from sqlalchemy.orm import Session
from . import models, schemas
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization

# Mock CBS function
def get_account_details_from_cbs(account_number: str):
    # In a real scenario, this would call the Core Banking System
    return {"balance": 10000.50, "vintage": "5 years"}

def generate_pdf_certificate(request: schemas.CertificateRequest, account_details: dict):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)

    # Bank Letterhead
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, 750, "Architectural Anchor Bank")

    p.setFont("Helvetica", 12)
    p.drawString(100, 700, f"Date: {request.requestTimestamp.strftime('%Y-%m-%d')}")
    p.drawString(100, 680, f"Account Number: {request.accountNumber}")
    p.drawString(100, 660, f"Purpose: {request.purpose.value}")

    p.drawString(100, 600, "This is to certify that the balance in the account is:")
    p.setFont("Helvetica-Bold", 14)
    p.drawString(150, 580, f"${account_details['balance']:.2f}")

    p.setFont("Helvetica", 12)
    p.drawString(100, 540, f"Account Vintage: {account_details['vintage']}")

    # Bank Seal and Signature (placeholders)
    p.drawString(100, 200, "Bank Seal")
    p.drawString(400, 200, "Authorized Signatory")

    p.showPage()
    p.save()

    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

def sign_pdf(pdf_bytes: bytes):
    # This is a mock signing process. In a real scenario, you would use a proper
    # digital signature provider and key management.
    try:
        with open("private_key.pem", "rb") as key_file:
            private_key = serialization.load_pem_private_key(
                key_file.read(),
                password=None,
            )
    except FileNotFoundError:
        # If key doesn't exist, create one for testing
        from cryptography.hazmat.primitives.asymmetric import rsa
        private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        with open("private_key.pem", "wb") as f:
            f.write(private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ))

    signature = private_key.sign(
        pdf_bytes,
        padding.PKCS1v15(),
        hashes.SHA256()
    )
    # In a real implementation, the signature would be embedded in the PDF structure.
    # For this example, we'll just append it.
    return pdf_bytes + b"\n---SIGNATURE---" + signature

def create_certificate_request(db: Session, request: schemas.CertificateRequestCreate):
    db_request = models.CertificateRequest(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request
