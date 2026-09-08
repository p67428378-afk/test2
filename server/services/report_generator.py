import csv
import io
from typing import List, Dict, Any, Optional
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors


def generate_csv_report(transactions: List[Any], summary: Dict[str, Any]) -> str:
    output = io.StringIO()
    writer = csv.writer(output)

    # Header / Summary Section
    writer.writerow(["=== EXPENSE TRACKER FINANCIAL REPORT ==="])
    writer.writerow([])
    writer.writerow(["Financial Summary"])
    writer.writerow(["Total Income", f"${summary.get('total_income', 0.0):.2f}"])
    writer.writerow(["Total Expense", f"${summary.get('total_expense', 0.0):.2f}"])
    writer.writerow(["Net Balance", f"${summary.get('net_balance', 0.0):.2f}"])
    writer.writerow([])

    # Category Breakdown
    writer.writerow(["Category Spending Breakdown"])
    writer.writerow(["Category", "Amount Spent", "Percentage"])
    for item in summary.get("category_breakdown", []):
        cat_name = (
            item.get("category_name") if isinstance(item, dict) else item.category_name
        )
        amt = item.get("amount") if isinstance(item, dict) else item.amount
        pct = item.get("percentage") if isinstance(item, dict) else item.percentage
        writer.writerow([cat_name, f"${amt:.2f}", f"{pct:.1f}%"])
    writer.writerow([])

    # Transactions Log
    writer.writerow(["Detailed Transaction Log"])
    writer.writerow(
        [
            "Date",
            "Type",
            "Category",
            "Payment Method",
            "Amount",
            "Description",
            "Receipt URL",
        ]
    )
    for tx in transactions:
        date_str = str(tx.date)
        tx_type = tx.transaction_type
        cat_name = (
            tx.category.name if getattr(tx, "category", None) else "Uncategorized"
        )
        pm = tx.payment_method
        amount_str = f"${tx.amount:.2f}"
        desc = tx.description or ""
        receipt = tx.receipt_url or ""
        writer.writerow([date_str, tx_type, cat_name, pm, amount_str, desc, receipt])

    return output.getvalue()


def generate_pdf_report(
    transactions: List[Any],
    summary: Dict[str, Any],
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )
    elements = []
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        name="ReportTitle",
        parent=styles["Heading1"],
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#0F172A"),
        alignment=0,
    )
    subtitle_style = ParagraphStyle(
        name="ReportSubtitle",
        parent=styles["Normal"],
        fontSize=10,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=12,
    )
    heading_style = ParagraphStyle(
        name="SectionHeading",
        parent=styles["Heading2"],
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#1E293B"),
        spaceBefore=10,
        spaceAfter=6,
    )
    normal_style = styles["Normal"]

    # Title
    elements.append(Paragraph("FinTrack Pro - Expense & Financial Report", title_style))
    date_range_str = (
        f"Date Range: {start_date or 'All time'} to {end_date or 'Present'}"
    )
    elements.append(Paragraph(date_range_str, subtitle_style))
    elements.append(Spacer(1, 10))

    # Summary Table
    elements.append(Paragraph("Financial Summary", heading_style))
    total_inc = summary.get("total_income", 0.0)
    total_exp = summary.get("total_expense", 0.0)
    net_bal = summary.get("net_balance", 0.0)

    summary_data = [
        ["Metric", "Amount ($)"],
        ["Total Income", f"+${total_inc:,.2f}"],
        ["Total Expense", f"-${total_exp:,.2f}"],
        ["Net Balance", f"${net_bal:,.2f}"],
    ]
    summary_table = Table(summary_data, colWidths=[200, 200])
    summary_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F172A")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("BACKGROUND", (0, 1), (-1, 1), colors.HexColor("#F0FDF4")),
                ("BACKGROUND", (0, 2), (-1, 2), colors.HexColor("#FEF2F2")),
                ("BACKGROUND", (0, 3), (-1, 3), colors.HexColor("#EFF6FF")),
            ]
        )
    )
    elements.append(summary_table)
    elements.append(Spacer(1, 15))

    # Category Breakdown Table
    breakdown_list = summary.get("category_breakdown", [])
    if breakdown_list:
        elements.append(Paragraph("Expense Category Breakdown", heading_style))
        cat_data = [["Category", "Amount ($)", "Percentage (%)"]]
        for item in breakdown_list:
            cat_name = (
                item.get("category_name")
                if isinstance(item, dict)
                else item.category_name
            )
            amt = item.get("amount") if isinstance(item, dict) else item.amount
            pct = item.get("percentage") if isinstance(item, dict) else item.percentage
            cat_data.append([str(cat_name), f"${amt:,.2f}", f"{pct:.1f}%"])

        cat_table = Table(cat_data, colWidths=[200, 150, 150])
        cat_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#334155")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, -1), 9),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ]
            )
        )
        elements.append(cat_table)
        elements.append(Spacer(1, 15))

    # Transaction Log Table
    elements.append(Paragraph("Transaction Records", heading_style))
    tx_data = [
        ["Date", "Type", "Category", "Payment Method", "Amount ($)", "Description"]
    ]
    for tx in transactions[:100]:  # Cap at 100 rows for clean PDF page limits
        date_str = str(tx.date)
        tx_type = tx.transaction_type
        cat_name = tx.category.name if getattr(tx, "category", None) else "None"
        pm = tx.payment_method
        amt_str = f"${tx.amount:,.2f}"
        desc = (
            (tx.description[:30] + "...")
            if tx.description and len(tx.description) > 30
            else (tx.description or "-")
        )
        tx_data.append([date_str, tx_type, cat_name, pm, amt_str, desc])

    if len(tx_data) == 1:
        tx_data.append(["No transactions recorded for this period", "", "", "", "", ""])

    tx_table = Table(tx_data, colWidths=[70, 60, 100, 90, 80, 140])
    tx_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F172A")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ]
        )
    )
    elements.append(tx_table)

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
