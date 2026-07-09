from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from server.database import Base, engine, get_db
from server.routes import auth, pets, applications
from server.auth import get_password_hash
from server.models import User

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pet Adoption Platform API", version="1.0.0")

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
app.include_router(pets.router, prefix="/api/v1/pets", tags=["pets"])
app.include_router(
    applications.router, prefix="/api/v1/applications", tags=["applications"]
)

# Mount admin routes directly under /api/v1 to match exact WorkSpec paths
app.include_router(pets.router, prefix="/api/v1", tags=["admin-pets"])
app.include_router(applications.router, prefix="/api/v1", tags=["admin-applications"])


# Seed admin user on startup
@app.on_event("startup")
def seed_admin():
    db = next(get_db())
    try:
        admin_email = "admin@example.com"
        admin_user = db.query(User).filter(User.email == admin_email).first()
        if not admin_user:
            hashed_password = get_password_hash("adminpassword")
            new_admin = User(
                email=admin_email,
                name="Admin User",
                hashed_password=hashed_password,
                is_admin=True,
            )
            db.add(new_admin)
            db.commit()
            print("Admin user seeded successfully.")

        # Seed test user as required by Phase 0.75
        test_email = "test@example.com"
        test_user = db.query(User).filter(User.email == test_email).first()
        if not test_user:
            hashed_password = get_password_hash("testpassword")
            new_test = User(
                email=test_email,
                name="Test User",
                hashed_password=hashed_password,
                is_admin=False,
            )
            db.add(new_test)
            db.commit()
            print("Test user seeded successfully.")
    except Exception as e:
        print(f"Error seeding users: {e}")
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Welcome to the Pet Adoption Platform API"}
