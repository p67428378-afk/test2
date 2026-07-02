from datetime import datetime, timezone
from sqlalchemy.orm import Session
from server.app.models import Incident, SLA
from server.app.services.notifications import notify_sla_breach


def check_sla_breaches(db: Session):
    # Fetch all open incidents
    open_incidents = (
        db.query(Incident).filter(Incident.status.in_(["Open", "In Progress"])).all()
    )
    now = datetime.now(timezone.utc)

    # Fetch all SLAs
    slas = {sla.priority: sla for sla in db.query(SLA).all()}

    # Default SLAs if not in DB
    default_slas = {
        "High": 60,  # 1 hour
        "Medium": 120,  # 2 hours
        "Low": 240,  # 4 hours
    }

    breached_count = 0

    for incident in open_incidents:
        # Calculate elapsed time in minutes
        created_at_utc = (
            incident.created_at.replace(tzinfo=timezone.utc)
            if incident.created_at.tzinfo is None
            else incident.created_at
        )
        elapsed_minutes = (now - created_at_utc).total_seconds() / 60.0

        # Get SLA limit
        sla_limit = default_slas.get(incident.priority, 60)
        if incident.priority in slas:
            sla_limit = slas[incident.priority].resolution_time

        if elapsed_minutes > sla_limit:
            # Check if already escalated to avoid duplicate notifications
            if (
                not incident.internal_notes
                or "[SLA BREACH]" not in incident.internal_notes
            ):
                # Escalate
                escalation_note = (
                    f"\n[SLA BREACH] Escalated to Tier 2 support at {now.isoformat()}."
                )
                if incident.internal_notes:
                    incident.internal_notes += escalation_note
                else:
                    incident.internal_notes = escalation_note.strip()

                # Send notification
                notify_sla_breach(incident.id, incident.priority, elapsed_minutes)
                breached_count += 1

    if breached_count > 0:
        db.commit()

    return breached_count
