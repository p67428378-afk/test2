from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from server.database import Base, engine, SessionLocal
from server.routers import auth as auth_router, shipments, agents
from server import models, schemas, crud


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed test accounts
    db = SessionLocal()
    try:
        # Seed customer
        customer = (
            db.query(models.User)
            .filter(models.User.email == "test@example.com")
            .first()
        )
        if not customer:
            crud.create_user(
                db,
                schemas.UserRegister(
                    email="test@example.com",
                    password="testpassword",
                    full_name="Test Customer",
                    role="customer",
                ),
            )

        # Seed admin
        admin = (
            db.query(models.User)
            .filter(models.User.email == "admin@example.com")
            .first()
        )
        if not admin:
            crud.create_user(
                db,
                schemas.UserRegister(
                    email="admin@example.com",
                    password="adminpassword",
                    full_name="Test Admin",
                    role="admin",
                ),
            )
        db.commit()
    finally:
        db.close()

    yield


app = FastAPI(
    title="Courier Tracking and Delivery Management System",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # allow_credentials=False is safe with wildcard origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(shipments.router, prefix="/api/v1/shipments", tags=["shipments"])
app.include_router(agents.router, prefix="/api/v1/admin", tags=["admin"])


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Courier Tracking and Delivery Management System API"
    }
