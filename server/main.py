import os
from contextlib import asynccontextmanager
from uuid import UUID
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import Base, engine, SessionLocal
from server.api.v1.endpoints import password_reset
from server.routers import wishlist
from server.models import User
from server.models.wishlist import Product

# Create tables
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed database on startup
    db = SessionLocal()
    try:
        # Seed test user
        test_email = "test@example.com"
        existing_user = db.query(User).filter(User.login_id == test_email).first()
        if not existing_user:
            hashed_password = wishlist.get_password_hash("testpassword")
            test_user = User(
                login_id=test_email,
                mobile_number="1234567890",
                hashed_password=hashed_password,
                security_question="What is your favorite color?",
                security_answer_hash=wishlist.get_password_hash("blue"),
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            print(f"Seeded test user: {test_email}")

        # Seed sample product
        sample_product_id = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
        existing_product = (
            db.query(Product).filter(Product.id == UUID(sample_product_id)).first()
        )
        if not existing_product:
            product = Product(
                id=UUID(sample_product_id),
                name="AeroSound Max Wireless Headphones",
                description="Experience industry-leading noise cancellation, 40-hour battery life, and ultra-comfortable memory foam earcups. Perfect for travel, work, and study.",
                price=299.00,
                image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuDy8VFVfyTNe3Z7Cl3APg3fX5dAzUq0sP1gLKSH3zRU36a7-mdxcU7D1o4szDaF_EPu-epo3VA4x5VbSUr8me-zHFDlnHlr0EcxScuv1Lyb5t-uRyO5h1n0snO0L-_DztWUPiVXiDimS1E9oExwPubTBlMeaSgbEnJXWVGv4s560OROJIyhlG67YVtVE1_ZP1RKS-6pe4pNDGConumSYzxqGOAsNAbWh8NzIJT3X3kKOSfh229s4AO3UmRI3LOCgULQG4ZoU0syvp9R",
            )
            db.add(product)
            db.commit()
            print(f"Seeded sample product: {product.name}")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()
    yield


app = FastAPI(lifespan=lifespan)

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

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(wishlist.router, prefix="/api/v1", tags=["wishlist"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Wishlist and Password Reset Microservice"}
