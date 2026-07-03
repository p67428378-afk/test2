from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from server import models  # Import models first to register them on Base
from server.api import endpoints
from server.api.v1.endpoints import password_reset
from server.database import Base, engine, SessionLocal
from decimal import Decimal

# Create tables
Base.metadata.create_all(bind=engine)

# Seed initial data if empty
db = SessionLocal()
try:
    # Check if products table exists and is empty
    if db.query(models.Product).count() == 0:
        # Seed products
        p1 = models.Product(
            sku_id="12345",
            product_name="DG Chips - Salt & Vinegar",
            is_private_brand=True,
        )
        p2 = models.Product(
            sku_id="67890", product_name="Bubbly Cola 12oz", is_private_brand=False
        )
        p3 = models.Product(
            sku_id="24680", product_name="Clover Valley Pretzels", is_private_brand=True
        )
        p4 = models.Product(
            sku_id="13579", product_name="Premium Sweet Popcorn", is_private_brand=False
        )
        p5 = models.Product(
            sku_id="11223",
            product_name="DG Brand Roasted Peanuts",
            is_private_brand=True,
        )

        db.add_all([p1, p2, p3, p4, p5])
        db.commit()

        # Seed performance metrics
        m1 = models.PerformanceMetric(
            product_id=p1.id,
            current_sales=Decimal("5200.00"),
            sales_growth=Decimal("8.00"),
            status="GROW",
        )
        m2 = models.PerformanceMetric(
            product_id=p2.id,
            current_sales=Decimal("1100.00"),
            sales_growth=Decimal("-15.00"),
            status="REDUCE",
        )
        m3 = models.PerformanceMetric(
            product_id=p3.id,
            current_sales=Decimal("3400.00"),
            sales_growth=Decimal("2.00"),
            status="MAINTAIN",
        )
        m4 = models.PerformanceMetric(
            product_id=p4.id,
            current_sales=Decimal("2800.00"),
            sales_growth=Decimal("-1.00"),
            status="SWAP",
        )
        m5 = models.PerformanceMetric(
            product_id=p5.id,
            current_sales=Decimal("4100.00"),
            sales_growth=Decimal("12.00"),
            status="GROW",
        )

        db.add_all([m1, m2, m3, m4, m5])
        db.commit()
except Exception as e:
    print(f"Seeding error: {e}")
finally:
    db.close()

app = FastAPI(title="DG Cluster Assortment Advisor API")

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

# Include both routers
app.include_router(endpoints.router, prefix="/api/v1", tags=["assortment"])
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the DG Cluster Assortment Advisor API"}
