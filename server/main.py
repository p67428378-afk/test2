from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from server.api.v1.endpoints import password_reset
from server.routes import auth, bookings, availability
from server.database import Base, engine, SessionLocal
from server import models, auth as auth_utils

# Create tables
Base.metadata.create_all(bind=engine)

# Seed test account in lifespan/startup hook
db = SessionLocal()
try:
    test_guide = (
        db.query(models.Guide).filter(models.Guide.email == "test@example.com").first()
    )
    if not test_guide:
        hashed_pw = auth_utils.get_password_hash("testpassword")
        new_guide = models.Guide(
            email="test@example.com",
            password_hash=hashed_pw,
            full_name="Tenzing Norgay",
        )
        db.add(new_guide)
        db.commit()
finally:
    db.close()

app = FastAPI(title="Summit Logistics - TrekGuide Portal API")

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
app.include_router(auth.router, prefix="/api/v1")
app.include_router(bookings.router, prefix="/api/v1")
app.include_router(availability.router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Welcome to the Summit Logistics - TrekGuide Portal API"}
