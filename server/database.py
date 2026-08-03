import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.models import Base, Category, Product

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# For SQLite, we need connect_args={"check_same_thread": False}
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    # Idempotent seeding of categories
    categories_data = [
        {
            "name": "CPUs",
            "description": "Central Processing Units for high-performance computing.",
        },
        {
            "name": "Graphics Cards",
            "description": "Graphics Processing Units for gaming and rendering.",
        },
        {
            "name": "Motherboards",
            "description": "Mainboards connecting all computer components.",
        },
        {
            "name": "Memory (RAM)",
            "description": "Random Access Memory for fast multitasking.",
        },
        {
            "name": "Storage (SSD, HDD)",
            "description": "Solid State Drives and Hard Disk Drives for data storage.",
        },
    ]

    seeded_categories = {}
    for cat in categories_data:
        existing_cat = db.query(Category).filter(Category.name == cat["name"]).first()
        if not existing_cat:
            new_cat = Category(name=cat["name"], description=cat["description"])
            db.add(new_cat)
            db.commit()
            db.refresh(new_cat)
            seeded_categories[cat["name"]] = new_cat
        else:
            seeded_categories[cat["name"]] = existing_cat

    # Idempotent seeding of products
    products_data = [
        {
            "name": "Intel Core i9-14900K",
            "description": "24-Core (8 Performance Cores + 16 Efficient Cores) desktop processor.",
            "price": 549.99,
            "brand": "Intel",
            "stock_quantity": 15,
            "image_url": "https://example.com/images/i9-14900k.jpg",
            "category_name": "CPUs",
        },
        {
            "name": "AMD Ryzen 7 7800X3D",
            "description": "8-Core, 16-Thread desktop processor with AMD 3D V-Cache technology.",
            "price": 369.99,
            "brand": "AMD",
            "stock_quantity": 25,
            "image_url": "https://example.com/images/ryzen-7800x3d.jpg",
            "category_name": "CPUs",
        },
        {
            "name": "NVIDIA GeForce RTX 4090",
            "description": "The ultimate GeForce GPU. It brings an enormous leap in performance, efficiency, and AI-powered graphics.",
            "price": 1599.99,
            "brand": "NVIDIA",
            "stock_quantity": 8,
            "image_url": "https://example.com/images/rtx-4090.jpg",
            "category_name": "Graphics Cards",
        },
        {
            "name": "ASUS ROG Strix X670E-E Gaming WiFi",
            "description": "AMD X670 ATX motherboard with 18+2 power stages, DDR5 support, and PCIe 5.0.",
            "price": 429.99,
            "brand": "ASUS",
            "stock_quantity": 12,
            "image_url": "https://example.com/images/asus-x670e.jpg",
            "category_name": "Motherboards",
        },
        {
            "name": "Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz",
            "description": "High-performance DDR5 memory optimized for Intel and AMD motherboards.",
            "price": 114.99,
            "brand": "Corsair",
            "stock_quantity": 50,
            "image_url": "https://example.com/images/corsair-ddr5.jpg",
            "category_name": "Memory (RAM)",
        },
        {
            "name": "Samsung 990 Pro 2TB NVMe M.2 SSD",
            "description": "High-speed PCIe Gen4 NVMe M.2 SSD with read speeds up to 7450 MB/s.",
            "price": 169.99,
            "brand": "Samsung",
            "stock_quantity": 40,
            "image_url": "https://example.com/images/samsung-990pro.jpg",
            "category_name": "Storage (SSD, HDD)",
        },
    ]

    for prod in products_data:
        existing_prod = db.query(Product).filter(Product.name == prod["name"]).first()
        if not existing_prod:
            cat = seeded_categories.get(prod["category_name"])
            if cat:
                new_prod = Product(
                    name=prod["name"],
                    description=prod["description"],
                    price=prod["price"],
                    brand=prod["brand"],
                    stock_quantity=prod["stock_quantity"],
                    image_url=prod["image_url"],
                    category_id=cat.id,
                )
                db.add(new_prod)
    db.commit()
