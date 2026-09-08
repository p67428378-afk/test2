import base64
import json
import logging

from fastapi import HTTPException
from sqlalchemy.orm import Session

from server.models import ExportLog, Recommendation
from server.schemas import ExportRequest, ExportResponse

logger = logging.getLogger(__name__)


class ExportService:
    def export_itinerary(
        self,
        db: Session,
        payload: ExportRequest,
        base_frontend_url: str = "http://localhost:5173",
    ) -> ExportResponse:
        rec = (
            db.query(Recommendation)
            .filter(Recommendation.id == payload.recommendation_id)
            .first()
        )
        if not rec:
            raise HTTPException(
                status_code=404,
                detail=f"Recommendation '{payload.recommendation_id}' not found",
            )

        # Log the export transaction
        export_log = ExportLog(
            recommendation_id=rec.id,
            export_format=payload.export_format.lower().strip(),
        )
        db.add(export_log)
        db.commit()
        db.refresh(export_log)

        dest_name = rec.request.destination if rec.request else "Travel"
        clean_dest = (
            "".join(c for c in dest_name if c.isalnum() or c in (" ", "_", "-"))
            .strip()
            .replace(" ", "_")
        )
        if not clean_dest:
            clean_dest = "Trip"

        total_cost = sum(item.estimated_cost for item in rec.items)
        share_url = f"{base_frontend_url}/results?share={rec.id}"

        fmt = payload.export_format.lower().strip()

        if fmt == "pdf":
            file_name = f"{clean_dest}_Trip_Itinerary.pdf"
            mime_type = "application/pdf"
            content_bytes = self._generate_pdf_bytes(
                rec, total_cost, payload.include_cost_summary
            )
            content_b64 = base64.b64encode(content_bytes).decode("utf-8")
        elif fmt == "link":
            file_name = f"{clean_dest}_Trip_ShareLink.txt"
            mime_type = "text/plain"
            content_bytes = share_url.encode("utf-8")
            content_b64 = base64.b64encode(content_bytes).decode("utf-8")
        else:  # Default to JSON
            file_name = f"{clean_dest}_Trip_Itinerary.json"
            mime_type = "application/json"
            itinerary_data = {
                "recommendation_id": str(rec.id),
                "destination": dest_name,
                "daily_budget": rec.request.budget if rec.request else None,
                "currency": rec.request.currency if rec.request else "USD",
                "interests": rec.request.interests if rec.request else [],
                "created_at": rec.created_at.isoformat(),
                "is_fallback": rec.is_fallback,
                "items": [
                    {
                        "title": item.title,
                        "category": item.category,
                        "estimated_cost": item.estimated_cost,
                        "location": item.location,
                        "duration": item.duration,
                        "description": item.description,
                    }
                    for item in rec.items
                ],
            }
            if payload.include_cost_summary:
                itinerary_data["cost_summary"] = {
                    "total_estimated_cost": round(total_cost, 2),
                    "daily_budget": rec.request.budget if rec.request else None,
                    "currency": rec.request.currency if rec.request else "USD",
                }
            json_str = json.dumps(itinerary_data, indent=2)
            content_b64 = base64.b64encode(json_str.encode("utf-8")).decode("utf-8")

        return ExportResponse(
            export_id=str(export_log.id),
            recommendation_id=str(rec.id),
            file_name=file_name,
            mime_type=mime_type,
            content_base64=content_b64,
            share_url=share_url,
        )

    def _generate_pdf_bytes(
        self,
        rec: Recommendation,
        total_cost: float,
        include_cost_summary: bool | None,
    ) -> bytes:
        dest_name = rec.request.destination if rec.request else "Travel Itinerary"
        budget = rec.request.budget if rec.request else 0.0
        currency = rec.request.currency if rec.request else "USD"

        try:
            from fpdf import FPDF

            pdf = FPDF()
            pdf.add_page()
            pdf.set_auto_page_break(auto=True, margin=15)

            # Title
            pdf.set_font("Helvetica", "B", 18)
            pdf.cell(
                0,
                10,
                f"Trip Itinerary: {dest_name}",
                new_x="LMARGIN",
                new_y="NEXT",
                align="C",
            )
            pdf.ln(4)

            # Subheader / Metadata
            pdf.set_font("Helvetica", "", 11)
            pdf.cell(
                0,
                7,
                f"Daily Budget: {budget:.2f} {currency}",
                new_x="LMARGIN",
                new_y="NEXT",
            )
            if include_cost_summary:
                pdf.cell(
                    0,
                    7,
                    f"Total Estimated Spend: {total_cost:.2f} {currency}",
                    new_x="LMARGIN",
                    new_y="NEXT",
                )
            pdf.ln(5)

            # Section Header
            pdf.set_font("Helvetica", "B", 13)
            pdf.cell(
                0,
                8,
                "Recommended Activities & Places:",
                new_x="LMARGIN",
                new_y="NEXT",
            )
            pdf.ln(2)

            # Items
            for i, item in enumerate(rec.items, start=1):
                pdf.set_font("Helvetica", "B", 11)
                pdf.cell(
                    0,
                    6,
                    f"{i}. {item.title} ({item.category})",
                    new_x="LMARGIN",
                    new_y="NEXT",
                )
                pdf.set_font("Helvetica", "I", 10)
                details = []
                if item.location:
                    details.append(f"Location: {item.location}")
                if item.duration:
                    details.append(f"Duration: {item.duration}")
                details.append(f"Est. Cost: {item.estimated_cost:.2f} {currency}")
                pdf.cell(0, 5, " | ".join(details), new_x="LMARGIN", new_y="NEXT")

                if item.description:
                    pdf.set_font("Helvetica", "", 10)
                    pdf.multi_cell(0, 5, item.description)
                pdf.ln(3)

            return bytes(pdf.output())
        except Exception as e:  # noqa: BLE001
            logger.warning(
                f"FPDF generation encountered issue: {e}. Using raw text byte fallback."
            )
            text_summary = (
                f"TRIP ITINERARY: {dest_name}\n"
                f"Budget: {budget:.2f} {currency}\n"
                f"Total Est. Cost: {total_cost:.2f} {currency}\n\n"
                f"ITEMS:\n"
            )
            for item in rec.items:
                text_summary += f"- {item.title} ({item.category}) | {item.estimated_cost:.2f} {currency}\n"
                if item.description:
                    text_summary += f"  {item.description}\n"
            return text_summary.encode("utf-8")


export_service = ExportService()
