from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from server.database import get_db
from server.models import Claim, ClaimImage
from server.schemas import ClaimUploadResponse, ClaimEstimateResponse
from server.services.gcs import gcs_service
from server.services.ai_analysis import ai_analysis_service

router = APIRouter(prefix="/claims", tags=["claims"])


async def run_ai_analysis_task(
    claim_id: uuid.UUID, image_urls: List[str], db_session_factory
):
    # Run the AI analysis asynchronously
    result = await ai_analysis_service.analyze_images(image_urls)

    # Get a fresh DB session to update the claim status
    db = db_session_factory()
    try:
        claim = db.query(Claim).filter(Claim.id == claim_id).first()
        if claim:
            if result["status"] == "READY":
                claim.status = "READY"
                claim.estimated_cost = result["estimate"]["total_cost"]
                claim.damage_breakdown = result["estimate"]
            else:
                claim.status = "FAILED"
                claim.damage_breakdown = {
                    "reason": result.get("reason", "Analysis failed")
                }
            db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()


@router.post("/upload", response_model=ClaimUploadResponse, status_code=202)
async def upload_damage_photos(
    background_tasks: BackgroundTasks,
    files: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
):
    if not files or len(files) == 0:
        raise HTTPException(
            status_code=400, detail="No files uploaded or invalid file types."
        )

    # Validate file types (must be images)
    for file in files:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, detail="No files uploaded or invalid file types."
            )

    # Create a new claim with a mock policyholder_id (since auth is assumed handled)
    policyholder_id = uuid.uuid4()
    claim = Claim(policyholder_id=policyholder_id, status="PROCESSING")
    db.add(claim)
    db.commit()
    db.refresh(claim)

    image_urls = []
    for file in files:
        content = await file.read()
        url = gcs_service.upload_file(content, file.filename)
        claim_image = ClaimImage(claim_id=claim.id, image_url=url)
        db.add(claim_image)
        image_urls.append(url)

    db.commit()

    # Trigger background AI analysis task
    from server.database import SessionLocal

    background_tasks.add_task(run_ai_analysis_task, claim.id, image_urls, SessionLocal)

    return {"claim_id": claim.id}


@router.get("/{claim_id}/estimate", response_model=ClaimEstimateResponse)
def get_claim_estimate(claim_id: uuid.UUID, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(
            status_code=404, detail="The specified claim_id does not exist."
        )

    if claim.status == "PROCESSING":
        return {"status": "PROCESSING"}
    elif claim.status == "READY":
        return {
            "status": "READY",
            "estimate": claim.damage_breakdown.get("estimate")
            if "estimate" in claim.damage_breakdown
            else claim.damage_breakdown,
        }
    else:
        reason = (
            claim.damage_breakdown.get(
                "reason", "Could not analyze one or more images."
            )
            if claim.damage_breakdown
            else "Could not analyze one or more images."
        )
        return {"status": "FAILED", "reason": reason}
