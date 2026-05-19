
from fastapi import APIRouter
from typing import List, Optional

router = APIRouter()

bookings_data = [
    {"id": "1", "guestName": "John Doe", "roomNumber": "101", "status": "confirmed"},
    {"id": "2", "guestName": "Jane Smith", "roomNumber": "102", "status": "pending"},
    {"id": "3", "guestName": "John Doe", "roomNumber": "103", "status": "cancelled"},
]

@router.get("/")
def get_bookings(guestName: Optional[str] = None, roomNumber: Optional[str] = None, status: Optional[str] = None):
    filtered_bookings = bookings_data
    if guestName:
        filtered_bookings = [b for b in filtered_bookings if b["guestName"] == guestName]
    if roomNumber:
        filtered_bookings = [b for b in filtered_bookings if b["roomNumber"] == roomNumber]
    if status:
        filtered_bookings = [b for b in filtered_bookings if b["status"] == status]
    return {"bookings": filtered_bookings }

@router.post("/")
def create_booking(booking: dict):
    new_booking = {
        "id": str(len(bookings_data) + 1),
        "guestName": booking.get("guestName"),
        "roomNumber": booking.get("roomNumber"),
        "status": "confirmed"
    }
    bookings_data.append(new_booking)
    return new_booking

@router.get("/{id}")
def get_booking(id: str):
    for booking in bookings_data:
        if booking["id"] == id:
            return booking
    return {"error": "Booking not found"}

@router.put("/{id}")
def update_booking(id: str, booking_update: dict):
    for booking in bookings_data:
        if booking["id"] == id:
            booking["status"] = booking_update.get("status", booking["status"])
            return booking
    return {"error": "Booking not found"}

@router.delete("/{id}")
def cancel_booking(id: str):
    global bookings_data
    initial_len = len(bookings_data)
    bookings_data = [b for b in bookings_data if b["id"] != id]
    if len(bookings_data) < initial_len:
        return {"message": f"Booking {id} cancelled"}
    return {"error": "Booking not found"}
