"""
Module: admin
Purpose: Admin management router.
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.app.database import get_db
from server.app.models import User
from server.app.schemas import AdminMetricsResponse, AdminOrderResponse
from server.app.routers.auth import get_current_admin
from server.app import crud

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/metrics", response_model=AdminMetricsResponse)
def get_metrics(
    current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)
):
    """
    Get admin dashboard KPI metrics.
    """
    metrics = crud.get_admin_metrics(db)
    return AdminMetricsResponse(**metrics)


@router.get("/orders", response_model=List[AdminOrderResponse])
def get_orders(
    current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)
):
    """
    Get all customer orders for admin management.
    """
    orders = crud.get_all_orders_for_admin(db)
    return [
        AdminOrderResponse(
            id=o.id,
            customer_name=o.user.name if o.user else "Unknown Customer",
            status=o.status,
            total_price=o.total_price,
            created_at=o.created_at,
        )
        for o in orders
    ]
