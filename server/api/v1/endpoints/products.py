from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import jwt
from server.database import get_db
from server.schemas import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
)
from server import crud
from server.core.security import SECRET_KEY, ALGORITHM
from server.models import Seller

router = APIRouter()
security = HTTPBearer()


def get_current_seller(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> Seller:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        seller_id: str = payload.get("sub")
        if seller_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    seller = crud.get_seller_by_id(db, seller_id=seller_id)
    if seller is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Seller not found",
        )
    return seller


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    current_seller: Seller = Depends(get_current_seller),
    db: Session = Depends(get_db),
):
    return crud.create_product(db, product_in=product_in, seller_id=current_seller.id)


@router.get("", response_model=ProductListResponse)
def list_products(
    brand: Optional[str] = None,
    condition: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    ram: Optional[str] = None,
    storage: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    items, total = crud.list_products(
        db,
        brand=brand,
        condition=condition,
        min_price=min_price,
        max_price=max_price,
        ram=ram,
        storage=storage,
        search=search,
        skip=skip,
        limit=limit,
    )
    return {
        "items": items,
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.get("/{id}", response_model=ProductResponse)
def get_product(id: str, db: Session = Depends(get_db)):
    db_product = crud.get_product_by_id(db, product_id=id)
    if db_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product ID does not exist",
        )
    return db_product


@router.put("/{id}", response_model=ProductResponse)
def update_product(
    id: str,
    product_in: ProductUpdate,
    current_seller: Seller = Depends(get_current_seller),
    db: Session = Depends(get_db),
):
    db_product = crud.get_product_by_id(db, product_id=id)
    if db_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product ID does not exist",
        )
    if db_product.seller_id != current_seller.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this product",
        )
    return crud.update_product(db, db_product=db_product, product_in=product_in)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    id: str,
    current_seller: Seller = Depends(get_current_seller),
    db: Session = Depends(get_db),
):
    db_product = crud.get_product_by_id(db, product_id=id)
    if db_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product ID does not exist",
        )
    if db_product.seller_id != current_seller.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this product",
        )
    crud.delete_product(db, db_product=db_product)
    return None
