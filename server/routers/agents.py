from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import schemas, crud, auth, models

router = APIRouter()


@router.post(
    "/agents", response_model=schemas.AgentResponse, status_code=status.HTTP_201_CREATED
)
def add_agent(
    agent_in: schemas.AgentCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(auth.get_current_admin),
):
    agent = crud.create_delivery_agent(db, agent_in)
    db.commit()
    db.refresh(agent)
    return agent


@router.get("/agents", response_model=schemas.AgentListResponse)
def list_agents(
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(auth.get_current_admin),
):
    agents = crud.get_delivery_agents(db)
    items = []
    for a in agents:
        items.append(
            schemas.AgentListItem(
                id=a["id"],
                full_name=a["full_name"],
                phone_number=a["phone_number"],
                status=a["status"],
                active_shipments_count=a["active_shipments_count"],
            )
        )
    return schemas.AgentListResponse(items=items)


@router.post(
    "/shipments/{shipment_id}/assign", response_model=schemas.AgentAssignResponse
)
def assign_agent(
    shipment_id: str,
    payload: schemas.AgentAssignRequest,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(auth.get_current_admin),
):
    shipment = (
        db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
    )
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Shipment not found"
        )

    agent = (
        db.query(models.DeliveryAgent)
        .filter(models.DeliveryAgent.id == payload.agent_id)
        .first()
    )
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found"
        )

    updated_shipment = crud.assign_agent_to_shipment(db, shipment_id, payload.agent_id)
    db.commit()
    db.refresh(updated_shipment)

    return schemas.AgentAssignResponse(
        shipment_id=updated_shipment.id,
        agent_id=updated_shipment.agent_id,
        status=updated_shipment.status,
        updated_at=updated_shipment.updated_at,
    )


@router.post(
    "/shipments/{shipment_id}/status",
    response_model=schemas.ShipmentStatusUpdateResponse,
)
def update_status(
    shipment_id: str,
    payload: schemas.ShipmentStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(auth.get_current_admin),
):
    shipment = (
        db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
    )
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Shipment not found"
        )

    updated_shipment = crud.update_shipment_status(
        db,
        shipment_id=shipment_id,
        status=payload.status,
        location=payload.location,
        notes=payload.notes,
    )
    db.commit()
    db.refresh(updated_shipment)

    return schemas.ShipmentStatusUpdateResponse(
        shipment_id=updated_shipment.id,
        status=updated_shipment.status,
        updated_at=updated_shipment.updated_at,
    )
