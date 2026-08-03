import os
import uuid
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.database import init_db, seed_data, get_db, SessionLocal
from server.models import Category, Product

# Initialize database tables and seed data
init_db()
db = SessionLocal()
try:
    seed_data(db)
finally:
    db.close()

app = FastAPI(title="Computer Parts Seller API", version="1.0.0")

# CORS Middleware configuration
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


@app.get("/")
def read_root():
    return {"message": "Welcome to the Computer Parts Seller API"}


# 1. GET /api/v1/products
@app.get("/api/v1/products")
def get_products(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(
        20, ge=1, le=100, description="Maximum number of records to return"
    ),
    brand: Optional[str] = Query(None, description="Filter by brand name"),
    min_price: Optional[float] = Query(None, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, description="Maximum price filter"),
    category_id: Optional[str] = Query(None, description="Filter by category UUID"),
    sort_by: Optional[str] = Query(
        None, description="Sort field (price_asc, price_desc)"
    ),
    search: Optional[str] = Query(
        None, description="Search by name, brand, or category name"
    ),
    db: Session = Depends(get_db),
):
    query = db.query(Product)

    # Apply filters
    if category_id:
        # Validate category_id is a valid UUID
        try:
            uuid.UUID(category_id)
        except ValueError:
            raise HTTPException(
                status_code=422, detail="Invalid category_id UUID format"
            )
        query = query.filter(Product.category_id == category_id)

    if brand:
        query = query.filter(Product.brand.ilike(f"%{brand}%"))

    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if search:
        # Search across product name, brand, and category name
        query = query.join(Category).filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.brand.ilike(f"%{search}%"),
                Category.name.ilike(f"%{search}%"),
            )
        )

    # Apply sorting
    if sort_by == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    total = query.count()
    items = query.offset(skip).limit(limit).all()

    # Format response items
    formatted_items = []
    for item in items:
        formatted_items.append(
            {
                "id": item.id,
                "name": item.name,
                "description": item.description,
                "price": float(item.price),
                "brand": item.brand,
                "stock_quantity": item.stock_quantity,
                "image_url": item.image_url,
                "category_id": item.category_id,
                "created_at": item.created_at.isoformat(),
                "updated_at": item.updated_at.isoformat(),
            }
        )

    return {"total": total, "items": formatted_items}


# 2. GET /api/v1/products/{product_id}
@app.get("/api/v1/products/{product_id}")
def get_product(product_id: str, db: Session = Depends(get_db)):
    # Validate product_id is a valid UUID
    try:
        uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid product_id UUID format")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": float(product.price),
        "brand": product.brand,
        "stock_quantity": product.stock_quantity,
        "image_url": product.image_url,
        "category_id": product.category_id,
        "created_at": product.created_at.isoformat(),
        "updated_at": product.updated_at.isoformat(),
    }


# 3. GET /api/v1/categories
@app.get("/api/v1/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.name.asc()).all()
    formatted_categories = []
    for cat in categories:
        formatted_categories.append(
            {
                "id": cat.id,
                "name": cat.name,
                "description": cat.description,
                "created_at": cat.created_at.isoformat(),
                "updated_at": cat.updated_at.isoformat(),
            }
        )
    return formatted_categories


# 4. GET /api/v1/categories/{category_id}
@app.get("/api/v1/categories/{category_id}")
def get_category(category_id: str, db: Session = Depends(get_db)):
    # Validate category_id is a valid UUID
    try:
        uuid.UUID(category_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid category_id UUID format")

    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return {
        "id": category.id,
        "name": category.name,
        "description": category.description,
        "created_at": category.created_at.isoformat(),
        "updated_at": category.updated_at.isoformat(),
    }


# 5. GET /api/v1/categories/{category_id}/products
@app.get("/api/v1/categories/{category_id}/products")
def get_category_products(
    category_id: str,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(
        20, ge=1, le=100, description="Maximum number of records to return"
    ),
    db: Session = Depends(get_db),
):
    # Validate category_id is a valid UUID
    try:
        uuid.UUID(category_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid category_id UUID format")

    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    query = (
        db.query(Product)
        .filter(Product.category_id == category_id)
        .order_by(Product.created_at.desc())
    )
    total = query.count()
    items = query.offset(skip).limit(limit).all()

    formatted_items = []
    for item in items:
        formatted_items.append(
            {
                "id": item.id,
                "name": item.name,
                "description": item.description,
                "price": float(item.price),
                "brand": item.brand,
                "stock_quantity": item.stock_quantity,
                "image_url": item.image_url,
                "category_id": item.category_id,
                "created_at": item.created_at.isoformat(),
                "updated_at": item.updated_at.isoformat(),
            }
        )

    return {"total": total, "items": formatted_items}
