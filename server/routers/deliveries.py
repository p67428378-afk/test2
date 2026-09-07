import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from server.database import get_db
import server.models as models
import server.schemas as schemas

router = APIRouter(prefix="/api/v1/deliveries", tags=["Delivery Package Management"])
logger = logging.getLogger(__name__)


def send_resident_delivery_notification(
    unit_number: str, courier_name: str, delivery_id: str
) -> str:
    """Simulate push/in-app notification dispatch to resident unit."""
    msg = f"Notification dispatched to Resident at {unit_number}: Package from {courier_name} arrived (ID: {delivery_id})"
    logger.info(msg)
    return "DELIVERED_TO_RESIDENT"


def ensure_utc(dt: datetime) -> datetime:
    if dt is None:
        return dt
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def check_is_overdue(logged_at: datetime, status_str: str) -> bool:
    if status_str != "PENDING_PICKUP":
        return False
    now = datetime.now(timezone.utc)
    logged_utc = ensure_utc(logged_at)
    return (now - logged_utc) > timedelta(hours=48)


@router.post(
    "", response_model=schemas.DeliveryResponse, status_code=status.HTTP_201_CREATED
)
def log_delivery_package(
    payload: schemas.DeliveryCreate, db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    delivery_id = str(uuid.uuid4())

    delivery = models.Delivery(
        id=delivery_id,
        unit_number=payload.unit_number,
        courier_name=payload.courier_name,
        tracking_number=payload.tracking_number,
        package_description=payload.package_description,
        status="PENDING_PICKUP",
        logged_at=now,
    )
    db.add(delivery)
    db.commit()
    db.refresh(delivery)

    notif_status = send_resident_delivery_notification(
        payload.unit_number, payload.courier_name, delivery.id
    )

    return schemas.DeliveryResponse(
        delivery_id=delivery.id,
        id=delivery.id,
        unit_number=delivery.unit_number,
        courier_name=delivery.courier_name,
        tracking_number=delivery.tracking_number,
        package_description=delivery.package_description,
        status=delivery.status,
        logged_at=ensure_utc(delivery.logged_at),
        collected_at=ensure_utc(delivery.collected_at),
        is_overdue=False,
        notification_sent=True,
        notification_status=notif_status,
    )


@router.get("", response_model=List[schemas.DeliveryResponse])
def list_deliveries(
    unit_number: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Delivery)

    if unit_number:
        query = query.filter(models.Delivery.unit_number == unit_number)
    if status:
        query = query.filter(models.Delivery.status == status)

    deliveries = query.order_by(models.Delivery.logged_at.desc()).all()

    return [
        schemas.DeliveryResponse(
            delivery_id=d.id,
            id=d.id,
            unit_number=d.unit_number,
            courier_name=d.courier_name,
            tracking_number=d.tracking_number,
            package_description=d.package_description,
            status=d.status,
            logged_at=ensure_utc(d.logged_at),
            collected_at=ensure_utc(d.collected_at),
            is_overdue=check_is_overdue(d.logged_at, d.status),
            notification_sent=True,
            notification_status="DELIVERED_TO_RESIDENT",
        )
        for d in deliveries
    ]


@router.get("/overdue", response_model=List[schemas.DeliveryResponse])
def get_overdue_deliveries(db: Session = Depends(get_db)):
    cutoff = datetime.now(timezone.utc) - timedelta(hours=48)
    deliveries = (
        db.query(models.Delivery)
        .filter(
            models.Delivery.status == "PENDING_PICKUP",
            models.Delivery.logged_at <= cutoff,
        )
        .order_by(models.Delivery.logged_at.asc())
        .all()
    )

    for d in deliveries:
        logger.info(
            f"48-hour reminder alert sent to resident at {d.unit_number} for delivery {d.id}"
        )

    return [
        schemas.DeliveryResponse(
            delivery_id=d.id,
            id=d.id,
            unit_number=d.unit_number,
            courier_name=d.courier_name,
            tracking_number=d.tracking_number,
            package_description=d.package_description,
            status=d.status,
            logged_at=ensure_utc(d.logged_at),
            collected_at=ensure_utc(d.collected_at),
            is_overdue=True,
            notification_sent=True,
            notification_status="OVERDUE_REMINDER_SENT",
        )
        for d in deliveries
    ]


@router.post("/{delivery_id}/collect", response_model=schemas.DeliveryResponse)
@router.patch("/{delivery_id}/collect", response_model=schemas.DeliveryResponse)
@router.put("/{delivery_id}/collect", response_model=schemas.DeliveryResponse)
def collect_delivery_package(
    delivery_id: str,
    payload: Optional[schemas.DeliveryCollectRequest] = None,
    db: Session = Depends(get_db),
):
    delivery = (
        db.query(models.Delivery).filter(models.Delivery.id == delivery_id).first()
    )
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Delivery package {delivery_id} not found",
        )

    now = datetime.now(timezone.utc)
    delivery.status = "COLLECTED"
    delivery.collected_at = now
    db.commit()
    db.refresh(delivery)

    return schemas.DeliveryResponse(
        delivery_id=delivery.id,
        id=delivery.id,
        unit_number=delivery.unit_number,
        courier_name=delivery.courier_name,
        tracking_number=delivery.tracking_number,
        package_description=delivery.package_description,
        status=delivery.status,
        logged_at=ensure_utc(delivery.logged_at),
        collected_at=ensure_utc(delivery.collected_at),
        is_overdue=False,
        notification_sent=True,
        notification_status="PICKUP_ACKNOWLEDGED",
    )
