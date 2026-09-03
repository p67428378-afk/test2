"""Dashboard metrics and real-time status widget endpoints for interactive controls."""

from datetime import datetime
from typing import Any, Dict, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import (
    Package,
    Payment,
    Photographer,
    PhotoshootRecord,
    Session as StudioSession,
)

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])


@router.get("/metrics")
def get_dashboard_metrics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    sessions = db.query(StudioSession).all()
    packages = db.query(Package).all()
    payments = db.query(Payment).all()
    photographers = db.query(Photographer).all()
    photoshoots = db.query(PhotoshootRecord).all()

    total_sessions = len(sessions)
    completed_sessions = sum(
        1 for s in sessions if str(s.status).lower() in ["completed", "complete"]
    )
    in_progress_sessions = sum(
        1 for s in sessions if str(s.status).lower() in ["in_progress", "confirmed"]
    )

    total_revenue = sum(
        float(p.amount)
        for p in payments
        if str(p.payment_status) in ["Paid", "Partial"]
    )

    outstanding_balance = 0.0
    pending_payments_count = 0
    for s in sessions:
        session_paid = sum(
            float(p.amount)
            for p in s.payments
            if str(p.payment_status) in ["Paid", "Partial"]
        )
        remaining = max(0.0, float(s.total_price) - session_paid)
        if remaining > 0.0:
            outstanding_balance += remaining
            pending_payments_count += 1

    return {
        "total_sessions": total_sessions,
        "completed_sessions": completed_sessions,
        "in_progress_sessions": in_progress_sessions,
        "pending_payments_count": pending_payments_count,
        "total_revenue": round(total_revenue, 2),
        "outstanding_balance": round(outstanding_balance, 2),
        "active_packages_count": len(packages),
        "active_photographers_count": sum(1 for p in photographers if p.is_active),
        "completed_photoshoot_records_count": sum(
            1 for r in photoshoots if r.is_completed
        ),
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


@router.get("/status-widgets")
def get_status_widgets(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    now = datetime.utcnow()
    active_holds = (
        db.query(StudioSession)
        .filter(
            StudioSession.status == "Pending Payment",
            StudioSession.hold_expires_at > now,
        )
        .count()
    )
    conflicts_count = (
        db.query(PhotoshootRecord)
        .filter(PhotoshootRecord.unpaid_balance_warning == True)  # noqa: E712
        .count()
    )

    return [
        {
            "id": "slot-hold-monitor",
            "name": "15-Minute Slot Hold Monitor",
            "status": "Active" if active_holds > 0 else "Idle",
            "value": active_holds,
            "unit": "active holds",
            "indicator": "amber" if active_holds > 0 else "gray",
        },
        {
            "id": "unpaid-balance-alerts",
            "name": "Unpaid Balance Alerts",
            "status": "Alert" if conflicts_count > 0 else "Nominal",
            "value": conflicts_count,
            "unit": "pending notices",
            "indicator": "red" if conflicts_count > 0 else "green",
        },
        {
            "id": "gallery-sync-engine",
            "name": "Aura Proof Gallery Sync",
            "status": "Healthy",
            "value": "100%",
            "unit": "uptime",
            "indicator": "green",
        },
    ]
