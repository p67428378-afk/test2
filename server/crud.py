import uuid
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from server.models import Cart, CartItem, Chocolate, Order, OrderItem
from server.schemas import CartItemCreate, CartItemUpdate, ChocolateCreate, OrderCreate


# ==========================================
# Chocolate CRUD
# ==========================================


def get_chocolates(
    db: Session,
    min_cocoa: Optional[int] = None,
    max_cocoa: Optional[int] = None,
    origin: Optional[str] = None,
    flavor: Optional[str] = None,
    dietary: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> List[Chocolate]:
    query = db.query(Chocolate)

    if min_cocoa is not None:
        query = query.filter(Chocolate.cocoa_percentage >= min_cocoa)
    if max_cocoa is not None:
        query = query.filter(Chocolate.cocoa_percentage <= max_cocoa)
    if origin:
        query = query.filter(Chocolate.origin_region.ilike(f"%{origin}%"))
    if flavor:
        query = query.filter(Chocolate.flavor_notes.ilike(f"%{flavor}%"))
    if dietary:
        query = query.filter(Chocolate.dietary_flags.ilike(f"%{dietary}%"))

    return query.offset(skip).limit(limit).all()


def get_chocolate_by_id(db: Session, chocolate_id: str) -> Optional[Chocolate]:
    return db.query(Chocolate).filter(Chocolate.id == chocolate_id).first()


def create_chocolate(db: Session, chocolate_in: ChocolateCreate) -> Chocolate:
    chocolate = Chocolate(
        id=str(uuid.uuid4()),
        **chocolate_in.model_dump(),
    )
    db.add(chocolate)
    db.commit()
    db.refresh(chocolate)
    return chocolate


# ==========================================
# Cart CRUD
# ==========================================


def get_or_create_cart(db: Session, cart_id: Optional[str] = None) -> Cart:
    if cart_id:
        cart = db.query(Cart).filter(Cart.id == cart_id).first()
        if cart:
            return cart

    new_cart = Cart(
        id=str(uuid.uuid4()),
        session_token=str(uuid.uuid4()),
    )
    db.add(new_cart)
    db.commit()
    db.refresh(new_cart)
    return new_cart


def get_cart_by_id(db: Session, cart_id: str) -> Optional[Cart]:
    return db.query(Cart).filter(Cart.id == cart_id).first()


def add_item_to_cart(db: Session, item_in: CartItemCreate) -> Cart:
    cart = get_or_create_cart(db, item_in.cart_id)

    chocolate = get_chocolate_by_id(db, item_in.chocolate_id)
    if not chocolate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chocolate product not found",
        )

    if chocolate.stock_quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {chocolate.stock_quantity} items remaining in stock.",
        )

    existing_item = (
        db.query(CartItem)
        .filter(
            CartItem.cart_id == cart.id, CartItem.chocolate_id == item_in.chocolate_id
        )
        .first()
    )

    total_requested_qty = item_in.quantity
    if existing_item:
        total_requested_qty += existing_item.quantity

    if total_requested_qty > chocolate.stock_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {chocolate.stock_quantity} items remaining in stock.",
        )

    if existing_item:
        existing_item.quantity = total_requested_qty
    else:
        new_item = CartItem(
            id=str(uuid.uuid4()),
            cart_id=cart.id,
            chocolate_id=item_in.chocolate_id,
            quantity=item_in.quantity,
        )
        db.add(new_item)

    db.commit()
    db.refresh(cart)
    return cart


def update_cart_item_quantity(
    db: Session, item_id: str, item_update: CartItemUpdate
) -> CartItem:
    cart_item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found",
        )

    chocolate = get_chocolate_by_id(db, cart_item.chocolate_id)
    if not chocolate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated chocolate product not found",
        )

    if item_update.quantity > chocolate.stock_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {chocolate.stock_quantity} items remaining in stock.",
        )

    cart_item.quantity = item_update.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item


def remove_cart_item(db: Session, item_id: str) -> None:
    cart_item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found",
        )
    db.delete(cart_item)
    db.commit()


