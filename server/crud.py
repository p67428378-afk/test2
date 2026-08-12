from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from server.models import User, Order, GarmentStage, DriverRoute, Payment
from server.schemas import UserCreate, OrderCreate
from server.core.security import get_password_hash


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user_in: UserCreate) -> User:
    hashed = get_password_hash(user_in.password)
    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        role=user_in.role or "CUSTOMER",
        hashed_password=hashed,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def calculate_order_amount(
    service_type: str, weight_kg: Optional[float], item_count: Optional[int]
) -> float:
    base = 10.0
    weight = weight_kg or 1.0
    items = item_count or 1
    if service_type == "WASH_AND_FOLD":
        return round(base + (weight * 5.0), 2)
    elif service_type == "DRY_CLEANING":
        return round(base + (items * 8.0), 2)
    elif service_type == "IRONING_ONLY":
        return round(base + (items * 3.0), 2)
    return round(base + (weight * 4.0), 2)


def create_order(db: Session, order_in: OrderCreate, customer_id: str) -> Order:
    amount = calculate_order_amount(
        order_in.service_type, order_in.weight_kg, order_in.item_count
    )
    order = Order(
        customer_id=customer_id,
        service_type=order_in.service_type,
        status="SCHEDULED_FOR_PICKUP",
        pickup_window_start=order_in.pickup_window_start,
        pickup_window_end=order_in.pickup_window_end,
        delivery_window_start=order_in.delivery_window_start,
        delivery_window_end=order_in.delivery_window_end,
        weight_kg=order_in.weight_kg,
        item_count=order_in.item_count,
        total_amount=amount,
        payment_status="PENDING",
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    stage = GarmentStage(
        order_id=str(order.id),
        stage="RECEIVED",
        notes="Order created and scheduled for pickup",
        timestamp=datetime.utcnow(),
    )
    db.add(stage)
    db.commit()
    db.refresh(order)
    return order


def get_order(db: Session, order_id: str) -> Optional[Order]:
    return db.query(Order).filter(Order.id == order_id).first()


def list_orders(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    customer_id: Optional[str] = None,
    status: Optional[str] = None,
) -> List[Order]:
    query = db.query(Order)
    if customer_id:
        query = query.filter(Order.customer_id == customer_id)
    if status:
        query = query.filter(Order.status == status)
    return query.offset(skip).limit(limit).all()


def update_order_stage(
    db: Session,
    order: Order,
    stage_name: str,
    notes: Optional[str] = None,
    weight_kg: Optional[float] = None,
    item_count: Optional[int] = None,
    updated_by: Optional[str] = None,
) -> Order:
    if weight_kg is not None:
        setattr(order, "weight_kg", weight_kg)
    if item_count is not None:
        setattr(order, "item_count", item_count)
    if weight_kg is not None or item_count is not None:
        setattr(
            order,
            "total_amount",
            calculate_order_amount(
                str(order.service_type), order.weight_kg, order.item_count
            ),
        )

    stage_upper = stage_name.upper()
    if stage_upper in ["RECEIVED", "SORTING", "WASHING", "DRYING", "IRONING"]:
        setattr(order, "status", "IN_PROCESS")
    elif stage_upper in ["READY_FOR_DELIVERY", "READY"]:
        setattr(order, "status", "READY_FOR_DELIVERY")
    elif stage_upper == "SPECIAL_PROCESSING":
        setattr(order, "status", "SPECIAL_PROCESSING")
    elif stage_upper == "COMPLETED":
        setattr(order, "status", "COMPLETED")

    stage_record = GarmentStage(
        order_id=str(order.id),
        stage=stage_upper,
        notes=notes or f"Updated stage to {stage_upper}",
        updated_by=updated_by,
        timestamp=datetime.utcnow(),
    )
    db.add(stage_record)
    db.commit()
    db.refresh(order)
    return order


def get_driver_routes(
    db: Session, driver_id: str, zone: Optional[str] = None
) -> List[DriverRoute]:
    query = db.query(DriverRoute).filter(DriverRoute.driver_id == driver_id)
    if zone:
        query = query.filter(DriverRoute.zone == zone)
    routes = query.order_by(DriverRoute.sequence_order.asc()).all()

    # Generate optimized route sequence by pickup/delivery time windows and zone proximity
    if not routes:
        orders = (
            db.query(Order).order_by(Order.pickup_window_start.asc()).limit(5).all()
        )
        for idx, ord_obj in enumerate(orders):
            dr = DriverRoute(
                driver_id=driver_id,
                zone=zone or "Zone 1",
                sequence_order=idx + 1,
                order_id=str(ord_obj.id),
                stop_type="PICKUP"
                if ord_obj.status == "SCHEDULED_FOR_PICKUP"
                else "DELIVERY",
                stop_status="EN_ROUTE",
            )
            db.add(dr)
        db.commit()
        routes = (
            db.query(DriverRoute)
            .filter(DriverRoute.driver_id == driver_id)
            .order_by(DriverRoute.sequence_order.asc())
            .all()
        )
    return routes


def update_stop_status(
    db: Session, stop_id: str, stop_status: str
) -> Optional[DriverRoute]:
    stop = db.query(DriverRoute).filter(DriverRoute.id == stop_id).first()
    if not stop:
        return None
    setattr(stop, "stop_status", stop_status.upper())
    order = db.query(Order).filter(Order.id == stop.order_id).first()
    if order:
        if stop_status.upper() == "PICKED_UP":
            setattr(order, "status", "IN_PROCESS")
        elif stop_status.upper() == "DELIVERED":
            setattr(order, "status", "COMPLETED")
        elif stop_status.upper() == "CUSTOMER_UNAVAILABLE":
            setattr(order, "status", "SCHEDULED_FOR_PICKUP")
            # Dynamically adjust remaining driver route sequence
            driver_routes = (
                db.query(DriverRoute)
                .filter(
                    DriverRoute.driver_id == stop.driver_id,
                    DriverRoute.stop_status == "EN_ROUTE",
                )
                .order_by(DriverRoute.sequence_order.asc())
                .all()
            )
            for idx, dr in enumerate(driver_routes, start=1):
                setattr(dr, "sequence_order", idx)
    db.commit()
    db.refresh(stop)
    return stop


def create_or_get_payment(
    db: Session, order_id: str, amount: Optional[float] = None
) -> Payment:
    order = db.query(Order).filter(Order.id == order_id).first()
    amt = (
        amount
        if amount is not None
        else (float(order.total_amount) if order and order.total_amount else 35.0)
    )

    payment = db.query(Payment).filter(Payment.order_id == order_id).first()
    if not payment:
        payment = Payment(
            order_id=order_id,
            amount=amt,
            currency="USD",
            status="PENDING",
            stripe_session_id=f"cs_test_mock_{order_id[:8]}",
        )
        db.add(payment)
        db.commit()
        db.refresh(payment)
    return payment
