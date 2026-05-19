
from fastapi import APIRouter

router = APIRouter()

@router.get("/availability")
def get_room_availability():
    return {
        "rooms": [
            {"id": "101", "type": "Standard", "status": "available"},
            {"id": "102", "type": "Deluxe", "status": "occupied"},
            {"id": "201", "type": "Suite", "status": "maintenance"}
        ]
    }
