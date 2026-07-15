import os
import uuid
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict

from server.database import get_db
from server import schemas, crud

app = FastAPI(title="Ocean Catch API", version="1.0.0")

# CORS Middleware
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory shopping carts store: {cart_id: {product_id: quantity}}
CARTS: Dict[uuid.UUID, Dict[uuid.UUID, int]] = {}


@app.get("/")
def read_root():
    return {"message": "Welcome to the Ocean Catch Fish Shop API"}


# --- Products Endpoints ---


@app.get("/api/v1/products", response_model=List[schemas.ProductResponse])
def list_products(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return crud.get_products(db, skip=skip, limit=limit)


@app.get("/api/v1/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: uuid.UUID, db: Session = Depends(get_db)):
    db_product = crud.get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


# --- Shopping Cart Endpoints ---


@app.post("/api/v1/cart", response_model=schemas.CartResponse)
def create_cart():
    cart_id = uuid.uuid4()
    CARTS[cart_id] = {}
    return {"cart_id": cart_id, "items": [], "total_price": 0.0}


@app.get("/api/v1/cart/{cart_id}", response_model=schemas.CartResponse)
def get_cart(cart_id: uuid.UUID, db: Session = Depends(get_db)):
    if cart_id not in CARTS:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart_items = CARTS[cart_id]
    items_response = []
    total_price = 0.0

    for prod_id, qty in list(cart_items.items()):
        product = crud.get_product(db, prod_id)
        if not product:
            # Product was deleted or invalid, remove from cart
            cart_items.pop(prod_id, None)
            continue
        subtotal = float(product.price) * qty
        total_price += subtotal
        items_response.append(
            {
                "product_id": prod_id,
                "name": product.name,
                "price": float(product.price),
                "quantity": qty,
                "subtotal": subtotal,
            }
        )

    return {"cart_id": cart_id, "items": items_response, "total_price": total_price}


@app.post("/api/v1/cart/{cart_id}/items", response_model=schemas.CartResponse)
def add_item_to_cart(
    cart_id: uuid.UUID, item: schemas.CartItemAdd, db: Session = Depends(get_db)
):
    if cart_id not in CARTS:
        raise HTTPException(status_code=404, detail="Cart not found")

    product = crud.get_product(db, item.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    current_qty = CARTS[cart_id].get(item.product_id, 0)
    new_qty = current_qty + item.quantity

    if new_qty > product.stock_quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Requested quantity exceeds available stock. Available: {product.stock_quantity}",
        )

    CARTS[cart_id][item.product_id] = new_qty
    return get_cart(cart_id, db)


@app.delete(
    "/api/v1/cart/{cart_id}/items/{product_id}", response_model=schemas.CartResponse
)
def remove_item_from_cart(
    cart_id: uuid.UUID, product_id: uuid.UUID, db: Session = Depends(get_db)
):
    if cart_id not in CARTS:
        raise HTTPException(status_code=404, detail="Cart not found")

    if product_id not in CARTS[cart_id]:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    CARTS[cart_id].pop(product_id)
    return get_cart(cart_id, db)


# --- Checkout Endpoints ---


@app.post("/api/v1/orders", response_model=schemas.OrderResponse)
def submit_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db)):
    cart_id = order_data.cart_id
    if cart_id not in CARTS:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart_items = CARTS[cart_id]
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Verify stock and calculate total
    items_list = []
    total_price = 0.0

    for prod_id, qty in cart_items.items():
        product = crud.get_product(db, prod_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {prod_id} not found")
        if qty > product.stock_quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Product {product.name} is out of stock or has insufficient quantity.",
            )
        subtotal = float(product.price) * qty
        total_price += subtotal
        items_list.append(
            {
                "product_id": str(prod_id),
                "name": product.name,
                "price": float(product.price),
                "quantity": qty,
                "subtotal": subtotal,
            }
        )

    # Mock payment validation
    # If card number starts with '4111', we treat it as a mock payment failure
    if order_data.payment_details.card_number.replace(" ", "").startswith("4111"):
        raise HTTPException(
            status_code=400, detail="Payment failed. Please try a different card."
        )

    # Deduct stock
    for prod_id, qty in cart_items.items():
        product = crud.get_product(db, prod_id)
        product.stock_quantity -= qty

    # Format shipping address
    addr = order_data.shipping_address
    shipping_str = f"{addr.name}, {addr.address}, {addr.city}, {addr.state} {addr.zip}, Email: {addr.email}"

    # Create order
    db_order = crud.create_order(
        db=db,
        cart_contents=items_list,
        total_price=total_price,
        shipping_address=shipping_str,
        payment_status="completed",
    )

    # Clear cart
    CARTS.pop(cart_id, None)

    return {
        "order_id": db_order.id,
        "total_price": float(db_order.total_price),
        "payment_status": db_order.payment_status,
        "created_at": db_order.created_at,
    }
