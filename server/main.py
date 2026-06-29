"""
Module: server.main
Purpose: Main FastAPI application entry point.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.database import Base, engine, SessionLocal
from server.models.user import User
from server.routers.auth import get_password_hash, router as auth_router
from server.routers.users import router as users_router
from server.routers.restaurants import router as restaurants_router
from server.routers.orders import router as orders_router
from server.routers.deliveries import router as deliveries_router
from server.routers.admin import router as admin_router
from server.routers.payments import router as payments_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed test accounts (idempotent)
    db = SessionLocal()
    try:
        # 1. Seed default test customer account (required by Constitution)
        test_customer = db.query(User).filter(User.email == "test@example.com").first()
        if not test_customer:
            db.add(
                User(
                    email="test@example.com",
                    full_name="Test Customer",
                    hashed_password=get_password_hash("testpassword"),
                    role="customer",
                    phone="1234567890",
                )
            )

        # 2. Seed test restaurant partner account
        test_restaurant = (
            db.query(User).filter(User.email == "restaurant@example.com").first()
        )
        if not test_restaurant:
            db.add(
                User(
                    email="restaurant@example.com",
                    full_name="Test Restaurant Partner",
                    hashed_password=get_password_hash("testpassword"),
                    role="restaurant",
                    phone="1234567891",
                )
            )

        # 3. Seed test delivery partner account
        test_driver = db.query(User).filter(User.email == "driver@example.com").first()
        if not test_driver:
            db.add(
                User(
                    email="driver@example.com",
                    full_name="Test Delivery Partner",
                    hashed_password=get_password_hash("testpassword"),
                    role="delivery",
                    phone="1234567892",
                    is_online=True,
                )
            )

        # 4. Seed test admin account
        test_admin = db.query(User).filter(User.email == "admin@example.com").first()
        if not test_admin:
            db.add(
                User(
                    email="admin@example.com",
                    full_name="Test Administrator",
                    hashed_password=get_password_hash("testpassword"),
                    role="admin",
                    phone="1234567893",
                )
            )

        db.commit()
    except Exception as e:
        print(f"Error seeding test accounts: {e}")
        db.rollback()
    finally:
        db.close()

    yield


app = FastAPI(
    title="Food Delivery Platform API",
    description="API for browsing restaurants, placing orders, making payments, and tracking deliveries.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration (NEVER combine allow_origins=["*"] with allow_credentials=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with /api/v1 prefix
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(restaurants_router, prefix="/api/v1")
app.include_router(orders_router, prefix="/api/v1")
app.include_router(deliveries_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(payments_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Welcome to the Food Delivery Platform API"}