def calculate_cart_details(cart: Cart) -> dict:
    subtotal = 0.0
    items_count = 0
    formatted_items = []

    for item in cart.items:
        unit_price = item.chocolate.price if item.chocolate else 0.0
        item_subtotal = round(unit_price * item.quantity, 2)
        subtotal += item_subtotal
        items_count += item.quantity

        item_dict = {
            "id": item.id,
            "cart_id": item.cart_id,
            "chocolate_id": item.chocolate_id,
            "quantity": item.quantity,
            "item_subtotal": item_subtotal,
            "chocolate": item.chocolate,
            "created_at": item.created_at,
            "updated_at": item.updated_at,
        }
        formatted_items.append(item_dict)

    return {
        "id": cart.id,
        "cart_id": cart.id,
        "session_token": cart.session_token,
        "items": formatted_items,
        "subtotal": round(subtotal, 2),
        "updated_items_count": items_count,
        "created_at": cart.created_at,
        "updated_at": cart.updated_at,
    }


# ==========================================
# Order CRUD
# ==========================================


def create_order(db: Session, order_in: OrderCreate) -> Order:
    cart = get_cart_by_id(db, order_in.cart_id)
    if not cart or not cart.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot place order with an empty or non-existent cart.",
        )

    # Validate stock for all items
    for item in cart.items:
        chocolate = item.chocolate
        if not chocolate or item.quantity > chocolate.stock_quantity:
            avail = chocolate.stock_quantity if chocolate else 0
            title = chocolate.title if chocolate else "Item"
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {title}. Only {avail} available.",
            )

    # Calculate shipping and subtotal
    subtotal = sum(
        round(item.chocolate.price * item.quantity, 2) for item in cart.items
    )
    shipping_fee = 15.00 if order_in.shipping_method == "express_thermal" else 0.00
    total_amount = round(subtotal + shipping_fee, 2)

    order_id = str(uuid.uuid4())
    order_code = f"ORD-{uuid.uuid4().hex[:6].upper()}"

    order = Order(
        id=order_id,
        order_code=order_code,
        customer_name=order_in.customer_name,
        customer_email=str(order_in.customer_email),
        shipping_address=order_in.shipping_address,
        shipping_method=order_in.shipping_method,
        shipping_fee=shipping_fee,
        subtotal_amount=round(subtotal, 2),
        total_amount=total_amount,
        order_status="Processing",
    )
    db.add(order)

    # Create OrderItems and deduct inventory
    for item in cart.items:
        order_item = OrderItem(
            id=str(uuid.uuid4()),
            order_id=order_id,
            chocolate_id=item.chocolate_id,
            unit_price=item.chocolate.price,
            quantity=item.quantity,
        )
        db.add(order_item)

        # Deduct stock
        item.chocolate.stock_quantity -= item.quantity

    # Empty the cart items
    for item in list(cart.items):
        db.delete(item)

    db.commit()
    db.refresh(order)
    return order


def get_order_by_identifier(db: Session, identifier: str) -> Optional[Order]:
    order = db.query(Order).filter(Order.id == identifier).first()
    if not order:
        order = db.query(Order).filter(Order.order_code == identifier).first()
    return order


def format_order_response(order: Order) -> dict:
    formatted_items = []
    for item in order.items:
        formatted_items.append(
            {
                "id": item.id,
                "order_id": item.order_id,
                "chocolate_id": item.chocolate_id,
                "unit_price": item.unit_price,
                "quantity": item.quantity,
                "item_subtotal": round(item.unit_price * item.quantity, 2),
                "chocolate": item.chocolate,
                "created_at": item.created_at,
            }
        )

    return {
        "id": order.id,
        "order_id": order.id,
        "order_code": order.order_code,
        "customer_name": order.customer_name,
        "customer_email": order.customer_email,
        "shipping_address": order.shipping_address,
        "shipping_method": order.shipping_method,
        "shipping_fee": order.shipping_fee,
        "subtotal_amount": order.subtotal_amount,
        "total_amount": order.total_amount,
        "order_status": order.order_status,
        "status": order.order_status,
        "items": formatted_items,
        "created_at": order.created_at,
        "updated_at": order.updated_at,
    }
