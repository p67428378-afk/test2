from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import ServiceRequest, User
from server.schemas import (
    ServiceRequestResponse,
    ServiceRequestUpdateRequest,
    ServiceRequestUpdateResponse,
)
from server.auth import get_current_user

router = APIRouter()


@router.get("/service-requests", response_model=List[ServiceRequestResponse])
def get_service_requests(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    # Check if user is technician
    if current_user.role != "technician":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="User is not a technician"
        )

    # Fetch service requests assigned to this technician or unassigned
    requests = (
        db.query(ServiceRequest)
        .filter(
            (ServiceRequest.technician_id == current_user.id)
            | (ServiceRequest.technician_id == None)
        )
        .all()
    )

    response_data = []
    for req in requests:
        alert = req.alert
        system = alert.system if alert else None
        customer = system.user if system else None

        response_data.append(
            {
                "id": req.id,
                "system_id": system.id if system else None,
                "customer_name": customer.name if customer else "Unknown",
                "alert_details": alert.description if alert else "No details",
                "status": req.status,
                "created_at": req.created_at,
            }
        )

    return response_data


@router.put(
    "/service-requests/{request_id}", response_model=ServiceRequestUpdateResponse
)
def update_service_request(
    request_id: UUID,
    update_data: ServiceRequestUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check if user is technician
    if current_user.role != "technician":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not authorized to update this request",
        )

    req = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Service request not found"
        )

    # Assign to current technician if not already assigned
    if not req.technician_id:
        req.technician_id = current_user.id

    req.status = update_data.status
    if update_data.notes is not None:
        req.notes = update_data.notes

    db.commit()
    db.refresh(req)

    return req
