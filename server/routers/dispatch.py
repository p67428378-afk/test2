from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models.user import User, UserRole
from server.models.tanker import Tanker, TankerStatus
from server.models.booking import Booking, BookingStatus
from server.schemas.booking import DispatchAssignRequest, BookingResponse
from server.auth import require_roles
from server.websocket import manager

router = APIRouter(prefix="/dispatch", tags=["Dispatch"])


@router.post("/assign", response_model=BookingResponse)
async def assign_dispatch(
    dispatch_in: DispatchAssignRequest,
    current_user: User = Depends(require_roles(UserRole.OPERATOR, UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    # 1. Fetch booking
    booking = db.query(Booking).filter(Booking.id == dispatch_in.booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )
    if booking.status != BookingStatus.PENDING_ASSIGNMENT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Booking is not pending assignment (current status: {booking.status.value})",
        )

    # 2. Fetch tanker
    tanker = db.query(Tanker).filter(Tanker.id == dispatch_in.tanker_id).first()
    if not tanker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Tanker not found"
        )
    if tanker.status == TankerStatus.IN_MAINTENANCE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot assign tanker currently in maintenance",
        )

    # 3. Capacity validation
    if tanker.capacity_liters < booking.volume_liters:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tanker capacity ({tanker.capacity_liters}L) is less than requested volume ({booking.volume_liters}L)",
        )

    # 4. Fetch driver
    driver = db.query(User).filter(User.id == dispatch_in.driver_id).first()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Driver user not found"
        )
    if driver.role != UserRole.DRIVER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assigned user must have the DRIVER role",
        )

    # 5. Update booking & tanker
    booking.status = BookingStatus.ASSIGNED
    booking.operator_id = current_user.id
    booking.driver_id = driver.id
    booking.tanker_id = tanker.id

    tanker.status = TankerStatus.IN_USE

    db.commit()
    db.refresh(booking)

    # 6. WS Broadcast
    await manager.broadcast(
        {
            "event": "BOOKING_ASSIGNED",
            "booking_id": booking.id,
            "status": booking.status.value,
            "driver_id": driver.id,
            "tanker_id": tanker.id,
        }
    )

    return booking
