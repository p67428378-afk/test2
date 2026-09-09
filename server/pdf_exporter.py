import io
from typing import Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


def generate_routine_pdf(routine: Any) -> bytes:
    """Generate a formatted printable PDF cheat-sheet for a yoga routine."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "RoutineTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#1E4A4A"),
        spaceAfter=6,
    )

    subtitle_style = ParagraphStyle(
        "RoutineSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#4A5568"),
        spaceAfter=14,
    )

    heading2_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#2C7A7B"),
        spaceBefore=10,
        spaceAfter=8,
    )

    cell_bold_style = ParagraphStyle(
        "CellBold",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=12,
        textColor=colors.HexColor("#1A202C"),
    )

    cell_normal_style = ParagraphStyle(
        "CellNormal",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#2D3748"),
    )

    cell_italic_style = ParagraphStyle(
        "CellItalic",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#718096"),
    )

    story = []

    # Title & Description
    story.append(Paragraph(f"🧘 {routine.name}", title_style))
    desc = routine.description or "Personalized Yoga Sequence Flow"
    total_mins = routine.total_duration_seconds // 60
    total_secs = routine.total_duration_seconds % 60
    duration_str = (
        f"{total_mins}m {total_secs}s" if total_mins > 0 else f"{total_secs}s"
    )
    num_poses = len(routine.poses) if routine.poses else 0

    story.append(
        Paragraph(
            f"<b>Total Duration:</b> {duration_str} &nbsp;|&nbsp; <b>Total Poses:</b> {num_poses}<br/>"
            f"<i>{desc}</i>",
            subtitle_style,
        )
    )
    story.append(Spacer(1, 10))

    # Pose Sequence Table
    story.append(Paragraph("Sequence Breakdown & Alignment Guide", heading2_style))

    table_data = [
        [
            Paragraph("<b>#</b>", cell_bold_style),
            Paragraph("<b>Pose & Sanskrit</b>", cell_bold_style),
            Paragraph("<b>Details</b>", cell_bold_style),
            Paragraph("<b>Hold Time</b>", cell_bold_style),
            Paragraph("<b>Alignment Cues & Notes</b>", cell_bold_style),
        ]
    ]

    for idx, rp in enumerate(routine.poses or []):
        pose = rp.pose
        seq_num = str(rp.sequence_order or (idx + 1))
        pose_name = pose.english_name if pose else "Custom Pose"
        sanskrit = pose.sanskrit_name if (pose and pose.sanskrit_name) else ""
        diff_cat = f"{pose.difficulty} • {pose.category}" if pose else ""
        hold_time = f"{rp.hold_duration_seconds}s"

        cues = pose.alignment_cues if (pose and pose.alignment_cues) else ""
        notes = rp.transition_notes if rp.transition_notes else ""
        guide_text = ""
        if cues:
            guide_text += f"<b>Cues:</b> {cues}<br/>"
        if notes:
            guide_text += f"<b>Transition:</b> <i>{notes}</i>"
        if not guide_text:
            guide_text = "Maintain steady breathing and focus."

        pose_cell = f"<b>{pose_name}</b>"
        if sanskrit:
            pose_cell += f"<br/><i>{sanskrit}</i>"

        table_data.append(
            [
                Paragraph(seq_num, cell_bold_style),
                Paragraph(pose_cell, cell_normal_style),
                Paragraph(diff_cat, cell_italic_style),
                Paragraph(hold_time, cell_bold_style),
                Paragraph(guide_text, cell_normal_style),
            ]
        )

    # Column widths total 540pt (letter width is 612 - 72 = 540)
    col_widths = [25, 120, 85, 55, 255]
    pose_table = Table(table_data, colWidths=col_widths, repeatRows=1)
    pose_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E6FFFA")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#234E52")),
                ("ALIGN", (0, 0), (0, -1), "CENTER"),
                ("ALIGN", (3, 0), (3, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E0")),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [colors.white, colors.HexColor("#F7FAFC")],
                ),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )

    story.append(pose_table)
    story.append(Spacer(1, 15))

    footer_style = ParagraphStyle(
        "Footer",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        textColor=colors.HexColor("#A0AEC0"),
        alignment=1,  # Centered
    )
    story.append(
        Paragraph(
            "Generated by YogaFlow Studio &mdash; Safe, mindful practice wherever you are.",
            footer_style,
        )
    )

    doc.build(story)
    return buffer.getvalue()
