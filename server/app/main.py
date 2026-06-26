"""
Module: main
Purpose: FastAPI application entry point and lifespan event handler.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.app.database import Base, engine, SessionLocal
from server.app.routers import auth, products, wishlist, cart, orders, admin
from server.app.models import User, Category, Product, Review
from server.app.crud import get_password_hash


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed initial data
    db = SessionLocal()
    try:
        # 1. Seed test user (idempotent)
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if not test_user:
            test_user = User(
                email="test@example.com",
                name="Test Customer",
                password_hash=get_password_hash("testpassword"),
                role="customer",
            )
            db.add(test_user)

        # 2. Seed admin user (idempotent)
        admin_user = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin_user:
            admin_user = User(
                email="admin@example.com",
                name="Admin User",
                password_hash=get_password_hash("adminpassword"),
                role="admin",
            )
            db.add(admin_user)

        # 3. Seed categories (idempotent)
        womens_category = (
            db.query(Category).filter(Category.name == "Women's Clothing").first()
        )
        if not womens_category:
            womens_category = Category(name="Women's Clothing")
            db.add(womens_category)
            db.flush()

        dresses_category = db.query(Category).filter(Category.name == "Dresses").first()
        if not dresses_category:
            dresses_category = Category(name="Dresses", parent_id=womens_category.id)
            db.add(dresses_category)
            db.flush()

        # 4. Seed products (idempotent)
        product_1 = (
            db.query(Product).filter(Product.name == "Floral Summer Maxi Dress").first()
        )
        if not product_1:
            product_1 = Product(
                name="Floral Summer Maxi Dress",
                description="A light, breezy floral summer maxi dress in a bright, sunlit outdoor setting.",
                price=89.00,
                image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuA__HUVe4iKh6wUdrdvbjMN0ol8tDuSoHD61Ilw5HNyczAlomwAIDmQkNessFW3pl2sufPkQ89p-4KtizwKQc7xcnQnnPMOGbxd9gGFMxS0BjP54Qj-hm2A_eGTfP1TpVgjk3cu0xASIWKr136oYSYLb_zr49ze102asaKK0rotmlTeJxjHay-cX55e8uR3GNaw_MXjYkjpBifPANacrUl6WTzpgonJfqk9a9UKtIpK4uA1oUpSOJ3eeuBb95Ru7_6N9-xpYc_yyMI",
                stock=10,
                category_id=dresses_category.id,
                brand="Aura Basic",
                size="M",
                color="White",
                rating=4.8,
            )
            db.add(product_1)
            db.flush()

            # Seed a review for product 1
            review_1 = Review(
                product_id=product_1.id,
                user_id=test_user.id if test_user else admin_user.id,
                rating=5,
                comment="Absolutely beautiful dress! Fits perfectly and the fabric is so soft.",
            )
            db.add(review_1)

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

    yield


app = FastAPI(
    title="Aura Threads E-Commerce API",
    description="Backend API for Aura Threads online clothing store.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware configuration
# CORS RULE: NEVER combine allow_origins=["*"] with allow_credentials=True.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with prefix /api/v1
app.include_router(auth.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(wishlist.router, prefix="/api/v1")
app.include_router(cart.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Welcome to Aura Threads E-Commerce API"}
