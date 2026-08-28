import io
import html
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


def escape_text(text: str) -> str:
    if not text:
        return ""
    return html.escape(str(text))


def generate_resume_pdf(resume) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#2663eb")
    dark_color = colors.HexColor("#171c29")
    gray_color = colors.HexColor("#707a8c")
    line_color = colors.HexColor("#e3e8f0")

    name_style = ParagraphStyle(
        'ResumeName',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=primary_color,
        spaceAfter=4
    )

    title_style = ParagraphStyle(
        'ResumeTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=dark_color,
        spaceAfter=4
    )

    contact_style = ParagraphStyle(
        'ResumeContact',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=gray_color,
        spaceAfter=12
    )

    section_heading_style = ParagraphStyle(
        'ResumeSectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=primary_color,
        spaceBefore=10,
        spaceAfter=4
    )

    item_title_style = ParagraphStyle(
        'ResumeItemTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=dark_color
    )

    item_subtitle_style = ParagraphStyle(
        'ResumeItemSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=12,
        textColor=gray_color
    )

    body_style = ParagraphStyle(
        'ResumeBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=dark_color,
        spaceAfter=6
    )

    elements = []

    # 1. Header: Name & Title
    full_name = escape_text(resume.full_name)
    elements.append(Paragraph(full_name, name_style))

    if getattr(resume, 'title', None):
        elements.append(Paragraph(escape_text(resume.title), title_style))

    # Contact Details
    contact_parts = []
    if getattr(resume, 'email', None):
        contact_parts.append(escape_text(resume.email))
    if getattr(resume, 'phone', None):
        contact_parts.append(escape_text(resume.phone))

    if contact_parts:
        elements.append(Paragraph(" | ".join(contact_parts), contact_style))

    elements.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceBefore=2, spaceAfter=8))

    # 2. Professional Summary
    if getattr(resume, 'summary', None) and resume.summary.strip():
        elements.append(Paragraph("PROFESSIONAL SUMMARY", section_heading_style))
        elements.append(HRFlowable(width="100%", thickness=0.5, color=line_color, spaceBefore=1, spaceAfter=4))
        elements.append(Paragraph(escape_text(resume.summary), body_style))
        elements.append(Spacer(1, 4))

    # 3. Work Experience
    experiences = getattr(resume, 'experiences', [])
    if experiences:
        elements.append(Paragraph("WORK EXPERIENCE", section_heading_style))
        elements.append(HRFlowable(width="100%", thickness=0.5, color=line_color, spaceBefore=1, spaceAfter=6))

        for exp in experiences:
            company = escape_text(exp.company_name)
            role = escape_text(exp.role)

            start_str = exp.start_date.strftime("%b %Y") if hasattr(exp.start_date, 'strftime') else str(exp.start_date)
            if exp.is_current or not exp.end_date:
                end_str = "Present"
            else:
                end_str = exp.end_date.strftime("%b %Y") if hasattr(exp.end_date, 'strftime') else str(exp.end_date)
            date_range = f"{start_str} - {end_str}"

            # Role and Company header table
            row_data = [
                [
                    Paragraph(f"<b>{role}</b> &mdash; {company}", item_title_style),
                    Paragraph(f"<i>{date_range}</i>", ParagraphStyle('DateRight', parent=item_subtitle_style, alignment=2))
                ]
            ]
            t = Table(row_data, colWidths=[360, 172])
            t.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 0),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ]))
            elements.append(t)

            if exp.description and exp.description.strip():
                # Format bullet points if multiline
                desc_lines = [line.strip() for line in exp.description.split("\n") if line.strip()]
                for line in desc_lines:
                    clean_line = line.lstrip("-*•").strip()
                    elements.append(Paragraph(f"&bull; {escape_text(clean_line)}", body_style))
            elements.append(Spacer(1, 4))

    # 4. Education
    education = getattr(resume, 'education', [])
    if education:
        elements.append(Paragraph("EDUCATION", section_heading_style))
        elements.append(HRFlowable(width="100%", thickness=0.5, color=line_color, spaceBefore=1, spaceAfter=6))

        for edu in education:
            institution = escape_text(edu.institution)
            degree = escape_text(edu.degree)

            start_str = edu.start_date.strftime("%b %Y") if hasattr(edu.start_date, 'strftime') else str(edu.start_date)
            if edu.end_date:
                end_str = edu.end_date.strftime("%b %Y") if hasattr(edu.end_date, 'strftime') else str(edu.end_date)
                date_range = f"{start_str} - {end_str}"
            else:
                date_range = start_str

            row_data = [
                [
                    Paragraph(f"<b>{degree}</b> &mdash; {institution}", item_title_style),
                    Paragraph(f"<i>{date_range}</i>", ParagraphStyle('EduDateRight', parent=item_subtitle_style, alignment=2))
                ]
            ]
            t = Table(row_data, colWidths=[360, 172])
            t.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 0),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ]))
            elements.append(t)
            elements.append(Spacer(1, 4))

    # 5. Skills
    skills = getattr(resume, 'skills', [])
    if skills:
        elements.append(Paragraph("SKILLS", section_heading_style))
        elements.append(HRFlowable(width="100%", thickness=0.5, color=line_color, spaceBefore=1, spaceAfter=6))

        skill_names = []
        for s in skills:
            if isinstance(s, str):
                skill_names.append(escape_text(s))
            elif hasattr(s, 'skill_name'):
                skill_names.append(escape_text(s.skill_name))
            elif isinstance(s, dict) and 'skill_name' in s:
                skill_names.append(escape_text(s['skill_name']))

        skills_text = ", ".join(skill_names)
        elements.append(Paragraph(skills_text, body_style))

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
