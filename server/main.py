import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from server.database import Base, engine, SessionLocal
from server.models import Product, User
from server.auth import get_password_hash
from server.routes import users, products, cart, orders
from server.api.v1.endpoints import password_reset

# Create tables
Base.metadata.create_all(bind=engine)

# Seed initial products and test user if not present
db = SessionLocal()
try:
    # Seed test user
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    if not test_user:
        db.add(
            User(
                email="test@example.com",
                password_hash=get_password_hash("testpassword"),
            )
        )
        db.commit()

    # Seed products
    if db.query(Product).count() == 0:
        products_data = [
            {
                "name": "Dino-Adventure Bento",
                "description": "Fun dinosaur themed bento box for kids.",
                "price": 24.99,
                "image_urls": json.dumps(
                    [
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuAB-aVGQjrhFa8QDi5q-F4R6NgvgfBLusbWla6Ob8AxhOjvC3GwdXTWVj7o_NvszX49apD7875V9zDmZi_VNhNaIIiI-s7b88jS8UaNKAD67JAuipzzvRgcmHJZkXLssXGa4oRiKyC4IC2ki3tG7vDgFHsOj9YYVwdl3zUeM0IuDlkaCqEVllDfZ2PngLvpopJdOn5fUCR01a0221eDKvO62oVTBgUL97pIGibKb-Bh5AZvHezFD8nHJrRA6kWU4f5RVIvUpfOVS7wy"
                    ]
                ),
                "category": "Kids",
                "rating": 4.9,
                "review_count": 124,
                "tags": json.dumps(["Kids", "Leakproof"]),
            },
            {
                "name": "Executive Sleek Steel",
                "description": "Premium insulated stainless steel lunch box for professionals.",
                "price": 45.00,
                "image_urls": json.dumps(
                    [
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuC6-HKaEB9mujw30YClaMSJjpOZVIgz9EHTgYfsuwH45qHWLhgo6qdQcBsHOCbyzx5mu64zVHNteo3jtmX1Us0L1d-XeOiPjHTVXLedr5qnd0IK_aALcmHAzn423ebV3BAoCVnlbwZBYg9939mBokOKeMUPuJr0ejdLKDXQoZ3eHtDRP5xBO-mqZBb1zNiM0w53NFdlHxKHxgbT1h7ja-EhNVGaiFF9GKqmm8Qo7Cidelt5mqk90PA0igmv0hjd88uVN1L3Y8sMWcnl"
                    ]
                ),
                "category": "Professionals",
                "rating": 4.8,
                "review_count": 312,
                "tags": json.dumps(["Pro", "Insulated"]),
            },
            {
                "name": "Easy-Open Thermal Warm",
                "description": "Easy-grip thermal lunch box designed for seniors.",
                "price": 34.99,
                "image_urls": json.dumps(
                    [
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuAoysGfT1DZLLGTk3pqjDXga8A-c691jp8HN3elAwzpSn_iD1T7dM68k6DzkbwPbzb1Qu6u5Gbj9Wo7SBtnAbNMbodZYnjAK7htJEuRXf8mQcCqv5lXCXtpvM2lj4v5cr6iIYX7LKZsqzVTq5ATpwZblg1iC9gSaXqT5mc8k2mbR6z8mFz0Vmfoy6cwwjoqkp-xGp4t7ek3VCdE-IPzfY58aXk0OpYC9dijjRTeJ9hOp2XjOidX5WN6P-HSuW6YRvRvtGf4ep2RRdW7"
                    ]
                ),
                "category": "Seniors",
                "rating": 4.7,
                "review_count": 89,
                "tags": json.dumps(["Seniors", "Easy-Grip"]),
            },
        ]
        for p in products_data:
            db.add(Product(**p))
        db.commit()
finally:
    db.close()

app = FastAPI(title="BentoBox Creative API")

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

# Include Routers
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(cart.router, prefix="/api/v1/cart", tags=["Cart"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])


@app.get("/")
def read_root():
    return {"message": "Welcome to BentoBox Creative API"}
