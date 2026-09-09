"""Product catalog endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Product
from server.schemas import ProductCreate, ProductListResponse, ProductResponse

router = APIRouter()


@router.get("", response_model=ProductListResponse)
@router.get("/", response_model=ProductListResponse, include_in_schema=False)
def list_products(
    category: str | None = None,
    search: str | None = None,
    skip: int | None = 0,
    limit: int | None = 20,
    db: Session = Depends(get_db),
):
    """
    List products from the catalog with optional category search filters and pagination.
    Falls back to skip=0, limit=20 if invalid pagination parameters are provided.
    """
    if skip is None or skip < 0:
        skip = 0
    if limit is None or limit <= 0:
        limit = 20

    query = db.query(Product)

    if category and category.strip():
        query = query.filter(Product.category.ilike(f"%{category.strip()}%"))

    if search and search.strip():
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term),
                Product.category.ilike(search_term),
            )
        )

    total = query.count()
    items = query.order_by(Product.created_at.desc()).offset(skip).limit(limit).all()

    return {
        "items": items,
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
@router.post(
    "/",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
):
    """Create a new product in the catalog."""
    product = Product(
        name=payload.name,
        description=payload.description,
        category=payload.category,
        price=payload.price,
        rating=payload.rating,
        tags=payload.tags,
        in_stock=payload.in_stock,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve details of a single product by ID."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found",
        )
    return product
