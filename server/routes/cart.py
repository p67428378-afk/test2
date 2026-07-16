from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from uuid import UUID
from server.database import get_db
from server import models, schemas

router = APIRouter()

# Simple session-based cart stored in request.state or memory for simplicity.
# Since we want to support multiple user sessions, we can use a simple in-memory dictionary
# keyed by a session ID or a mock user ID. Let's use a global dictionary for simplicity,
# or mock a single session cart for the current user.
# To make it robust and session-like, we can store cart items in memory.
# Key: session_id (str), Value: dict of {book_id (UUID): quantity (int)}
SESSION_CARTS = {}


def get_session_id(request: Request) -> str:
    # Simple mock session ID from headers or cookies, fallback to "default_session"
    return request.headers.get("X-Session-ID", "default_session")


@router.get("/cart", response_model=schemas.CartResponse)
def get_cart(request: Request, db: Session = Depends(get_db)):
    session_id = get_session_id(request)
    cart = SESSION_CARTS.get(session_id, {})

    items = []
    total_amount = 0.0

    # Clean up any stale book IDs that might have been deleted
    for book_id, qty in list(cart.items()):
        book = db.query(models.Book).filter(models.Book.id == book_id).first()
        if book:
            subtotal = float(book.price) * qty
            total_amount += subtotal
            items.append(
                schemas.CartItemResponse(
                    book_id=book.id,
                    title=book.title,
                    cover_image_url=book.cover_image_url,
                    price=float(book.price),
                    quantity=qty,
                    subtotal=subtotal,
                )
            )
        else:
            # Remove deleted book from cart
            cart.pop(book_id, None)

    return schemas.CartResponse(items=items, total_amount=total_amount)


@router.post("/cart", response_model=schemas.CartActionResponse)
def add_to_cart(
    request: Request, item_in: schemas.CartItemRequest, db: Session = Depends(get_db)
):
    book = db.query(models.Book).filter(models.Book.id == item_in.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if item_in.quantity > book.stock_quantity:
        raise HTTPException(
            status_code=400, detail="Requested quantity exceeds available stock"
        )

    session_id = get_session_id(request)
    if session_id not in SESSION_CARTS:
        SESSION_CARTS[session_id] = {}

    SESSION_CARTS[session_id][item_in.book_id] = item_in.quantity
    total_items = sum(SESSION_CARTS[session_id].values())

    return schemas.CartActionResponse(
        message="Item added/updated in cart successfully", total_items=total_items
    )


@router.delete("/cart/{book_id}", response_model=schemas.CartActionResponse)
def remove_from_cart(request: Request, book_id: UUID):
    session_id = get_session_id(request)
    cart = SESSION_CARTS.get(session_id, {})

    if book_id not in cart:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    cart.pop(book_id)
    total_items = sum(cart.values())

    return schemas.CartActionResponse(
        message="Item removed from cart successfully", total_items=total_items
    )
