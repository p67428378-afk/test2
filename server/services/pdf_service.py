import io
import os
import re
from pathlib import Path
from typing import Any, Dict
from jinja2 import Environment, FileSystemLoader, select_autoescape

# Determine templates directory
CURRENT_DIR = Path(__file__).resolve().parent
TEMPLATES_DIR = CURRENT_DIR.parent / "templates"

jinja_env = Environment(
    loader=FileSystemLoader(str(TEMPLATES_DIR)),
    autoescape=select_autoescape(["html", "xml"])
)

AVAILABLE_TEMPLATES = {
    "classic": {
        "id": "classic",
        "name": "Classic Elegance",
        "description": "Traditional serif layout optimized for academic, legal, and corporate roles.",
        "category": "Standard"
    },
    "modern": {
        "id": "modern",
        "name": "Modern Professional",
        "description": "Contemporary clean sans-serif layout with subtle color accents.",
        "category": "Creative & Tech"
    }
}


def sanitize_filename(user_name: str) -> str:
    """Sanitize user name for safe HTTP attachment filename."""
    if not user_name or not user_name.strip():
        name_clean = "User"
    else:
        # Replace non-alphanumeric (except underscores/hyphens) with underscore
        name_clean = re.sub(r"[^\w\-]", "_", user_name.strip())
        name_clean = re.sub(r"_+", "_", name_clean).strip("_")
    return f"{name_clean}_Resume.pdf"


def render_html_template(resume_dict: Dict[str, Any], template_id: str = "classic") -> str:
    """Render HTML string for the resume using Jinja2."""
    template_name = f"{template_id}.html" if f"{template_id}.html" in ["classic.html", "modern.html"] else "classic.html"
    try:
        template = jinja_env.get_template(template_name)
    except Exception:
        template = jinja_env.get_template("classic.html")

    return template.render(**resume_dict)


def generate_pdf_from_html(html_content: str) -> bytes:
    """Generate vector PDF bytes from HTML using xhtml2pdf / pisa."""
    from xhtml2pdf import pisa

    pdf_buffer = io.BytesIO()
    pisa_status = pisa.CreatePDF(
        src=html_content,
        dest=pdf_buffer,
        encoding="utf-8"
    )

    if pisa_status.err:
        raise RuntimeError(f"PDF generation error in xhtml2pdf: {pisa_status.err}")

    pdf_bytes = pdf_buffer.getvalue()
    if not pdf_bytes:
        raise RuntimeError("Generated PDF buffer is empty")

    return pdf_bytes


def generate_resume_pdf(resume_data: Dict[str, Any], template_id: str = "classic") -> bytes:
    """Generate complete vector PDF binary for a resume."""
    # Ensure template_id is valid
    tid = template_id if template_id in AVAILABLE_TEMPLATES else resume_data.get("template_id", "classic")
    if tid not in AVAILABLE_TEMPLATES:
        tid = "classic"

    html_content = render_html_template(resume_data, template_id=tid)
    return generate_pdf_from_html(html_content)
