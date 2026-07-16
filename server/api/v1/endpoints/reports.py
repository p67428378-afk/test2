from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from server import crud
from server.database import get_db
import io

router = APIRouter()

@router.get("/reports/conservation")
def generate_conservation_report(db: Session = Depends(get_db)):
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors
    except ImportError:
        raise HTTPException(status_code=500, detail="Report generation library (reportlab) is not installed.")

    # Fetch data
    animals = crud.get_animals(db)
    zones = crud.get_protected_zones(db)
    exams = crud.get_health_examinations(db, limit=10)

    # Create PDF in memory
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    story = []

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'ReportTitle',
        parent=styles['Heading1'],
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#10B981'), # EcoTrack Emerald
        spaceAfter=12
    )
    
    subtitle_style = ParagraphStyle(
        'ReportSubtitle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#64748B'),
        spaceAfter=24
    )

    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'ReportBody',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#334155')
    )

    # Title
    story.append(Paragraph("EcoTrack Conservation Report", title_style))
    story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | System: Wildlife Conservation Management System", subtitle_style))
    story.append(Spacer(1, 12))

    # Animals Section
    story.append(Paragraph("Tracked Animals Summary", heading_style))
    animal_data = [["Name", "Species", "GPS Tag ID"]]
    for animal in animals:
        animal_data.append([animal.name, animal.species, animal.gps_tag_id])
    
    if len(animal_data) > 1:
        t_animals = Table(animal_data, colWidths=[150, 150, 200])
        t_animals.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1E293B')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#FFFFFF')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
        ]))
        story.append(t_animals)
    else:
        story.append(Paragraph("No tracked animals registered in the system.", body_style))
    
    story.append(Spacer(1, 18))

    # Protected Zones Section
    story.append(Paragraph("Protected Zones", heading_style))
    zone_data = [["Zone Name", "Area Definition"]]
    for zone in zones:
        zone_data.append([zone.name, zone.area[:50] + "..." if len(zone.area) > 50 else zone.area])
    
    if len(zone_data) > 1:
        t_zones = Table(zone_data, colWidths=[150, 350])
        t_zones.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1E293B')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#FFFFFF')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
        ]))
        story.append(t_zones)
    else:
        story.append(Paragraph("No protected zones defined in the system.", body_style))

    story.append(Spacer(1, 18))

    # Health Exams Section
    story.append(Paragraph("Recent Health Examinations", heading_style))
    exam_data = [["Animal", "Date", "Veterinarian", "Status", "Notes"]]
    for exam in exams:
        exam_data.append([
            exam.animal.name if exam.animal else "Unknown",
            exam.examination_date.strftime('%Y-%m-%d'),
            exam.veterinarian,
            exam.health_status,
            exam.notes or ""
        ])
    
    if len(exam_data) > 1:
        t_exams = Table(exam_data, colWidths=[80, 80, 100, 80, 160])
        t_exams.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1E293B')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#FFFFFF')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
        ]))
        story.append(t_exams)
    else:
        story.append(Paragraph("No health examinations recorded in the system.", body_style))

    # Build PDF
    doc.build(story)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=conservation_report.pdf"}
    )

from datetime import datetime
