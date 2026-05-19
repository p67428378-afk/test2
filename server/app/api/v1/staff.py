
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_staff_list():
    return {
        "staff": [
            {"id": "1", "name": "Alice", "role": "Manager"},
            {"id": "2", "name": "Bob", "role": "Receptionist"},
            {"id": "3", "name": "Charlie", "role": "Housekeeping"}
        ]
    }
