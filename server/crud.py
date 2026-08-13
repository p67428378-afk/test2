from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException

from server import models, schemas
from server.security import decrypt_and_extract_ticket_code


# ---------------------------------------------------------
# Artist CRUD
# ---------------------------------------------------------
def get_artists(db: Session, skip: int = 0, limit: int = 100) -> List[models.Artist]:
    return db.query(models.Artist).offset(skip).limit(limit).all()


def get_artist(db: Session, artist_id: str) -> Optional[models.Artist]:
    return db.query(models.Artist).filter(models.Artist.id == artist_id).first()


def create_artist(db: Session, artist_data: schemas.ArtistCreate) -> models.Artist:
    db_artist = models.Artist(**artist_data.model_dump())
    db.add(db_artist)
    db.commit()
    db.refresh(db_artist)
    return db_artist


# ---------------------------------------------------------
# Stage CRUD
# ---------------------------------------------------------
def get_stages(db: Session, skip: int = 0, limit: int = 100) -> List[models.Stage]:
    return db.query(models.Stage).offset(skip).limit(limit).all()


def get_stage(db: Session, stage_id: str) -> Optional[models.Stage]:
    return db.query(models.Stage).filter(models.Stage.id == stage_id).first()


def create_stage(db: Session, stage_data: schemas.StageCreate) -> models.Stage:
    db_stage = models.Stage(**stage_data.model_dump())
    db.add(db_stage)
    db.commit()
    db.refresh(db_stage)
    return db_stage


# ---------------------------------------------------------
# Performance Scheduling & Delay Propagation
# ---------------------------------------------------------
def get_stage_performances(db: Session, stage_id: str) -> List[models.Performance]:
    return (
        db.query(models.Performance)
        .filter(models.Performance.stage_id == stage_id)
        .order_by(models.Performance.start_time.asc())
        .all()
    )


