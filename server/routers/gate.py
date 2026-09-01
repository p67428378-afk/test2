from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import models, schemas
from server.services.qr_service import verify_pass_token
from server.services.watchlist_service import screen_national_id

router = APIRouter(prefix="/api/v1/gate", tags=["Security Gate Express Scanner"])


@router.post("/scan-qr", response_model=schemas.QRScanResponse)
def scan_qr_pass(scan_req: schemas.QRScanRequest, db: Session = Depends(get_db)):
    # 1. Decrypt / Verify HMAC token
    payload = verify_pass_token(scan_req.qr_pass_token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or forged QR pass token",
        )

    appointment_id = payload.get("appointment_id")
    appointment = (
        db.query(models.Appointment)
        .filter(models.Appointment.id == appointment_id)
        .first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated appointment record not found",
        )

    # 2. Check Expiration
    exp_timestamp = payload.get("exp", 0)
    if datetime.utcnow().timestamp() > exp_timestamp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="QR Pass has expired",
        )

    # 3. Check Appointment Status
    if appointment.status != "APPROVED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Appointment is not approved (Current Status: {appointment.status})",
        )

    # 4. Check If Pass is Already Used
    digital_pass = (
        db.query(models.DigitalPass)
        .filter(models.DigitalPass.appointment_id == appointment.id)
        .first()
    )
    if digital_pass and digital_pass.is_used:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="QR Pass has already been used for entry",
        )

    # 5. Real-Time Automated Watchlist Screening
    visitor = appointment.visitor
    if visitor:
        is_flagged, _ = screen_national_id(db, visitor.national_id, visitor.full_name)
        if is_flagged or visitor.is_watchlist_flagged:
            # Immediate Security Denial
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Visitor Flagged - Deny Entry Immediately",
            )

    # 6. Log Entry in EntryExitLogs
    now = datetime.utcnow()
    entry_log = models.EntryExitLog(
        appointment_id=appointment.id,
        officer_id=scan_req.officer_id,
        check_in_time=now,
        entry_method="QR_SCAN",
    )
    db.add(entry_log)

    if digital_pass:
        digital_pass.is_used = True

    db.commit()

    visitor_name = visitor.full_name if visitor else "Unknown Visitor"
    inmate_name = (
        f"{appointment.inmate.full_name} ({appointment.inmate.inmate_number})"
        if appointment.inmate
        else "Unknown Inmate"
    )

    return {
        "status": "APPROVED",
        "message": "Express check-in successful",
        "check_in_timestamp": now,
        "appointment_id": appointment.id,
        "visitor_name": visitor_name,
        "inmate_name": inmate_name,
        "duration_minutes": appointment.slot_duration_minutes,
        "security_status": "CLEARED",
    }
