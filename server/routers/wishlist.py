import os
import jwt
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User
from server.models.wishlist import Product, Wishlist, WishlistItem
from server.schemas.wishlist import (
    WishlistItemCreateRequest,
    WishlistItemCreateResponse,
    WishlistItemResponse,
)

# Auth configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

router = APIRouter()


# Pure Python Password Hashing (avoids passlib/bcrypt version mismatch issues)
def get_password_hash(password: str) -> str:
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000
    )
    return f"pbkdf2_sha256$100000${salt}${key.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        parts = hashed_password.split("$")
        if len(parts) != 4 or parts[0] != "pbkdf2_sha256":
            return False
        iterations = int(parts[1])
        salt = parts[2]
        original_key = parts[3]
        new_key = hashlib.pbkdf2_hmac(
            "sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), iterations
        )
        return secrets.compare_digest(new_key.hex(), original_key)
    except Exception:
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        user_id_val = payload.get("sub")
        if user_id_val is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user_id = UUID(str(user_id_val))
    except (jwt.PyJWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


# Auth Endpoints
@router.post("/auth/register", status_code=status.HTTP_201_CREATED)
def register_user(
    login_id: str, mobile_number: str, password: str, db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(User.login_id == login_id).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = get_password_hash(password)
    user = User(
        login_id=login_id,
        mobile_number=mobile_number,
        hashed_password=hashed_password,
        security_question="What is your favorite color?",
        security_answer_hash=get_password_hash("blue"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User registered successfully", "user_id": str(user.id)}


@router.post("/auth/login")
def login_user(login_id: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.login_id == login_id).first()
    if not user or not verify_password(password, str(user.hashed_password)):
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


# Wishlist Endpoints
@router.post(
    "/wishlist/items",
    response_model=WishlistItemCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_wishlist_item(
    request: WishlistItemCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Check if product exists
    product = db.query(Product).filter(Product.id == request.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product does not exist")

    # Get or create wishlist for user
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == current_user.id).first()
    if not wishlist:
        wishlist = Wishlist(user_id=current_user.id)
        db.add(wishlist)
        db.commit()
        db.refresh(wishlist)

    # Check if product is already in wishlist
    existing_item = (
        db.query(WishlistItem)
        .filter(
            WishlistItem.wishlist_id == wishlist.id,
            WishlistItem.product_id == product.id,
        )
        .first()
    )
    if existing_item:
        raise HTTPException(
            status_code=409, detail="Product is already in the user's wishlist"
        )

    # Add item to wishlist
    wishlist_item = WishlistItem(wishlist_id=wishlist.id, product_id=product.id)
    db.add(wishlist_item)
    db.commit()
    db.refresh(wishlist_item)

    return wishlist_item


@router.get("/wishlist", response_model=List[WishlistItemResponse])
def get_wishlist(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == current_user.id).first()
    if not wishlist:
        return []

    return wishlist.items


@router.delete("/wishlist/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_wishlist_item(
    item_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    wishlist_item = db.query(WishlistItem).filter(WishlistItem.id == item_id).first()
    if not wishlist_item:
        raise HTTPException(
            status_code=404,
            detail="Wishlist item not found or does not belong to the user",
        )

    # Verify ownership
    wishlist = (
        db.query(Wishlist).filter(Wishlist.id == wishlist_item.wishlist_id).first()
    )
    if not wishlist or wishlist.user_id != current_user.id:
        raise HTTPException(
            status_code=404,
            detail="Wishlist item not found or does not belong to the user",
        )

    db.delete(wishlist_item)
    db.commit()
    return None
