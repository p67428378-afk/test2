"""
Module: server.routers.admin
Purpose: Admin router.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from server.database import get_db
from server.models.user import User
from server.models.restaurant import Restaurant
from server.models.order import Order
from server.models.ticket import SupportTicket
from server.routers.auth import get_current_user
from server.schemas.ticket import TicketCreate, TicketResponse
from server.schemas.user import UserResponse, UserUpdate
from server.schemas.order import OrderResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/metrics")
def get_metrics(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """
    Get platform health metrics for administrators.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can access metrics",
        )

    active_drivers = (
        db.query(User).filter(User.role == "delivery", User.is_online).count()
    )
    active_restaurants = db.query(Restaurant).count()
    active_users = db.query(User).count()
    total_orders = db.query(Order).count()

    # Calculate total revenue (sum of total_amount of paid orders)
    total_revenue_query = (
        db.query(func.sum(Order.total_amount))
        .filter(Order.payment_status == "paid")
        .scalar()
    )
    total_revenue = (
        float(total_revenue_query) if total_revenue_query is not None else 0.0
    )

    return {
        "active_drivers": active_drivers,
        "active_restaurants": active_restaurants,
        "active_users": active_users,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
    }


@router.get("/users", response_model=List[UserResponse])
def list_users(
    role: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all users (customers, restaurants, delivery partners) - Admin only (AC 13).
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can view users",
        )

    query = db.query(User)
    if role:
        query = query.filter(User.role == role)

    return query.order_by(User.created_at.desc()).all()


@router.put("/users/{id}", response_model=UserResponse)
def update_user_by_admin(
    id: str,
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update user details or role - Admin only (AC 13).
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can update users",
        )

    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    for field, value in payload.model_dump(exclude_unset=True).items():
        if field == "password" and value:
            from server.routers.auth import get_password_hash

            user.hashed_password = get_password_hash(value)  # type: ignore
        else:
            setattr(user, field, value)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_by_admin(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete user - Admin only (AC 13).
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete users",
        )

    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    db.delete(user)
    db.commit()
    return None


@router.post("/orders/{id}/refund", response_model=OrderResponse)
def process_refund(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Process refund for an order - Admin only (AC 14).
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can process refunds",
        )

    order = db.query(Order).filter(Order.id == id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    if order.payment_status != "paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only refund paid orders",
        )

    order.payment_status = "refunded"  # type: ignore
    order.status = "cancelled"  # type: ignore

    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/tickets", response_model=List[TicketResponse])
def list_tickets(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """
    Get support tickets for administrators.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can access support tickets",
        )

    tickets = db.query(SupportTicket).options(joinedload(SupportTicket.user)).all()

    # Map to TicketResponse
    result = []
    for t in tickets:
        user_name = t.user.full_name if t.user else "Unknown User"
        result.append(
            {
                "id": t.id,
                "user_id": t.user_id,
                "user_name": user_name,
                "issue_type": t.issue_type,
                "description": t.description,
                "status": t.status,
                "created_at": t.created_at,
            }
        )
    return result


@router.post(
    "/tickets", response_model=TicketResponse, status_code=status.HTTP_201_CREATED
)
def create_ticket(
    payload: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a support ticket (open to all logged in users).
    """
    db_ticket = SupportTicket(
        user_id=current_user.id,
        issue_type=payload.issue_type,
        description=payload.description,
        status="open",
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)

    return {
        "id": db_ticket.id,
        "user_id": db_ticket.user_id,
        "user_name": current_user.full_name,
        "issue_type": db_ticket.issue_type,
        "description": db_ticket.description,
        "status": db_ticket.status,
        "created_at": db_ticket.created_at,
    }


@router.put("/tickets/{id}/resolve", response_model=TicketResponse)
def resolve_ticket(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Resolve a support ticket (admin only).
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can resolve support tickets",
        )

    ticket = (
        db.query(SupportTicket)
        .options(joinedload(SupportTicket.user))
        .filter(SupportTicket.id == id)
        .first()
    )
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Support ticket not found"
        )

    ticket.status = "resolved"  # type: ignore
    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    user_name = ticket.user.full_name if ticket.user else "Unknown User"
    return {
        "id": ticket.id,
        "user_id": ticket.user_id,
        "user_name": user_name,
        "issue_type": ticket.issue_type,
        "description": ticket.description,
        "status": ticket.status,
        "created_at": ticket.created_at,
    }
