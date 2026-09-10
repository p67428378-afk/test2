import email
import io
import re
from email import policy

from pypdf import PdfReader

ALLOWED_EXTENSIONS = {".eml", ".txt", ".pdf"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


def create_excerpt(text: str, max_length: int = 180) -> str:
    """Create a clean snippet/excerpt from raw body text."""
    if not text:
        return ""
    # Normalize whitespaces
    cleaned = re.sub(r"\s+", " ", text).strip()
    if len(cleaned) <= max_length:
        return cleaned
    return cleaned[:max_length].rstrip() + "..."


def parse_eml_content(raw_bytes: bytes) -> tuple[str | None, str | None, str]:
    """Parse .eml RFC 822 formatted bytes and extract sender, subject, body."""
    msg = email.message_from_bytes(raw_bytes, policy=policy.default)
    sender = msg.get("From")
    subject = msg.get("Subject")

    # Extract body text
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition", ""))
            if content_type == "text/plain" and "attachment" not in content_disposition:
                payload = part.get_payload(decode=True)
                if payload:
                    charset = part.get_content_charset() or "utf-8"
                    try:
                        body += payload.decode(charset, errors="replace") + "\n"
                    except Exception:
                        body += payload.decode("utf-8", errors="replace") + "\n"
        if not body.strip():
            # Fallback to html if no plain text
            for part in msg.walk():
                if part.get_content_type() == "text/html":
                    payload = part.get_payload(decode=True)
                    if payload:
                        charset = part.get_content_charset() or "utf-8"
                        html_text = payload.decode(charset, errors="replace")
                        # Basic tag strip
                        body = re.sub(r"<[^>]+>", " ", html_text)
                        break
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            charset = msg.get_content_charset() or "utf-8"
            body = payload.decode(charset, errors="replace")
        else:
            body = msg.get_payload() or ""

    return sender, subject, body.strip()


def parse_pdf_content(raw_bytes: bytes) -> tuple[str | None, str | None, str]:
    """Extract text from a PDF file using pypdf."""
    stream = io.BytesIO(raw_bytes)
    reader = PdfReader(stream)
    extracted_text = []

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            extracted_text.append(page_text)

    full_text = "\n".join(extracted_text).strip()
    if not full_text:
        raise ValueError("The uploaded PDF file contains no readable text.")

    # Attempt to extract subject or sender from top lines if present
    sender = None
    subject = None
    lines = [line.strip() for line in full_text.splitlines() if line.strip()]
    for line in lines[:5]:
        if line.lower().startswith("from:"):
            sender = line[5:].strip()
        elif line.lower().startswith("subject:"):
            subject = line[8:].strip()

    return sender, subject, full_text


def parse_txt_content(raw_bytes: bytes) -> tuple[str | None, str | None, str]:
    """Extract text from a plain .txt file with header parsing if formatted."""
    try:
        full_text = raw_bytes.decode("utf-8")
    except UnicodeDecodeError:
        full_text = raw_bytes.decode("latin-1", errors="replace")

    full_text = full_text.strip()
    if not full_text:
        raise ValueError("The uploaded text file is empty.")

    sender = None
    subject = None
    lines = full_text.splitlines()
    body_start_idx = 0

    for i, line in enumerate(lines[:6]):
        stripped = line.strip()
        if stripped.lower().startswith("from:"):
            sender = stripped[5:].strip()
            body_start_idx = max(body_start_idx, i + 1)
        elif stripped.lower().startswith("subject:"):
            subject = stripped[8:].strip()
            body_start_idx = max(body_start_idx, i + 1)

    return sender, subject, full_text


def parse_uploaded_file(
    filename: str, raw_bytes: bytes
) -> tuple[str | None, str | None, str]:
    """Validate file extension, size, and parse contents into (sender, subject, body)."""
    if len(raw_bytes) > MAX_FILE_SIZE_BYTES:
        raise ValueError("File size exceeds 10MB limit.")

    lower_name = filename.lower()
    if lower_name.endswith(".eml"):
        return parse_eml_content(raw_bytes)
    elif lower_name.endswith(".pdf"):
        return parse_pdf_content(raw_bytes)
    elif lower_name.endswith(".txt"):
        return parse_txt_content(raw_bytes)
    else:
        raise ValueError(
            f"Unsupported file format '{filename}'. Please upload .eml, .txt, or .pdf"
        )
