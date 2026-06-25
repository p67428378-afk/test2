import contextlib
import uuid
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api.v1.endpoints import password_reset, dashboard, scenarios, approvals
from server.database import Base, engine, SessionLocal
from server import models

# Create tables
Base.metadata.create_all(bind=engine)


def seed_data():
    db = SessionLocal()
    try:
        # Seed default products if they don't exist
        default_products = [
            {
                "product_id": uuid.UUID("a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"),
                "name": "Savings Account Variant A",
                "category": "Savings",
                "aum_contribution": 45000000.0,
                "npa_percentage": 0.0,
                "status": "GROW",
            },
            {
                "product_id": uuid.UUID("b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e"),
                "name": "Personal Loan Type C",
                "category": "Loans",
                "aum_contribution": 15000000.0,
                "npa_percentage": 4.2,
                "status": "REDUCE",
            },
            {
                "product_id": uuid.UUID("c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f"),
                "name": "Savings Premium",
                "category": "Savings",
                "aum_contribution": 124000000.0,
                "npa_percentage": 0.0,
                "status": "GROW",
            },
            {
                "product_id": uuid.UUID("d4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a"),
                "name": "Regular RD",
                "category": "Recurring Deposit",
                "aum_contribution": 82000000.0,
                "npa_percentage": 0.0,
                "status": "MAINTAIN",
            },
            {
                "product_id": uuid.UUID("e5f67a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b"),
                "name": "High-Yield FD",
                "category": "Fixed Deposit",
                "aum_contribution": 151000000.0,
                "npa_percentage": 0.0,
                "status": "REDUCE",
            },
            {
                "product_id": uuid.UUID("f67a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c"),
                "name": "Personal Loan Gold",
                "category": "Retail Loan",
                "aum_contribution": 48000000.0,
                "npa_percentage": 4.2,
                "status": "SWAP",
            },
            {
                "product_id": uuid.UUID("7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d"),
                "name": "Gold Loan Express",
                "category": "Retail Loan",
                "aum_contribution": 65000000.0,
                "npa_percentage": 1.1,
                "status": "GROW",
            },
            {
                "product_id": uuid.UUID("8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e"),
                "name": "Crop Insurance Cross-sell",
                "category": "Insurance",
                "aum_contribution": 21000000.0,
                "npa_percentage": 0.0,
                "status": "GROW",
            },
        ]

        for prod in default_products:
            existing = (
                db.query(models.Product)
                .filter(models.Product.product_id == prod["product_id"])
                .first()
            )
            if not existing:
                db_prod = models.Product(**prod)
                db.add(db_prod)

        # Seed test user if not exists
        test_user = (
            db.query(models.User)
            .filter(models.User.login_id == "test@example.com")
            .first()
        )
        if not test_user:
            # Simple hash for testpassword
            db_user = models.User(
                login_id="test@example.com",
                mobile_number="1234567890",
                hashed_password="hashed_testpassword",
                security_question="What is your favorite color?",
                security_answer_hash="hashed_blue",
            )
            db.add(db_user)

        db.commit()
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    seed_data()
    yield


app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["dashboard"])
app.include_router(scenarios.router, prefix="/api/v1", tags=["scenarios"])
app.include_router(approvals.router, prefix="/api/v1", tags=["approvals"])


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Retail Banking Product Performance & Decision Dashboard API"
    }
