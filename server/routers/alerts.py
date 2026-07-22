from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from server.database import get_db
from server.models import Component, Certification, MaintenanceEvent, User
from server.schemas import TriggerAlertsResponse
from server.services.email import send_alert_email
from server.auth import get_current_user

router = APIRouter()


@router.post("/alerts/trigger", response_model=TriggerAlertsResponse)
def trigger_alerts(
    intervals: List[int] = Query([30, 60, 90]),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()
    alerts_sent = 0

    # 1. Check for expired or expiring certifications
    certs = db.query(Certification).all()
    for cert in certs:
        comp = db.query(Component).filter(Component.id == cert.component_id).first()
        if not comp:
            continue

        engineer = (
            db.query(User).filter(User.id == comp.responsible_engineer_id).first()
            if comp.responsible_engineer_id
            else None
        )
        recipient_email = engineer.email if engineer else "engineer@astrotrack.local"
        recipient_name = engineer.full_name if engineer else "Responsible Engineer"

        # Expired
        if cert.expiry_date < today:
            subject = f"CRITICAL: Certification Expired for {comp.name}"
            body = f"Hello {recipient_name},\n\nThe certification '{cert.name}' for component '{comp.name}' (ID: {comp.id}) expired on {cert.expiry_date}.\n\nPlease take immediate action.\n\nBest regards,\nAstroTrack System"
            send_alert_email(recipient_email, subject, body)
            alerts_sent += 1

        # Expiring in 30, 60, 90 days
        else:
            days_until_expiry = (cert.expiry_date - today).days
            if days_until_expiry in intervals:
                subject = f"WARNING: Certification Expiring in {days_until_expiry} Days for {comp.name}"
                body = f"Hello {recipient_name},\n\nThe certification '{cert.name}' for component '{comp.name}' (ID: {comp.id}) will expire on {cert.expiry_date} ({days_until_expiry} days from now).\n\nPlease schedule a recertification.\n\nBest regards,\nAstroTrack System"
                send_alert_email(recipient_email, subject, body)
                alerts_sent += 1

    # 2. Check for upcoming maintenance events
    events = (
        db.query(MaintenanceEvent)
        .filter(MaintenanceEvent.completion_date == None)
        .all()
    )
    for event in events:
        comp = db.query(Component).filter(Component.id == event.component_id).first()
        if not comp:
            continue

        engineer = (
            db.query(User).filter(User.id == comp.responsible_engineer_id).first()
            if comp.responsible_engineer_id
            else None
        )
        recipient_email = engineer.email if engineer else "engineer@astrotrack.local"
        recipient_name = engineer.full_name if engineer else "Responsible Engineer"

        days_until_maint = (event.scheduled_date - today).days
        if days_until_maint < 0:
            # Overdue
            subject = f"CRITICAL: Maintenance Overdue for {comp.name}"
            body = f"Hello {recipient_name},\n\nThe scheduled {event.event_type} for component '{comp.name}' (ID: {comp.id}) was due on {event.scheduled_date} and is now overdue.\n\nPlease complete this maintenance immediately.\n\nBest regards,\nAstroTrack System"
            send_alert_email(recipient_email, subject, body)
            alerts_sent += 1
        elif (
            days_until_maint in intervals or days_until_maint <= 7
        ):  # Also alert if within a week
            subject = f"REMINDER: Upcoming {event.event_type} for {comp.name}"
            body = f"Hello {recipient_name},\n\nA {event.event_type} is scheduled for component '{comp.name}' (ID: {comp.id}) on {event.scheduled_date} ({days_until_maint} days from now).\n\nPlease ensure preparation is complete.\n\nBest regards,\nAstroTrack System"
            send_alert_email(recipient_email, subject, body)
            alerts_sent += 1

    return {
        "alerts_sent": alerts_sent,
        "detail": f"Alert check completed. {alerts_sent} alerts sent.",
    }