def create_performance(
    db: Session, stage_id: str, perf_data: schemas.PerformanceCreate
) -> models.Performance:
    stage = get_stage(db, stage_id)
    if not stage:
        raise HTTPException(status_code=404, detail="Stage not found")

    artist = get_artist(db, perf_data.artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")

    new_start = perf_data.start_time
    new_end = perf_data.end_time
    buffer_mins = perf_data.buffer_minutes

    if new_end <= new_start:
        raise HTTPException(
            status_code=400, detail="Performance end time must be after start time"
        )

    # Rule 1: Stage Overlap & Changeover Buffer Enforcement on same stage
    existing_stage_perfs = (
        db.query(models.Performance)
        .filter(
            models.Performance.stage_id == stage_id,
            models.Performance.status.in_(["SCHEDULED", "DELAYED"]),
        )
        .all()
    )

    for e in existing_stage_perfs:
        e_buffered_end = e.end_time + timedelta(minutes=e.buffer_minutes)
        new_buffered_end = new_end + timedelta(minutes=buffer_mins)

        if new_start < e_buffered_end and e.start_time < new_buffered_end:
            raise HTTPException(
                status_code=409,
                detail=f"Scheduling conflict on stage '{stage.name}'. Mandatory {buffer_mins}-minute changeover buffer violated with set from {e.start_time.strftime('%H:%M')} to {e.end_time.strftime('%H:%M')}.",
            )

    # Rule 2: Artist Double-Booking Check across all stages
    artist_perfs = (
        db.query(models.Performance)
        .filter(
            models.Performance.artist_id == perf_data.artist_id,
            models.Performance.status.in_(["SCHEDULED", "DELAYED"]),
        )
        .all()
    )

    for e in artist_perfs:
        if new_start < e.end_time and e.start_time < new_end:
            raise HTTPException(
                status_code=409,
                detail=f"Artist '{artist.name}' is already booked on another stage between {e.start_time.strftime('%H:%M')} and {e.end_time.strftime('%H:%M')}.",
            )

    db_perf = models.Performance(
        stage_id=stage_id,
        artist_id=perf_data.artist_id,
        start_time=new_start,
        end_time=new_end,
        buffer_minutes=buffer_mins,
        status="SCHEDULED",
    )
    db.add(db_perf)
    db.commit()
    db.refresh(db_perf)
    return db_perf


def delay_performance(
    db: Session, performance_id: str, delay_minutes: int
) -> List[models.Performance]:
    perf = (
        db.query(models.Performance)
        .filter(models.Performance.id == performance_id)
        .first()
    )
    if not perf:
        raise HTTPException(status_code=404, detail="Performance not found")

    orig_start = perf.start_time
    delay_delta = timedelta(minutes=delay_minutes)

    # Find all subsequent performances on the same stage starting at or after original start_time
    subsequent_perfs = (
        db.query(models.Performance)
        .filter(
            models.Performance.stage_id == perf.stage_id,
            models.Performance.start_time >= orig_start,
            models.Performance.status.in_(["SCHEDULED", "DELAYED"]),
        )
        .order_by(models.Performance.start_time.asc())
        .all()
    )

    updated_perfs = []
    for p in subsequent_perfs:
        p.start_time += delay_delta
        p.end_time += delay_delta
        p.status = "DELAYED"
        updated_perfs.append(p)

    # Broadcast notification to stage crew
    notification = models.StageNotification(
        stage_id=perf.stage_id,
        performance_id=perf.id,
        message=f"ATTENTION STAGE CREW: Performance set delayed by {delay_minutes} minutes. Subsequent set times automatically updated.",
    )
    db.add(notification)

    db.commit()
    for p in updated_perfs:
        db.refresh(p)
    return updated_perfs


def get_stage_notifications(
    db: Session, stage_id: str
) -> List[models.StageNotification]:
    return (
        db.query(models.StageNotification)
        .filter(models.StageNotification.stage_id == stage_id)
        .order_by(models.StageNotification.created_at.desc())
        .all()
    )


# ---------------------------------------------------------
# Volunteer Coordination & Shifts
# ---------------------------------------------------------
def get_volunteers(
    db: Session, skip: int = 0, limit: int = 100
) -> List[models.Volunteer]:
    return db.query(models.Volunteer).offset(skip).limit(limit).all()


def create_volunteer(
    db: Session, vol_data: schemas.VolunteerCreate
) -> models.Volunteer:
    existing = (
        db.query(models.Volunteer)
        .filter(models.Volunteer.email == vol_data.email)
        .first()
    )
    if existing:
        return existing
    db_vol = models.Volunteer(**vol_data.model_dump())
    db.add(db_vol)
    db.commit()
    db.refresh(db_vol)
    return db_vol


def check_and_flag_absent_shifts(db: Session):
    """Automatically flag shifts as ABSENT if past 15 minutes post start time and not checked in."""
    now = datetime.utcnow()
    cutoff_time = now - timedelta(minutes=15)

    unattended_shifts = (
        db.query(models.VolunteerShift)
        .filter(
            models.VolunteerShift.status.in_(["ASSIGNED", "UNASSIGNED"]),
            models.VolunteerShift.start_time <= cutoff_time,
            models.VolunteerShift.check_in_time.is_(None),
        )
        .all()
    )

    for shift in unattended_shifts:
        shift.status = "ABSENT"
        alert = models.StandbyAlert(
            shift_id=shift.id,
            zone_name=shift.zone_name,
            alert_type="ABSENCE_REPLACEMENT",
            message=f"Volunteer absent 15+ minutes past shift start time ({shift.start_time.strftime('%H:%M')}) for zone '{shift.zone_name}'. Replacement needed.",
        )
        db.add(alert)

    if unattended_shifts:
        db.commit()


def get_volunteer_shifts(
    db: Session, zone_name: Optional[str] = None, status: Optional[str] = None
) -> List[models.VolunteerShift]:
    check_and_flag_absent_shifts(db)
    query = db.query(models.VolunteerShift)
    if zone_name:
        query = query.filter(models.VolunteerShift.zone_name == zone_name)
    if status:
        query = query.filter(models.VolunteerShift.status == status)
    return query.order_by(models.VolunteerShift.start_time.asc()).all()


def create_volunteer_shift(
    db: Session, shift_data: schemas.VolunteerShiftCreate
) -> models.VolunteerShift:
    status_val = "ASSIGNED" if shift_data.volunteer_id else "UNASSIGNED"
    db_shift = models.VolunteerShift(
        volunteer_id=shift_data.volunteer_id,
        zone_name=shift_data.zone_name,
        start_time=shift_data.start_time,
        end_time=shift_data.end_time,
        status=status_val,
    )
    db.add(db_shift)
    db.commit()
    db.refresh(db_shift)
    return db_shift


def check_in_volunteer_shift(
    db: Session, shift_id: str, volunteer_id: Optional[str] = None
) -> models.VolunteerShift:
    shift = (
        db.query(models.VolunteerShift)
        .filter(models.VolunteerShift.id == shift_id)
        .first()
    )
    if not shift:
        raise HTTPException(status_code=404, detail="Volunteer shift not found")

    shift.check_in_time = datetime.utcnow()
    shift.status = "CHECKED_IN"
    if volunteer_id:
        shift.volunteer_id = volunteer_id

    db.commit()
    db.refresh(shift)
    return shift


def drop_volunteer_shift(
    db: Session, shift_id: str, reason: Optional[str] = None
) -> models.VolunteerShift:
    shift = (
        db.query(models.VolunteerShift)
        .filter(models.VolunteerShift.id == shift_id)
        .first()
    )
    if not shift:
        raise HTTPException(status_code=404, detail="Volunteer shift not found")

    now = datetime.utcnow()
    time_to_start = (shift.start_time - now).total_seconds() / 3600.0

    shift.status = "DROPPED"

    # If dropped within 1 hour of start time, broadcast urgent standby alert
    if time_to_start <= 1.0:
        alert = models.StandbyAlert(
            shift_id=shift.id,
            zone_name=shift.zone_name,
            alert_type="STANDBY_BROADCAST",
            message=f"URGENT: Shift dropped within 1 hour of start time for zone '{shift.zone_name}'. Standby broadcast dispatched to zone volunteers.",
        )
        db.add(alert)

    db.commit()
    db.refresh(shift)
    return shift


def get_standby_alerts(db: Session) -> List[models.StandbyAlert]:
    return (
        db.query(models.StandbyAlert)
        .order_by(models.StandbyAlert.created_at.desc())
        .all()
    )


# ---------------------------------------------------------
# Ticket Validation & Gate Security
# ---------------------------------------------------------
def get_tickets(db: Session, skip: int = 0, limit: int = 100) -> List[models.Ticket]:
    return db.query(models.Ticket).offset(skip).limit(limit).all()


def create_ticket(db: Session, ticket_data: schemas.TicketCreate) -> models.Ticket:
    existing = (
        db.query(models.Ticket)
        .filter(models.Ticket.ticket_code == ticket_data.ticket_code)
        .first()
    )
    if existing:
        return existing
    db_ticket = models.Ticket(**ticket_data.model_dump())
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def validate_ticket(
    db: Session, validate_req: schemas.TicketValidationRequest
) -> schemas.TicketValidationResponse:
    extracted_code = decrypt_and_extract_ticket_code(validate_req.qr_payload)
    ticket = (
        db.query(models.Ticket)
        .filter(models.Ticket.ticket_code == extracted_code)
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=400, detail="Invalid or Unrecognized Ticket QR Payload"
        )

    if ticket.status == "USED":
        scanned_str = (
            ticket.scanned_at.strftime("%H:%M:%S") if ticket.scanned_at else "earlier"
        )
        raise HTTPException(
            status_code=409, detail=f"Ticket Already Used at {scanned_str}"
        )

    if ticket.status == "REVOKED":
        raise HTTPException(status_code=400, detail="Ticket Has Been Revoked")

    scanned_time = validate_req.device_timestamp or datetime.utcnow()
    ticket.status = "USED"
    ticket.scanned_at = scanned_time
    ticket.scanned_gate = validate_req.gate_id
    db.commit()

    return schemas.TicketValidationResponse(
        status="ACCESS_GRANTED",
        ticket_id=ticket.id,
        tier=ticket.tier,
        scanned_at=scanned_time,
        message=f"Access Granted: {ticket.tier}",
    )


def sync_tickets(
    db: Session, sync_req: schemas.TicketSyncRequest
) -> schemas.TicketSyncResponse:
    synchronized_count = 0
    rejected_count = 0
    details = []

    for item in sync_req.scanned_tickets:
        ticket = (
            db.query(models.Ticket)
            .filter(models.Ticket.ticket_code == item.ticket_code)
            .first()
        )
        if ticket and ticket.status == "VALID":
            ticket.status = "USED"
            ticket.scanned_at = item.scanned_at
            ticket.scanned_gate = item.gate_id
            synchronized_count += 1
            details.append({"ticket_code": item.ticket_code, "status": "SYNCHRONIZED"})
        else:
            rejected_count += 1
            reason = (
                "Ticket not found or already used/revoked"
                if ticket
                else "Ticket not found"
            )
            details.append(
                {
                    "ticket_code": item.ticket_code,
                    "status": "REJECTED",
                    "reason": reason,
                }
            )

    db.commit()
    return schemas.TicketSyncResponse(
        synchronized_count=synchronized_count,
        rejected_count=rejected_count,
        details=details,
    )


# ---------------------------------------------------------
# Crowd Analytics & Telemetry Engine
# ---------------------------------------------------------
def ingest_telemetry(
    db: Session, telemetry_req: schemas.TelemetryIngestRequest
) -> models.CrowdSensorEvent:
    zone_id = telemetry_req.zone_id
    rec_time = telemetry_req.timestamp or datetime.utcnow()

    if telemetry_req.current_occupancy is None:
        latest_event = (
            db.query(models.CrowdSensorEvent)
            .filter(models.CrowdSensorEvent.zone_id == zone_id)
            .order_by(models.CrowdSensorEvent.recorded_at.desc())
            .first()
        )

        prev_occ = latest_event.current_occupancy if latest_event else 0
        current_occ = max(
            0, prev_occ + telemetry_req.ingress_count - telemetry_req.egress_count
        )
    else:
        current_occ = telemetry_req.current_occupancy

    db_event = models.CrowdSensorEvent(
        zone_id=zone_id,
        sensor_id=telemetry_req.sensor_id,
        ingress_count=telemetry_req.ingress_count,
        egress_count=telemetry_req.egress_count,
        current_occupancy=current_occ,
        recorded_at=rec_time,
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def get_crowd_analytics(db: Session) -> List[schemas.ZoneCrowdStatus]:
    stages = db.query(models.Stage).all()
    stage_map = {s.location_zone: s for s in stages if s.location_zone}

    sensor_zones = db.query(models.CrowdSensorEvent.zone_id).distinct().all()
    zone_ids = set(stage_map.keys()).union({z[0] for z in sensor_zones})

    now = datetime.utcnow()
    two_mins_ago = now - timedelta(minutes=2)

    results = []
    for zone_id in sorted(zone_ids):
        stage = stage_map.get(zone_id)
        zone_name = stage.name if stage else zone_id
        max_cap = stage.max_capacity if stage else 10000

        latest_event = (
            db.query(models.CrowdSensorEvent)
            .filter(models.CrowdSensorEvent.zone_id == zone_id)
            .order_by(models.CrowdSensorEvent.recorded_at.desc())
            .first()
        )

        curr_occ = latest_event.current_occupancy if latest_event else 0
        occ_pct = round((curr_occ / max_cap) * 100.0, 1) if max_cap > 0 else 0.0

        if occ_pct >= 95.0:
            density_status = "RED_ALERT"
        elif occ_pct >= 85.0:
            density_status = "YELLOW_WARNING"
        else:
            density_status = "NORMAL"

        recent_ingress = (
            db.query(func.sum(models.CrowdSensorEvent.ingress_count))
            .filter(
                models.CrowdSensorEvent.zone_id == zone_id,
                models.CrowdSensorEvent.recorded_at >= two_mins_ago,
            )
            .scalar()
            or 0
        )

        rate_alert = bool(recent_ingress >= 1000)

        results.append(
            schemas.ZoneCrowdStatus(
                zone_id=zone_id,
                zone_name=zone_name,
                current_occupancy=curr_occ,
                max_capacity=max_cap,
                occupancy_percentage=occ_pct,
                density_status=density_status,
                rate_of_change_2min=recent_ingress,
                rate_of_change_alert=rate_alert,
            )
        )

    return results
