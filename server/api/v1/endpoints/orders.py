from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server import crud, models
from server.api.v1.endpoints.auth import get_current_user
from server.database import get_db
from server.schemas import OrderCreate, OrderResponse, OrderStageUpdate

router = APIRouter()


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(get_current_user),
):
    # Operating hours check (08:00 to 20:00)
    if order_in.pickup_window_start.hour < 8 or order_in.pickup_window_end.hour > 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Requested pickup window is outside operating hours (08:00 - 20:00)",
        )
    if order_in.pickup_window_start >= order_in.pickup_window_end:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pickup window start time must be before end time",
        )

    # Capacity check (max 5 orders per pickup window start hour)
    existing_count = (
        db.query(models.Order)
        .filter(models.Order.pickup_window_start == order_in.pickup_window_start)
        .count()
    )
    if existing_count >= 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Requested pickup window is fully booked. Please select an alternative time slot.",
        )

    customer_id = order_in.customer_id or (
        current_user.id if current_user else "guest_customer"
    )
    # Verify customer exists or assign current_user
    cust = crud.get_user_by_id(db, customer_id)
    if not cust and current_user:
        customer_id = current_user.id

    return crud.create_order(db=db, order_in=order_in, customer_id=customer_id)


@router.get("", response_model=list[OrderResponse])
def list_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    customer_id: str | None = None,
    order_status: str | None = Query(None, alias="status"),
    db: Session = Depends(get_db),
):
    return crud.list_orders(
        db=db, skip=skip, limit=limit, customer_id=customer_id, status=order_status
    )


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = crud.get_order(db=db, order_id=order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )
    return order


@router.patch("/{order_id}/stage", response_model=OrderResponse)
def update_order_stage(
    order_id: str,
    stage_in: OrderStageUpdate,
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(get_current_user),
):
    order = crud.get_order(db=db, order_id=order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    updater_id = stage_in.updated_by or (current_user.id if current_user else None)
    return crud.update_order_stage(
        db=db,
        order=order,
        stage_name=stage_in.stage,
        notes=stage_in.notes,
        weight_kg=stage_in.weight_kg,
        item_count=stage_in.item_count,
        updated_by=updater_id,
    )
