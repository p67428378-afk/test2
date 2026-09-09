from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Product
from server.schemas import ProductCreate, ProductListResponse, ProductResponse

router = APIRouter(prefix="/api/v1/products", tags=["products"])


@router.get("", response_model=ProductListResponse)
def list_products(
    category: str | None = Query(None, description="Category filter"),
    search: str | None = Query(
        None, description="Search keyword in name or description"
    ),
    in_stock: bool | None = Query(None, description="Filter by stock availability"),
    skip: int = Query(0, description="Offset for pagination"),
    limit: int = Query(20, description="Page size"),
    db: Session = Depends(get_db),
):
    # Fall back to safe pagination if invalid
    skip = max(skip, 0)
    if limit <= 0 or limit > 100:
        limit = 20

    query = db.query(Product)

    if category and category.strip():
        query = query.filter(Product.category.ilike(category.strip()))

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Product.name.ilike(term),
                Product.description.ilike(term),
            )
        )

    if in_stock is not None:
        query = query.filter(Product.in_stock == in_stock)

    total = query.count()
    items = query.order_by(Product.created_at.desc()).offset(skip).limit(limit).all()

    return {
        "items": items,
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: str,
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id '{product_id}' not found",
        )
    return product


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
):
    new_product = Product(**payload.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product
