"""
Module: crud
Purpose: Database CRUD operations and business logic helpers.
"""

from datetime import datetime, timezone, timedelta
from typing import List, Optional
import bcrypt
from jose import jwt
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func
from server.app.config import settings
from server.app.models import User, Category, Product, Wishlist, Cart, Order, OrderItem


# --- Password Hashing using bcrypt directly to avoid passlib compatibility bugs ---
def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        pwd_bytes = plain_password.encode("utf-8")
        hashed_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(pwd_bytes, hashed_bytes)
    except Exception:
        return False


# --- JWT Token ---
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


# --- User CRUD ---
def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user_in) -> User:
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        name=user_in.name,
        password_hash=hashed_password,
        role="customer",
    )
    db.add(db_user)
    return db_user


# --- Category CRUD ---
def get_categories(db: Session) -> List[Category]:
    return (
        db.query(Category)
        .filter(Category.parent_id == None)
        .order_by(Category.name)
        .all()
    )


# --- Product CRUD ---
def get_products(
    db: Session,
    brand: Optional[str] = None,
    category_id: Optional[str] = None,
    color: Optional[str] = None,
    size: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(Product).join(Category, Product.category_id == Category.id)

    # Filtering
    if brand:
        query = query.filter(Product.brand == brand)
    if category_id:
        sub_ids = db.query(Category.id).filter(Category.parent_id == category_id).all()
        sub_ids = [r[0] for r in sub_ids]
        if sub_ids:
            query = query.filter(Product.category_id.in_([category_id] + sub_ids))
        else:
            query = query.filter(Product.category_id == category_id)
    if color:
        query = query.filter(Product.color == color)
    if size:
        query = query.filter(Product.size == size)
    if search:
        search_filter = f"%{search}%"
        # AC 9: Search by name, category name, or keywords (description/brand)
        query = query.filter(
            or_(
                Product.name.ilike(search_filter),
                Product.description.ilike(search_filter),
                Product.brand.ilike(search_filter),
                Category.name.ilike(search_filter),
            )
        )

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort_by == "popularity":
        query = query.order_by(Product.rating.desc().nulls_last())
    elif sort_by == "newest":
        query = query.order_by(Product.created_at.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total


def get_product_by_id(db: Session, product_id: str) -> Optional[Product]:
    return (
        db.query(Product)
        .options(joinedload(Product.reviews))
        .filter(Product.id == product_id)
        .first()
    )


# AC 11: Get suggestions for other products when search yields no results
def get_product_suggestions(db: Session, limit: int = 5) -> List[Product]:
    return (
        db.query(Product)
        .order_by(Product.rating.desc().nulls_last())
        .limit(limit)
        .all()
    )


# AC 8: Auto-suggestions as user types
def get_search_suggestions(db: Session, query: str, limit: int = 5) -> List[str]:
    if not query:
        return []
    search_filter = f"%{query}%"
    products = (
        db.query(Product.name)
        .filter(Product.name.ilike(search_filter))
        .limit(limit)
        .all()
    )
    return [p[0] for p in products]


# --- Wishlist CRUD ---
def get_wishlist_for_user(db: Session, user_id: str) -> List[Product]:
    wishlist_entries = db.query(Wishlist).filter(Wishlist.user_id == user_id).all()
    product_ids = [entry.product_id for entry in wishlist_entries]
    if not product_ids:
        return []
    return (
        db.query(Product)
        .filter(Product.id.in_(product_ids))
        .order_by(Product.name)
        .all()
    )


def add_to_wishlist(db: Session, user_id: str, product_id: str) -> Wishlist:
    entry = Wishlist(user_id=user_id, product_id=product_id)
    db.add(entry)
    return entry


def remove_from_wishlist(db: Session, user_id: str, product_id: str) -> bool:
    entry = (
        db.query(Wishlist)
        .filter(Wishlist.user_id == user_id, Wishlist.product_id == product_id)
        .first()
    )
    if entry:
        db.delete(entry)
        return True
    return False


# --- Cart CRUD ---
def get_cart_for_user(db: Session, user_id: str) -> List[Cart]:
    return (
        db.query(Cart)
        .options(joinedload(Cart.product))
        .filter(Cart.user_id == user_id)
        .all()
    )


def add_or_update_cart(
    db: Session, user_id: str, product_id: str, quantity: int
) -> Cart:
    entry = (
        db.query(Cart)
        .filter(Cart.user_id == user_id, Cart.product_id == product_id)
        .first()
    )
    if entry:
        if quantity <= 0:
            db.delete(entry)
            return None
        entry.quantity = quantity
    else:
        if quantity > 0:
            entry = Cart(user_id=user_id, product_id=product_id, quantity=quantity)
            db.add(entry)
    return entry


# --- Order CRUD ---
def create_order_from_cart(
    db: Session,
    user_id: str,
    shipping_address: str,
    payment_method: str,
    coupon_code: Optional[str] = None,
) -> Order:
    cart_items = get_cart_for_user(db, user_id)
    if not cart_items:
        raise ValueError("Empty cart")

    total_price = 0.0
    order_items_to_create = []

    for item in cart_items:
        product = item.product
        if product.stock < item.quantity:
            raise ValueError(f"Insufficient stock for product {product.name}")

        product.stock -= item.quantity
        item_price = product.price
        total_price += item_price * item.quantity

        order_items_to_create.append(
            OrderItem(product_id=product.id, quantity=item.quantity, price=item_price)
        )

    if coupon_code:
        if coupon_code.upper() == "SAVE10":
            total_price *= 0.9
        elif coupon_code.upper() == "SAVE20":
            total_price *= 0.8
        else:
            raise ValueError("Invalid coupon")

    db_order = Order(
        user_id=user_id,
        status="pending",
        total_price=total_price,
        shipping_address=shipping_address,
        payment_method=payment_method,
    )
    db.add(db_order)
    db.flush()

    for order_item in order_items_to_create:
        order_item.order_id = db_order.id
        db.add(order_item)

    for item in cart_items:
        db.delete(item)

    return db_order


def get_order_by_id(db: Session, order_id: str) -> Optional[Order]:
    return (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.id == order_id)
        .first()
    )


# --- Admin CRUD ---
def get_admin_metrics(db: Session) -> dict:
    active_customers = db.query(User).filter(User.role == "customer").count()
    low_stock_count = db.query(Product).filter(Product.stock < 5).count()
    total_orders = db.query(Order).count()
    total_sales = db.query(func.sum(Order.total_price)).scalar() or 0.0

    return {
        "active_customers": active_customers,
        "low_stock_count": low_stock_count,
        "total_orders": total_orders,
        "total_sales": float(total_sales),
    }


def get_all_orders_for_admin(db: Session) -> List[Order]:
    return (
        db.query(Order)
        .options(joinedload(Order.user))
        .order_by(Order.created_at.desc())
        .all()
    )
