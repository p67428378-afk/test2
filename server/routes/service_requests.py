from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
import json
from typing import List, Optional
from server.database import get_db
from server.models import ServiceRequest, Alert
from server.schemas import (
    ServiceRequestCreate,
    ServiceRequestUpdate,
    ServiceRequestResponse,
)

router = APIRouter()


def parse_activity_log(log_str: Optional[str]) -> list:
    if not log_str:
        return []
    try:
        return json.loads(log_str)
    except Exception:
        return []


@router.get("/service-requests", response_model=List[ServiceRequestResponse])
def list_service_requests(
    status: Optional[str] = Query(
        None, description="Filter by status (New, In Progress, Resolved)"
    ),
    db: Session = Depends(get_db),
):
    query = db.query(ServiceRequest)
    if status:
        query = query.filter(ServiceRequest.status == status)

    requests = query.all()
    response_data = []
    for r in requests:
        response_data.append(
            ServiceRequestResponse(
                id=r.id,
                alert_id=r.alert_id,
                equipment=r.equipment,
                location=r.location,
                description=r.description,
                status=r.status,
                assigned_technician_id=r.assigned_technician_id,
                created_at=r.created_at,
                updated_at=r.updated_at,
                activity_log=parse_activity_log(r.activity_log_json),
            )
        )
    return response_data


@router.post("/service-requests", response_model=ServiceRequestResponse)
def create_service_request(
    payload: ServiceRequestCreate, db: Session = Depends(get_db)
):
    if payload.alert_id:
        alert = db.query(Alert).filter(Alert.id == payload.alert_id).first()
        if not alert:
            raise HTTPException(status_code=400, detail="Alert not found")

    new_request = ServiceRequest(
        alert_id=payload.alert_id,
        equipment=payload.equipment,
        location=payload.location,
        description=payload.description,
        status="New",
        activity_log_json=json.dumps([]),
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return ServiceRequestResponse(
        id=new_request.id,
        alert_id=new_request.alert_id,
        equipment=new_request.equipment,
        location=new_request.location,
        description=new_request.description,
        status=new_request.status,
        assigned_technician_id=new_request.assigned_technician_id,
        created_at=new_request.created_at,
        updated_at=new_request.updated_at,
        activity_log=[],
    )


@router.put("/service-requests/{id}", response_model=ServiceRequestResponse)
def update_service_request(
    id: str, payload: ServiceRequestUpdate, db: Session = Depends(get_db)
):
    req = db.query(ServiceRequest).filter(ServiceRequest.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Service request not found")

    valid_statuses = ["New", "In Progress", "Resolved"]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")

    req.status = payload.status
    req.updated_at = datetime.utcnow()

    logs = parse_activity_log(req.activity_log_json)
    action_text = f"Status changed to {payload.status}"

    logs.append(
        {
            "action": action_text,
            "author": "Alex Rivera",
            "comment": payload.comment or "",
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
    )
    req.activity_log_json = json.dumps(logs)

    db.commit()
    db.refresh(req)

    return ServiceRequestResponse(
        id=req.id,
        alert_id=req.alert_id,
        equipment=req.equipment,
        location=req.location,
        description=req.description,
        status=req.status,
        assigned_technician_id=req.assigned_technician_id,
        created_at=req.created_at,
        updated_at=req.updated_at,
        activity_log=logs,
    )
