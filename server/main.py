from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from server.database import Base, engine, SessionLocal
from server.models import User, Inmate, VisitorProfile
from server.auth import hash_password
from server.routes import auth, appointments, visits, security

# Create tables
Base.metadata.create_all(bind=engine)

# Seed initial data (idempotent)
db = SessionLocal()
try:
    # Seed test user
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    if not test_user:
        test_user = User(
            email="test@example.com",
            hashed_password=hash_password("testpassword"),
            role="visitor",
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)

        # Create visitor profile for test user
        test_profile = VisitorProfile(
            user_id=test_user.id,
            full_name="Test Visitor",
            phone="+1 (555) 019-2834",
            gov_id="DL-TEST12345",
            is_verified=True,
            is_flagged=False,
        )
        db.add(test_profile)
        db.commit()

    # Seed staff user
    staff_user = db.query(User).filter(User.email == "staff@example.com").first()
    if not staff_user:
        staff_user = User(
            email="staff@example.com",
            hashed_password=hash_password("staffpassword"),
            role="staff",
        )
        db.add(staff_user)
        db.commit()

    # Seed security user
    security_user = db.query(User).filter(User.email == "security@example.com").first()
    if not security_user:
        security_user = User(
            email="security@example.com",
            hashed_password=hash_password("securitypassword"),
            role="security",
        )
        db.add(security_user)
        db.commit()

    # Seed an inmate
    test_inmate = db.query(Inmate).filter(Inmate.inmate_number == "IN-8821").first()
    if not test_inmate:
        test_inmate = Inmate(
            full_name="Marcus Vance",
            inmate_number="IN-8821",
            cell_location="Block C, Cell 104",
        )
        db.add(test_inmate)
        db.commit()
finally:
    db.close()

app = FastAPI(title="Prison Visitor Management System")

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
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(
    appointments.router, prefix="/api/v1/appointments", tags=["appointments"]
)
app.include_router(visits.router, prefix="/api/v1/visits", tags=["visits"])
app.include_router(security.router, prefix="/api/v1/security", tags=["security"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Prison Visitor Management System API"}
