
from fastapi import APIRouter
from typing import List, Optional

router = APIRouter()

@router.get("/")
def get_bookings(guestName: Optional[str] = None, roomNumber: Optional[str] = None, status: Optional[str] = None):
    # Dummy data
    return {"bookings": [{"id": "1", "guestName": "John Doe", "roomNumber": "101", "status": "confirmed"}] }

@router.post("/")
def create_booking(booking: dict):
    return {"id": "1", "status": "confirmed"}

@router.get("/{id}")
def get_booking(id: str):
    return {
        "id": id,
        "guestName": "John Doe",
        "roomNumber": "101",
        "checkInDate": "2024-05-20T00:00:00Z",
        "checkOutDate": "2024-05-22T00:00:00Z",
        "status": "confirmed",
        "totalAmount": 250.00,
        "paymentStatus": "paid"
    }

@router.put("/{id}")
def update_booking(id: str, booking: dict):
    return {"id": id, "status": booking.get("status", "confirmed")}

@router.delete("/{id}")
def cancel_booking(id: str):
    return {"message": f"Booking {id} cancelled"}
