
from fastapi import APIRouter

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary():
    return {
        "todaysRevenue": 12000.50,
        "totalBookings": 150,
        "availableRooms": 25,
        "recentActivities": [
            {"activity": "Booking #123 created"},
            {"activity": "Guest John Doe checked in"},
        ]
    }
