import io
import uuid
import qrcode
from sqlalchemy.orm import Session
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from server import models, crud
from server.services.tiebreak_calculator import recalculate_standings


def generate_qr_code_bytes(url: str) -> bytes:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=4,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def generate_certificate_pdf(
    player_name: str,
    tournament_name: str,
    rank: int,
    total_points: float,
    verification_uuid: str,
    issued_at_str: str,
) -> bytes:
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=landscape(letter),
        rightMargin=0.5 * inch,
        leftMargin=0.5 * inch,
        topMargin=0.5 * inch,
        bottomMargin=0.5 * inch,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "CertTitle",
        parent=styles["Heading1"],
        fontSize=28,
        leading=34,
        textColor=colors.HexColor("#1E293B"),
        alignment=1,  # Center
    )
    subtitle_style = ParagraphStyle(
        "CertSubTitle",
        parent=styles["Normal"],
        fontSize=16,
        leading=22,
        textColor=colors.HexColor("#64748B"),
        alignment=1,
    )
    name_style = ParagraphStyle(
        "CertName",
        parent=styles["Heading2"],
        fontSize=24,
        leading=30,
        textColor=colors.HexColor("#6366F1"),
        alignment=1,
    )
    detail_style = ParagraphStyle(
        "CertDetail",
        parent=styles["Normal"],
        fontSize=14,
        leading=20,
        textColor=colors.HexColor("#334155"),
        alignment=1,
    )
    footer_style = ParagraphStyle(
        "CertFooter",
        parent=styles["Normal"],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#94A3B8"),
        alignment=1,
    )

    verify_url = f"http://localhost:5173/verify/cert/{verification_uuid}"
    qr_bytes = generate_qr_code_bytes(verify_url)
    qr_image = Image(io.BytesIO(qr_bytes), width=1.2 * inch, height=1.2 * inch)

    elements = [
        Spacer(1, 0.2 * inch),
        Paragraph("<b>CERTIFICATE OF ACHIEVEMENT</b>", title_style),
        Spacer(1, 0.15 * inch),
        Paragraph("This is proudly presented to", subtitle_style),
        Spacer(1, 0.2 * inch),
        Paragraph(f"<b>{player_name}</b>", name_style),
        Spacer(1, 0.2 * inch),
        Paragraph(
            f"for outstanding participation in <b>{tournament_name}</b>", detail_style
        ),
        Spacer(1, 0.1 * inch),
        Paragraph(
            f"Final Rank: <b>#{rank}</b> &nbsp;&nbsp;|&nbsp;&nbsp; Total Score: <b>{total_points:.1f} pts</b>",
            detail_style,
        ),
        Spacer(1, 0.25 * inch),
        qr_image,
        Spacer(1, 0.1 * inch),
        Paragraph(f"Date Issued: {issued_at_str}", footer_style),
        Paragraph(f"Verification UUID: {verification_uuid}", footer_style),
    ]

    doc.build(elements)
    return buf.getvalue()


def issue_certificates_for_tournament(
    tournament_id: uuid.UUID, db: Session
) -> List[models.Certificate]:
    tournament = crud.get_tournament(db, tournament_id)
    if not tournament:
        raise ValueError("Tournament not found")

    # Finalize standings
    standings = recalculate_standings(tournament_id, db)
    if not standings:
        raise ValueError("No player standings found for this tournament")

    certificates = []
    for st in standings:
        player = crud.get_player(db, st.player_id)
        if not player:
            continue

        existing_cert = (
            db.query(models.Certificate)
            .filter(
                models.Certificate.tournament_id == tournament_id,
                models.Certificate.player_id == player.id,
            )
            .first()
        )

        if not existing_cert:
            v_uuid = uuid.uuid4()
            verify_url = f"/api/v1/certificates/verify/{v_uuid}"
            cert = models.Certificate(
                verification_uuid=v_uuid,
                tournament_id=tournament_id,
                player_id=player.id,
                rank=st.rank or 1,
                total_points=st.total_points,
                qr_code_url=verify_url,
            )
            db.add(cert)
            certificates.append(cert)
        else:
            certificates.append(existing_cert)

    tournament.status = "COMPLETED"
    db.commit()
    return certificates
