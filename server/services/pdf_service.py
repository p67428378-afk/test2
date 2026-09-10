import io
from typing import Dict, Any, List
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)


def generate_resume_pdf(data: Dict[str, Any]) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    story = []
    styles = getSampleStyleSheet()

    template_id = data.get("template_id", "classic")

    # Palette definition based on template
    if template_id == "modern":
        primary_color = colors.HexColor("#4F46E5")  # Indigo
        text_color = colors.HexColor("#1E293B")
        line_color = colors.HexColor("#4F46E5")
    elif template_id == "executive":
        primary_color = colors.HexColor("#0F172A")  # Slate dark
        text_color = colors.HexColor("#334155")
        line_color = colors.HexColor("#0F172A")
    elif template_id == "creative":
        primary_color = colors.HexColor("#0284C7")  # Sky blue
        text_color = colors.HexColor("#1E293B")
        line_color = colors.HexColor("#0284C7")
    else:  # classic or minimalist
        primary_color = colors.HexColor("#111827")
        text_color = colors.HexColor("#374151")
        line_color = colors.HexColor("#9CA3AF")

    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=primary_color,
        alignment=0,
    )
    contact_style = ParagraphStyle(
        "DocContact",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#64748B"),
        alignment=0,
    )
    heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        textColor=primary_color,
        spaceBefore=10,
        spaceAfter=4,
    )
    item_title_style = ParagraphStyle(
        "ItemTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=13,
        textColor=text_color,
    )
    item_subtitle_style = ParagraphStyle(
        "ItemSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#475569"),
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=text_color,
    )
    bullet_style = ParagraphStyle(
        "Bullet",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=text_color,
        leftIndent=12,
        firstLineIndent=-8,
    )

    # 1. Header: Name & Contact Info
    user_name = data.get("user_name", "Your Name")
    story.append(Paragraph(user_name, title_style))
    story.append(Spacer(1, 4))

    contact_parts = []
    if data.get("email"):
        contact_parts.append(str(data["email"]))
    if data.get("phone"):
        contact_parts.append(str(data["phone"]))
    if data.get("portfolio_url"):
        contact_parts.append(str(data["portfolio_url"]))

    if contact_parts:
        contact_text = " • ".join(contact_parts)
        story.append(Paragraph(contact_text, contact_style))

    story.append(Spacer(1, 6))
    story.append(
        HRFlowable(width="100%", thickness=1.5, color=line_color, spaceAfter=8)
    )

    # 2. Work Experience
    experiences: List[Any] = data.get("experiences", [])
    if experiences:
        story.append(Paragraph("WORK EXPERIENCE", heading_style))
        story.append(
            HRFlowable(width="100%", thickness=0.5, color=line_color, spaceAfter=6)
        )
        for exp in experiences:
            if isinstance(exp, dict):
                role = exp.get("role", "")
                company = exp.get("company", "")
                start = exp.get("start_date", "")
                end = exp.get("end_date", "Present")
                date_str = f"{start} - {end}".strip(" -")

                header_line = f"<b>{role}</b>" if role else ""
                if company:
                    header_line = (
                        f"{header_line} | {company}"
                        if header_line
                        else f"<b>{company}</b>"
                    )

                row_data = [
                    [
                        Paragraph(header_line, item_title_style),
                        Paragraph(date_str, item_subtitle_style),
                    ]
                ]
                t = Table(row_data, colWidths=[380, 160])
                t.setStyle(
                    TableStyle(
                        [
                            ("VALIGN", (0, 0), (-1, -1), "TOP"),
                            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                            ("LEFTPADDING", (0, 0), (-1, -1), 0),
                            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                            ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
                        ]
                    )
                )
                story.append(t)

                desc = exp.get("description", "")
                if desc:
                    story.append(Paragraph(desc, body_style))

                bullets = exp.get("bullets", [])
                if isinstance(bullets, list):
                    for b in bullets:
                        if b:
                            story.append(Paragraph(f"• {b}", bullet_style))
                story.append(Spacer(1, 6))

    # 3. Education
    education: List[Any] = data.get("education", [])
    if education:
        story.append(Paragraph("EDUCATION", heading_style))
        story.append(
            HRFlowable(width="100%", thickness=0.5, color=line_color, spaceAfter=6)
        )
        for edu in education:
            if isinstance(edu, dict):
                degree = edu.get("degree", "")
                field = edu.get("field_of_study", "")
                institution = edu.get("institution", "")
                start = edu.get("start_date", "")
                end = edu.get("end_date", "")
                date_str = f"{start} - {end}".strip(" -")

                deg_str = f"<b>{degree}</b>" if degree else ""
                if field:
                    deg_str = f"{deg_str} in {field}" if deg_str else f"<b>{field}</b>"
                if institution:
                    deg_str = f"{deg_str} — {institution}" if deg_str else institution

                row_data = [
                    [
                        Paragraph(deg_str, item_title_style),
                        Paragraph(date_str, item_subtitle_style),
                    ]
                ]
                t = Table(row_data, colWidths=[380, 160])
                t.setStyle(
                    TableStyle(
                        [
                            ("VALIGN", (0, 0), (-1, -1), "TOP"),
                            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                            ("LEFTPADDING", (0, 0), (-1, -1), 0),
                            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                            ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
                        ]
                    )
                )
                story.append(t)
                story.append(Spacer(1, 4))

    # 4. Skills
    skills = data.get("skills", [])
    if skills:
        story.append(Paragraph("SKILLS", heading_style))
        story.append(
            HRFlowable(width="100%", thickness=0.5, color=line_color, spaceAfter=6)
        )
        if isinstance(skills, list):
            skill_strings = [str(s) for s in skills if s]
            skill_text = " • ".join(skill_strings)
            story.append(Paragraph(skill_text, body_style))
        elif isinstance(skills, str):
            story.append(Paragraph(skills, body_style))
        story.append(Spacer(1, 6))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
