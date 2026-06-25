from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from server.api.v1.endpoints import password_reset, pencils
from server.database import Base, engine, SessionLocal
from server import models
from decimal import Decimal

# Create tables
Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    # 1. Seed test user (idempotent)
    test_user = (
        db.query(models.User).filter(models.User.login_id == "test@example.com").first()
    )
    if not test_user:
        # Simple hash or plain text since password reset is a placeholder
        db_user = models.User(
            login_id="test@example.com",
            mobile_number="1234567890",
            hashed_password="testpassword",  # Using plain text or simple hash as per existing placeholder style
            security_question="What is your favorite pencil?",
            security_answer_hash="graphite",
        )
        db.add(db_user)
        db.commit()

    # 2. Seed categories (idempotent)
    categories_data = [
        {
            "name": "Graphite Pencils",
            "description": "Standard writing and drawing pencils with varying hardness levels.",
            "image_url": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500",
        },
        {
            "name": "Charcoal Pencils",
            "description": "Rich, dark pencils perfect for sketching, shading, and expressive art.",
            "image_url": "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=500",
        },
        {
            "name": "Colored Pencils",
            "description": "Vibrant, pigment-rich pencils for coloring, blending, and detailed illustrations.",
            "image_url": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
        },
    ]

    seeded_categories = {}
    for cat in categories_data:
        db_cat = (
            db.query(models.Category)
            .filter(models.Category.name == cat["name"])
            .first()
        )
        if not db_cat:
            db_cat = models.Category(
                name=cat["name"],
                description=cat["description"],
                image_url=cat["image_url"],
            )
            db.add(db_cat)
            db.commit()
            db.refresh(db_cat)
        seeded_categories[cat["name"]] = db_cat

    # 3. Seed pencils (idempotent)
    pencils_data = [
        {
            "name": "Classic HB Graphite Pencil",
            "description": "The quintessential writing pencil. Perfect balance of hardness and blackness.",
            "price": Decimal("1.50"),
            "hardness": "HB",
            "material": "Cedar Wood & Graphite",
            "core_diameter": "2.0mm",
            "length": "175mm",
            "shape": "Hexagonal",
            "eraser": True,
            "image_url": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500",
            "images": [
                "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500",
                "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=500",
            ],
            "category_name": "Graphite Pencils",
        },
        {
            "name": "Professional 2B Drawing Pencil",
            "description": "Softer graphite for darker lines and smooth shading. Ideal for artists.",
            "price": Decimal("1.80"),
            "hardness": "2B",
            "material": "Incense Cedar & Graphite",
            "core_diameter": "2.2mm",
            "length": "175mm",
            "shape": "Hexagonal",
            "eraser": False,
            "image_url": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500",
            "images": [
                "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500"
            ],
            "category_name": "Graphite Pencils",
        },
        {
            "name": "Soft Charcoal Sketching Pencil",
            "description": "Delivers deep, matte black tones. Excellent for rapid sketching and blending.",
            "price": Decimal("2.50"),
            "hardness": "Soft",
            "material": "Wood & Compressed Charcoal",
            "core_diameter": "4.0mm",
            "length": "175mm",
            "shape": "Round",
            "eraser": False,
            "image_url": "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=500",
            "images": [
                "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=500"
            ],
            "category_name": "Charcoal Pencils",
        },
        {
            "name": "Vibrant 12-Color Pencil Set",
            "description": "Premium artist-grade colored pencils with thick, break-resistant cores.",
            "price": Decimal("14.99"),
            "hardness": "N/A",
            "material": "Basswood & Wax-based Pigment",
            "core_diameter": "3.3mm",
            "length": "175mm",
            "shape": "Round",
            "eraser": False,
            "image_url": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
            "images": [
                "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
                "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=500",
            ],
            "category_name": "Colored Pencils",
        },
    ]

    for pen in pencils_data:
        db_pen = (
            db.query(models.Pencil).filter(models.Pencil.name == pen["name"]).first()
        )
        if not db_pen:
            db_pen = models.Pencil(
                name=pen["name"],
                description=pen["description"],
                price=pen["price"],
                hardness=pen["hardness"],
                material=pen["material"],
                core_diameter=pen["core_diameter"],
                length=pen["length"],
                shape=pen["shape"],
                eraser=pen["eraser"],
                image_url=pen["image_url"],
                images=pen["images"],
            )
            cat_name = pen["category_name"]
            if cat_name in seeded_categories:
                db_pen.categories.append(seeded_categories[cat_name])
            db.add(db_pen)
            db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed data on startup
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(lifespan=lifespan)

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(pencils.router, prefix="/api/v1", tags=["pencils"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Pencil Showcase and Password Reset Microservice"}
