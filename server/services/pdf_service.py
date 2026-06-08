import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

class PDFService:
    @staticmethod
    def generate_balance_certificate(account_number: str, account_details: dict, purpose: str) -> bytes:
        """
        Generates a PDF balance certificate on bank letterhead.
        Returns the PDF as bytes.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=54,
            leftMargin=54,
            topMargin=54,
            bottomMargin=54
        )

        story = []
        styles = getSampleStyleSheet()

        # Custom styles
        title_style = ParagraphStyle(
            'LetterheadTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=24,
            leading=28,
            textColor=colors.HexColor('#004ac6'),
            alignment=1  # Centered
        )
        subtitle_style = ParagraphStyle(
            'LetterheadSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#565e74'),
            alignment=1  # Centered
        )
        cert_title_style = ParagraphStyle(
            'CertTitle',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=16,
            leading=20,
            textColor=colors.HexColor('#191c1e'),
            alignment=1,
            spaceAfter=20
        )
        body_style = ParagraphStyle(
            'CertBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=11,
            leading=16,
            textColor=colors.HexColor('#191c1e'),
            spaceAfter=15
        )
        bold_body_style = ParagraphStyle(
            'CertBodyBold',
            parent=body_style,
            fontName='Helvetica-Bold'
        )

        # 1. Letterhead Header
        story.append(Paragraph("APEX BANK", title_style))
        story.append(Paragraph("Wealth Management & Retail Banking Services", subtitle_style))
        story.append(Paragraph("Head Office: Mumbai, Maharashtra, India | Email: support@apexbank.com", subtitle_style))
        story.append(Spacer(1, 15))

        # Decorative line
        line_data = [['']]
        line_table = Table(line_data, colWidths=[504], rowHeights=[2])
        line_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#004ac6')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
        ]))
        story.append(line_table)
        story.append(Spacer(1, 25))

        # 2. Certificate Title
        story.append(Paragraph("TO WHOMSOEVER IT MAY CONCERN", cert_title_style))
        story.append(Paragraph(f"<b>Date:</b> {datetime.now().strftime('%d-%B-%Y')}", body_style))
        story.append(Spacer(1, 10))

        # 3. Certificate Body
        intro_text = (
            f"This is to certify that <b>{account_details['account_holder_name']}</b> is a valued customer of Apex Bank, "
            f"maintaining the following account with our <b>{account_details['branch']}</b>."
        )
        story.append(Paragraph(intro_text, body_style))
        story.append(Spacer(1, 10))

        # 4. Account Details Table
        data = [
            [Paragraph("<b>Account Number</b>", bold_body_style), Paragraph(account_number, body_style)],
            [Paragraph("<b>Account Type</b>", bold_body_style), Paragraph(account_details['account_type'], body_style)],
            [Paragraph("<b>Current Balance</b>", bold_body_style), Paragraph(f"{account_details['currency']} {account_details['balance']:,.2f}", body_style)],
            [Paragraph("<b>Purpose of Certificate</b>", bold_body_style), Paragraph(purpose, body_style)],
            [Paragraph("<b>Status</b>", bold_body_style), Paragraph("Active / Clear", body_style)]
        ]
        
        table = Table(data, colWidths=[200, 304])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f2f4f6')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#eceef0')),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        story.append(table)
        story.append(Spacer(1, 20))

        # 5. Compliance & Guidelines text
        compliance_text = (
            "This certificate is issued at the specific request of the customer without any risk, "
            "responsibility, or guarantee on the part of the Bank or any of its signing officers. "
            "This document is generated and digitally signed in compliance with the Information Technology Act, 2000 "
            "and adheres to the RBI Customer Service Guidelines."
        )
        story.append(Paragraph(compliance_text, body_style))
        story.append(Spacer(1, 30))

        # 6. Signatory & Seal Section
        sig_data = [
            [
                Paragraph("<b>[ BANK SEAL ]</b><br/><font color='#5c647a'>Apex Bank Ltd.<br/>Mumbai Branch</font>", body_style),
                Paragraph("<b>Authorized Signatory</b><br/><font color='#5c647a'>Digitally Signed by:<br/>Manager, Customer Services<br/>Apex Bank Ltd.</font>", body_style)
            ]
        ]
        sig_table = Table(sig_data, colWidths=[250, 254])
        sig_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ]))
        story.append(sig_table)

        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
