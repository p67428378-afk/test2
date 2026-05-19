
from fastapi import APIRouter

router = APIRouter()

@router.get("/reports/daily-revenue")
def get_daily_revenue_report():
    return {
        "date": "2024-05-20",
        "totalRevenue": 15000.75,
        "revenueBreakdown": {
            "roomCharges": 12000.50,
            "foodAndBeverage": 2500.25,
            "otherServices": 500.00
        },
        "pendingDues": 1200.00
    }
