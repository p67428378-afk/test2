import json
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from server.database import get_db
from server.models import Product
from server.schemas import ProductResponse

router = APIRouter()


def parse_json_list(val: str) -> List[str]:
    try:
        return json.loads(val)
    except Exception:
        return []


def to_product_response(p: Product) -> ProductResponse:
    return ProductResponse(
        product_id=p.product_id,
        name=p.name,
        description=p.description,
        price=float(p.price),
        image_urls=parse_json_list(p.image_urls),
        category=p.category,
        rating=float(p.rating),
        review_count=p.review_count,
        tags=parse_json_list(p.tags),
    )


@router.get("", response_model=List[ProductResponse])
def list_products(
    category: Optional[str] = Query(
        None,
        description="Filter by category/audience (e.g., 'Kids', 'Professionals', 'Seniors')",
    ),
    limit: int = Query(20, ge=1),
    skip: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(Product)
    if category:
        # Case-insensitive match
        query = query.filter(Product.category.ilike(category))

    products = query.offset(skip).limit(limit).all()
    return [to_product_response(p) for p in products]


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: UUID, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    return to_product_response(product)
