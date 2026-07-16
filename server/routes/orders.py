from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from server.database import get_db
from server import models, schemas
from server.routes.cart import SESSION_CARTS, get_session_id

router = APIRouter()


@router.post("/orders", response_model=schemas.OrderResponse)
def place_order(
    request: Request,
    order_in: schemas.OrderCreateRequest,
    db: Session = Depends(get_db),
):
    session_id = get_session_id(request)
    cart = SESSION_CARTS.get(session_id, {})

    if not cart:
        raise HTTPException(status_code=400, detail="Empty cart")

    # Validate stock and calculate total
    total_amount = 0.0
    order_items_to_create = []
    books_to_update = []

    for book_id, qty in cart.items():
        book = (
            db.query(models.Book)
            .filter(models.Book.id == book_id)
            .with_for_update()
            .first()
        )
        if not book:
            raise HTTPException(status_code=404, detail=f"Book {book_id} not found")

        if book.stock_quantity < qty:
            raise HTTPException(
                status_code=400, detail=f"Insufficient stock for book: {book.title}"
            )

        subtotal = float(book.price) * qty
        total_amount += subtotal

        order_items_to_create.append((book, qty))
        books_to_update.append((book, book.stock_quantity - qty))

    # Mock Stripe payment processing
    if (
        order_in.payment_token == "tok_chargeDeclined"
        or "fail" in order_in.payment_token.lower()
    ):
        raise HTTPException(status_code=400, detail="Payment processing failed")

    # Create Customer if not exists, or find by email
    customer = (
        db.query(models.Customer)
        .filter(models.Customer.email == order_in.email)
        .first()
    )
    if not customer:
        customer = models.Customer(
            name=order_in.shipping_name,
            email=order_in.email,
            password_hash="mock_hash",  # Guest checkout auto-creates account
        )
        db.add(customer)
        db.flush()

    # Create Order
    order = models.Order(
        customer_id=customer.id,
        status="Paid",
        total_amount=total_amount,
        shipping_name=order_in.shipping_name,
        shipping_address=order_in.shipping_address,
    )
    db.add(order)
    db.flush()

    # Create Order Items and update stock
    for book, qty in order_items_to_create:
        order_item = models.OrderItem(
            order_id=order.id, book_id=book.id, quantity=qty, price_per_item=book.price
        )
        db.add(order_item)

    for book, new_stock in books_to_update:
        book.stock_quantity = new_stock

    db.commit()
    db.refresh(order)

    # Clear cart
    SESSION_CARTS[session_id] = {}

    return schemas.OrderResponse(
        order_id=order.id, status=order.status, total_amount=float(order.total_amount)
    )
