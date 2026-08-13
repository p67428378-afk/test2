from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models.user import User, UserRole
from server.models.tanker import Tanker, TankerStatus
from server.models.booking import Booking, BookingStatus
from server.schemas.booking import DeliveryStatusUpdateRequest, BookingResponse
from server.auth import require_roles
from server.websocket import manager

router = APIRouter(prefix="/deliveries", tags=["Deliveries"])

ALLOWED_TRANSITIONS = {
    BookingStatus.PENDING_ASSIGNMENT: [BookingStatus.ASSIGNED, BookingStatus.CANCELLED],
    BookingStatus.ASSIGNED: [BookingStatus.EN_ROUTE, BookingStatus.CANCELLED],
    BookingStatus.EN_ROUTE: [BookingStatus.ARRIVED, BookingStatus.CANCELLED],
    BookingStatus.ARRIVED: [BookingStatus.DISCHARGING, BookingStatus.CANCELLED],
    BookingStatus.DISCHARGING: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
    BookingStatus.COMPLETED: [],
    BookingStatus.CANCELLED: [],
}


@router.patch("/{booking_id}/status", response_model=BookingResponse)
async def update_delivery_status(
    booking_id: str,
    status_in: DeliveryStatusUpdateRequest,
    current_user: User = Depends(
        require_roles(UserRole.DRIVER, UserRole.OPERATOR, UserRole.ADMIN)
    ),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )

    # Driver authorization check: if user is DRIVER, they must be the assigned driver
    if current_user.role == UserRole.DRIVER and booking.driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Driver can only update status for assigned bookings",
        )

    # State transition check
    valid_next_states = ALLOWED_TRANSITIONS.get(booking.status, [])
    if status_in.status not in valid_next_states and status_in.status != booking.status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid state transition from '{booking.status.value}' to '{status_in.status.value}'",
        )

    booking.status = status_in.status

    # Free up tanker if completed or cancelled
    if (
        status_in.status in [BookingStatus.COMPLETED, BookingStatus.CANCELLED]
        and booking.tanker_id
    ):
        tanker = db.query(Tanker).filter(Tanker.id == booking.tanker_id).first()
        if tanker:
            tanker.status = TankerStatus.AVAILABLE

    db.commit()
    db.refresh(booking)

    # WS Broadcast
    await manager.broadcast(
        {
            "event": "DELIVERY_STATUS_UPDATED",
            "booking_id": booking.id,
            "status": booking.status.value,
        }
    )

    return booking
