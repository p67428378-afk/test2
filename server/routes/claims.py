from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
    BackgroundTasks,
    Header,
)
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import json

from server.database import get_db
from server.models import Claim, ClaimImage, Dispatch, IdempotencyKey
from server.schemas import (
    ClaimUploadResponse,
    ClaimEstimateResponse,
    DispatchRequest,
    DispatchResponse,
    DispatchStatusResponse,
    DispatchCancelResponse,
    ActiveIncidentResponse,
)
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


# Helper to serialize UUIDs to JSON
class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, uuid.UUID):
            return str(obj)
        return super().default(obj)


# Dispatch Endpoints
@router.post("/dispatch/request_tow", response_model=DispatchResponse)
def request_tow_dispatch(
    request: DispatchRequest,
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key"),
    db: Session = Depends(get_db),
):
    # Check Idempotency
    if idempotency_key:
        existing_key = (
            db.query(IdempotencyKey)
            .filter(IdempotencyKey.key == idempotency_key)
            .first()
        )
        if existing_key:
            try:
                return json.loads(existing_key.response_body)
            except Exception:
                pass

    # Validate claim_id
    claim = db.query(Claim).filter(Claim.id == request.claim_id).first()
    if not claim:
        raise HTTPException(status_code=400, detail="Invalid claim_id")

    # Check if dispatch already exists for this claim
    existing_dispatch = (
        db.query(Dispatch).filter(Dispatch.claim_id == request.claim_id).first()
    )
    if existing_dispatch:
        # Return existing dispatch details
        response_data = {
            "dispatch_id": str(existing_dispatch.id),
            "status": existing_dispatch.status,
            "eta": "15 mins",
            "tow_truck": {
                "driver_name": "John Doe",
                "license_plate": "TOW-1234",
                "phone_number": "+1-555-0199",
                "latitude": request.gps_latitude + 0.01,
                "longitude": request.gps_longitude + 0.01,
            },
        }
        if idempotency_key:
            db.add(
                IdempotencyKey(
                    key=idempotency_key,
                    response_body=json.dumps(response_data, cls=UUIDEncoder),
                )
            )
            db.commit()
        return response_data

    # Create new dispatch
    dispatch = Dispatch(
        claim_id=request.claim_id,
        status="DISPATCHED",
        gps_latitude=request.gps_latitude,
        gps_longitude=request.gps_longitude,
    )
    db.add(dispatch)
    db.commit()
    db.refresh(dispatch)

    response_data = {
        "dispatch_id": str(dispatch.id),
        "status": dispatch.status,
        "eta": "15 mins",
        "tow_truck": {
            "driver_name": "John Doe",
            "license_plate": "TOW-1234",
            "phone_number": "+1-555-0199",
            "latitude": request.gps_latitude + 0.01,
            "longitude": request.gps_longitude + 0.01,
        },
    }

    if idempotency_key:
        db.add(
            IdempotencyKey(
                key=idempotency_key,
                response_body=json.dumps(response_data, cls=UUIDEncoder),
            )
        )
        db.commit()

    return response_data


@router.get("/dispatch/{dispatch_id}/status", response_model=DispatchStatusResponse)
def get_dispatch_status(dispatch_id: uuid.UUID, db: Session = Depends(get_db)):
    dispatch = db.query(Dispatch).filter(Dispatch.id == dispatch_id).first()
    if not dispatch:
        raise HTTPException(status_code=404, detail="Dispatch not found")

    return {
        "dispatch_id": dispatch.id,
        "status": dispatch.status,
        "resolved_address": "123 Accident Scene Rd",
        "tow_truck": {
            "driver_name": "John Doe",
            "license_plate": "TOW-1234",
            "phone_number": "+1-555-0199",
            "latitude": dispatch.gps_latitude + 0.005,
            "longitude": dispatch.gps_longitude + 0.005,
        },
    }


@router.post("/dispatch/{dispatch_id}/cancel", response_model=DispatchCancelResponse)
def cancel_tow_dispatch(dispatch_id: uuid.UUID, db: Session = Depends(get_db)):
    dispatch = db.query(Dispatch).filter(Dispatch.id == dispatch_id).first()
    if not dispatch:
        raise HTTPException(status_code=404, detail="Dispatch not found")

    if dispatch.status in ["COMPLETED", "ARRIVED"]:
        raise HTTPException(
            status_code=400, detail="Tow truck already on-site or service completed"
        )

    dispatch.status = "CANCELLED"
    db.commit()

    return {
        "status": "cancelled",
        "message": "Tow request has been successfully cancelled.",
    }


@router.get("/active_incident", response_model=ActiveIncidentResponse)
def get_active_incident(db: Session = Depends(get_db)):
    # Find the most recent claim that is not completed/failed, or has an active dispatch
    # For simplicity, we can return the latest claim and its dispatch if any exists.
    claim = db.query(Claim).order_by(Claim.created_at.desc()).first()
    if not claim:
        return {"isActiveIncident": False}

    dispatch = db.query(Dispatch).filter(Dispatch.claim_id == claim.id).first()

    claim_data = {
        "id": str(claim.id),
        "status": claim.status,
        "estimated_cost": float(claim.estimated_cost) if claim.estimated_cost else None,
        "damage_breakdown": claim.damage_breakdown,
        "created_at": claim.created_at.isoformat(),
    }

    dispatch_data = None
    if dispatch:
        dispatch_data = {
            "id": str(dispatch.id),
            "status": dispatch.status,
            "gps_latitude": dispatch.gps_latitude,
            "gps_longitude": dispatch.gps_longitude,
            "created_at": dispatch.created_at.isoformat(),
        }

    # An incident is active if the claim is PROCESSING or if there is a dispatch that is not CANCELLED/COMPLETED
    is_active = False
    if claim.status == "PROCESSING":
        is_active = True
    elif dispatch and dispatch.status not in ["CANCELLED", "COMPLETED"]:
        is_active = True

    return {
        "isActiveIncident": is_active,
        "claim": claim_data,
        "dispatch": dispatch_data,
    }
