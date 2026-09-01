import base64
import io
import os
from datetime import datetime, timezone
from typing import Optional
from jose import JWTError, jwt
import qrcode
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from server import models

SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY", "dev-secret-change-in-production-prison-visitor-mgmt-2026"
)
ALGORITHM = "HS256"


def generate_pass_token(
    appointment_id: str,
    visitor_id: str,
    inmate_id: str,
    visit_date: str,
    expires_at: datetime,
) -> str:
    now_ts = int(datetime.now(timezone.utc).timestamp())
    exp_ts = int(expires_at.timestamp())
    payload = {
        "appointment_id": appointment_id,
        "visitor_id": visitor_id,
        "inmate_id": inmate_id,
        "visit_date": str(visit_date),
        "exp": exp_ts,
        "iat": now_ts,
        "type": "DIGITAL_VISITOR_PASS",
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def verify_pass_token(token: str) -> Optional[dict]:
    try:
        # Decode without automatic exp failure so gate route can return specific expiration error
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={"verify_exp": False},
        )
        if payload.get("type") != "DIGITAL_VISITOR_PASS":
            return None
        return payload
    except JWTError:
        return None


def generate_qr_code_data_url(data: str) -> str:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    base64_encoded = base64.b64encode(buf.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{base64_encoded}"


def generate_pdf_pass_bytes(appointment: models.Appointment, pass_token: str) -> bytes:
    buf = io.BytesIO()
    p = canvas.Canvas(buf, pagesize=letter)
    width, height = letter

    # Header / Border
    p.setStrokeColorRGB(0.12, 0.23, 0.54)
    p.setLineWidth(3)
    p.roundRect(30, 30, width - 60, height - 60, 10, stroke=1, fill=0)

    p.setFillColorRGB(0.12, 0.23, 0.54)
    p.rect(30, height - 110, width - 60, 80, stroke=0, fill=1)

    p.setFillColorRGB(1, 1, 1)
    p.setFont("Helvetica-Bold", 22)
    p.drawCentredString(width / 2.0, height - 65, "PRISON VISITATION DIGITAL PASS")
    p.setFont("Helvetica", 12)
    p.drawCentredString(
        width / 2.0, height - 90, "Automated Gate Control & Express Clearance"
    )

    # Details
    p.setFillColorRGB(0, 0, 0)
    p.setFont("Helvetica-Bold", 14)
    y = height - 160

    visitor_name = appointment.visitor.full_name if appointment.visitor else "Unknown"
    visitor_id_num = appointment.visitor.national_id if appointment.visitor else "N/A"
    inmate_name = appointment.inmate.full_name if appointment.inmate else "Unknown"
    inmate_num = appointment.inmate.inmate_number if appointment.inmate else "N/A"
    cell = appointment.inmate.cell_location if appointment.inmate else "N/A"

    details = [
        ("Pass ID / Appt ID:", str(appointment.id)),
        ("Visitor Name:", f"{visitor_name} (ID: {visitor_id_num})"),
        (
            "Visitor Type:",
            str(
                appointment.visitor.visitor_type if appointment.visitor else "STANDARD"
            ),
        ),
        ("Inmate Name:", f"{inmate_name} ({inmate_num})"),
        ("Cell Location:", cell),
        ("Visit Date:", str(appointment.visit_date)),
        ("Start Time:", str(appointment.start_time)),
        ("Duration:", f"{appointment.slot_duration_minutes} Minutes"),
        ("Relationship:", str(appointment.relationship)),
        ("Security Clearance:", str(appointment.security_flag_status)),
    ]

    for label, val in details:
        p.setFont("Helvetica-Bold", 11)
        p.drawString(60, y, label)
        p.setFont("Helvetica", 11)
        p.drawString(220, y, val)
        y -= 25

    # QR Code insertion
    qr = qrcode.QRCode(box_size=6, border=2)
    qr.add_data(pass_token)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    img_buf = io.BytesIO()
    img.save(img_buf, format="PNG")
    img_buf.seek(0)

    qr_reader = ImageReader(img_buf)
    p.drawImage(qr_reader, width / 2.0 - 80, y - 180, width=160, height=160)

    p.setFont("Helvetica-Oblique", 9)
    p.setFillColorRGB(0.3, 0.3, 0.3)
    p.drawCentredString(
        width / 2.0,
        y - 200,
        "Present this QR code at Security Gate Scanner for Express Check-In (<2s)",
    )

    p.showPage()
    p.save()
    buf.seek(0)
    return buf.getvalue()
