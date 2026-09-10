import io

import pytest
from pypdf import PdfWriter

from server.app.services.email_parser import (
    create_excerpt,
    parse_eml_content,
    parse_pdf_content,
    parse_txt_content,
    parse_uploaded_file,
)


def test_create_excerpt_short_and_long():
    # AC: View metadata, excerpt generation
    short_text = "Hello world"
    assert create_excerpt(short_text) == "Hello world"

    long_text = "A " * 150
    excerpt = create_excerpt(long_text, max_length=50)
    assert len(excerpt) <= 53  # 50 chars + "..."
    assert excerpt.endswith("...")


def test_parse_eml_content_rfc822():
    # AC: Support .eml file parsing
    eml_raw = (
        b"From: alice@example.com\r\n"
        b"Subject: Urgent: Quarterly Budget Review\r\n"
        b"Content-Type: text/plain; charset=utf-8\r\n\r\n"
        b"Please review the Q3 budget allocations as soon as possible."
    )
    sender, subject, body = parse_eml_content(eml_raw)
    assert sender == "alice@example.com"
    assert subject == "Urgent: Quarterly Budget Review"
    assert "Please review the Q3 budget" in body


def test_parse_txt_content_with_headers():
    # AC: Support .txt file parsing
    txt_raw = (
        b"From: bob@company.com\n"
        b"Subject: Team Lunch Tomorrow\n\n"
        b"Hey everyone, let's grab lunch tomorrow at noon."
    )
    sender, subject, body = parse_txt_content(txt_raw)
    assert sender == "bob@company.com"
    assert subject == "Team Lunch Tomorrow"
    assert "Hey everyone, let's grab lunch" in body


def test_parse_pdf_content_pypdf():
    # AC: Support .pdf file parsing
    writer = PdfWriter()
    page = writer.add_blank_page(width=300, height=300)
    # We can write a stream or create a minimal PDF with text
    # In pypdf, creating text requires standard pdf canvas or stream
    # Let's test parse_pdf_content with a generated PDF having text if possible
    # or test error handling on empty PDF
    pdf_buffer = io.BytesIO()
    writer.write(pdf_buffer)
    pdf_bytes = pdf_buffer.getvalue()

    # Empty blank page raises ValueError for no readable text
    with pytest.raises(ValueError, match="no readable text"):
        parse_pdf_content(pdf_bytes)


def test_parse_uploaded_file_unsupported_format():
    # AC: Edge cases & error handling for unsupported file formats
    with pytest.raises(ValueError, match="Unsupported file format"):
        parse_uploaded_file("malicious.exe", b"binary content")


def test_parse_uploaded_file_size_limit():
    # AC: Edge cases: 10MB max file size limit
    large_bytes = b"0" * (10 * 1024 * 1024 + 1)
    with pytest.raises(ValueError, match="File size exceeds 10MB limit"):
        parse_uploaded_file("large.txt", large_bytes)
