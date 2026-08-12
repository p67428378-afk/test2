from datetime import datetime, timedelta, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server import models, schemas


def get_trains(db: Session, skip: int = 0, limit: int = 100) -> List[models.Train]:
    trains = db.query(models.Train).offset(skip).limit(limit).all()
    now = datetime.now(timezone.utc)
    updated_any = False

    for train in trains:
        if train.last_telemetry_at:
            telemetry_dt = train.last_telemetry_at
            if telemetry_dt.tzinfo is None:
                telemetry_dt = telemetry_dt.replace(tzinfo=timezone.utc)
            if (now - telemetry_dt).total_seconds() > 30 and train.status == "active":
                train.status = "signal_lost"
                updated_any = True
        elif train.status == "active":
            train.status = "signal_lost"
            updated_any = True

    if updated_any:
        try:
            db.commit()
        except Exception:
            db.rollback()

    return trains


def get_train_by_id(db: Session, train_id: str) -> Optional[models.Train]:
    train = db.query(models.Train).filter(models.Train.id == train_id).first()
    if not train:
        return None

    now = datetime.now(timezone.utc)
    if train.last_telemetry_at:
        telemetry_dt = train.last_telemetry_at
        if telemetry_dt.tzinfo is None:
            telemetry_dt = telemetry_dt.replace(tzinfo=timezone.utc)
        if (now - telemetry_dt).total_seconds() > 30 and train.status == "active":
            train.status = "signal_lost"
            try:
                db.commit()
                db.refresh(train)
            except Exception:
                db.rollback()

    return train


def get_stations(
    db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None
) -> List[models.Station]:
    query = db.query(models.Station)
    if search:
        query = query.filter(
            or_(
                models.Station.name.ilike(f"%{search}%"),
                models.Station.code.ilike(f"%{search}%"),
            )
        )
    return query.offset(skip).limit(limit).all()


def get_station_by_id(db: Session, station_id: str) -> Optional[models.Station]:
    return db.query(models.Station).filter(models.Station.id == station_id).first()


def get_schedules_for_station(
    db: Session, station_id: str
) -> List[schemas.StationScheduleResponse]:
    schedules = (
        db.query(models.Schedule).filter(models.Schedule.station_id == station_id).all()
    )

    result = []
    for sched in schedules:
        train = sched.train
        station = sched.station

        # Check for active delay alerts for this train
        active_alert = (
            db.query(models.DelayAlert)
            .filter(
                models.DelayAlert.train_id == train.id,
                models.DelayAlert.is_resolved.is_(False),
            )
            .order_by(models.DelayAlert.created_at.desc())
            .first()
        )

        delay_minutes = active_alert.delay_minutes if active_alert else 0
        predicted_eta = sched.scheduled_arrival + timedelta(minutes=delay_minutes)
        status_str = "delayed" if delay_minutes > 0 else "on_time"

        result.append(
            schemas.StationScheduleResponse(
                schedule_id=sched.id,
                train_id=train.id,
                train_number=train.train_number if train else "Unknown",
                station_id=station.id,
                station_name=station.name if station else "Unknown",
                scheduled_arrival=sched.scheduled_arrival,
                scheduled_departure=sched.scheduled_departure,
                delay_minutes=delay_minutes,
                predicted_eta=predicted_eta,
                status=status_str,
            )
        )

    return result


def get_active_delays(db: Session) -> List[schemas.DelayAlertResponse]:
    alerts = (
        db.query(models.DelayAlert)
        .filter(models.DelayAlert.is_resolved.is_(False))
        .order_by(models.DelayAlert.created_at.desc())
        .all()
    )

    result = []
    for alert in alerts:
        train_num = alert.train.train_number if alert.train else None
        result.append(
            schemas.DelayAlertResponse(
                id=alert.id,
                train_id=alert.train_id,
                delay_minutes=alert.delay_minutes,
                reason=alert.reason,
                is_resolved=alert.is_resolved,
                created_at=alert.created_at,
                updated_at=alert.updated_at,
                train_number=train_num,
            )
        )
    return result


def process_telemetry_location(
    db: Session, payload: schemas.TelemetryPayload
) -> models.Train:
    train = db.query(models.Train).filter(models.Train.id == payload.train_id).first()
    if not train:
        raise ValueError(f"Train with ID '{payload.train_id}' not found.")

    now = payload.recorded_at or datetime.now(timezone.utc)

    train.latitude = payload.latitude
    train.longitude = payload.longitude
    train.speed = payload.speed or 0.0
    train.heading = payload.heading or 0.0
    train.status = "active"
    train.last_telemetry_at = now

    # Log location
    location_log = models.LocationLog(
        train_id=train.id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        speed=payload.speed or 0.0,
        heading=payload.heading or 0.0,
        recorded_at=now,
    )
    db.add(location_log)

    # Check delay alert creation (>5 mins)
    delay_mins = payload.delay_minutes or 0
    if delay_mins > 5:
        existing_alert = (
            db.query(models.DelayAlert)
            .filter(
                models.DelayAlert.train_id == train.id,
                models.DelayAlert.is_resolved.is_(False),
            )
            .first()
        )
        if existing_alert:
            existing_alert.delay_minutes = delay_mins
        else:
            new_alert = models.DelayAlert(
                train_id=train.id,
                delay_minutes=delay_mins,
                reason=f"Train delayed by {delay_mins} minutes based on GPS telemetry.",
                is_resolved=False,
            )
            db.add(new_alert)

    db.commit()
    db.refresh(train)
    return train
