from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from server.app.database import get_db
from server.app.models import Incident, RCAReport, User
from server.app.schemas import (
    IncidentCreate,
    IncidentResponse,
    IncidentListResponse,
    IncidentUpdate,
    RCAReportResponse,
    RCAReportDetailResponse,
    RCAReportCreate,
)
from server.app.services.notifications import notify_status_update
from server.app.services.sla_tracker import check_sla_breaches

router = APIRouter()


@router.post(
    "/incidents", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED
)
def create_incident(incident_in: IncidentCreate, db: Session = Depends(get_db)):
    # Generate title automatically
    title = f"Outage: {incident_in.affected_system} - {incident_in.priority} Priority"

    db_incident = Incident(
        title=title,
        description=incident_in.description,
        status="Open",
        priority=incident_in.priority,
        affected_system=incident_in.affected_system,
        reporter_name=incident_in.reporter_name,
        reporter_email=incident_in.reporter_email,
        occurred_at=incident_in.occurred_at,
    )
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)

    # Trigger SLA check immediately
    check_sla_breaches(db)

    return db_incident


@router.get("/incidents", response_model=IncidentListResponse)
def list_incidents(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    # Trigger SLA check on list to ensure up-to-date breach tracking
    check_sla_breaches(db)

    query = db.query(Incident)
    total = query.count()
    items = query.order_by(Incident.created_at.desc()).offset(skip).limit(limit).all()

    return {"items": items, "total": total}


@router.put("/incidents/{incident_id}", response_model=IncidentResponse)
def update_incident(
    incident_id: str, incident_in: IncidentUpdate, db: Session = Depends(get_db)
):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    old_status = incident.status

    # Validate assignee if provided
    if incident_in.assignee_id is not None:
        user = db.query(User).filter(User.id == incident_in.assignee_id).first()
        if not user:
            raise HTTPException(status_code=400, detail="Assignee user not found")
        incident.assignee_id = incident_in.assignee_id

    if incident_in.internal_notes is not None:
        incident.internal_notes = incident_in.internal_notes

    if incident_in.priority is not None:
        incident.priority = incident_in.priority

    if incident_in.status is not None:
        # Validate status transition if needed (e.g., cannot go back from Closed to Open, etc.)
        # For simplicity, allow any transition but check if it's valid
        incident.status = incident_in.status

    incident.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(incident)

    # Trigger notifications if status changed
    if incident_in.status is not None and incident_in.status != old_status:
        notify_status_update(
            incident.reporter_email, incident.id, old_status, incident_in.status
        )

        # Automatically generate draft RCA report if status is updated to 'Resolved'
        if incident_in.status == "Resolved":
            existing_rca = (
                db.query(RCAReport).filter(RCAReport.incident_id == incident.id).first()
            )
            if not existing_rca:
                draft_content = (
                    f"Root Cause Analysis for Incident {incident.id}\n\n"
                    f"Affected System: {incident.affected_system}\n"
                    f"Description: {incident.description}\n"
                    f"Resolution: Draft RCA generated automatically upon resolution."
                )
                rca = RCAReport(incident_id=incident.id, content=draft_content)
                db.add(rca)
                db.commit()

    return incident


@router.get("/incidents/{incident_id}/rca", response_model=RCAReportDetailResponse)
def get_rca_report(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    rca = db.query(RCAReport).filter(RCAReport.incident_id == incident_id).first()
    if not rca:
        raise HTTPException(status_code=404, detail="RCA report not found")

    # Generate timeline
    timeline = [
        f"Incident occurred at {incident.occurred_at.isoformat()}",
        f"Incident reported at {incident.created_at.isoformat()}",
    ]
    if incident.status in ["Resolved", "Closed"]:
        timeline.append(
            f"Incident resolved/closed at {incident.updated_at.isoformat()}"
        )

    return {
        "id": rca.id,
        "incident_id": rca.incident_id,
        "content": rca.content,
        "timeline": timeline,
        "created_at": rca.created_at,
        "updated_at": rca.updated_at,
    }


@router.post("/incidents/{incident_id}/rca", response_model=RCAReportResponse)
def create_or_update_rca_report(
    incident_id: str, rca_in: RCAReportCreate, db: Session = Depends(get_db)
):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    if incident.status != "Resolved":
        raise HTTPException(status_code=400, detail="Incident is not resolved yet")

    rca = db.query(RCAReport).filter(RCAReport.incident_id == incident_id).first()
    if rca:
        # Update existing
        rca.content = rca_in.content
        rca.updated_at = datetime.now(timezone.utc)
    else:
        # Create new
        rca = RCAReport(incident_id=incident_id, content=rca_in.content)
        db.add(rca)

    db.commit()
    db.refresh(rca)
    return rca
