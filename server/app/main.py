from contextlib import asynccontextmanager
from fastapi import FastAPI
from server.database import Base, engine, SessionLocal
from server.app.api.v1.users import router as users_router
from server.api.v1.endpoints import password_reset
from server.app.models.user import User
from server.app.core.security import hash_password

# Create tables
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed test account if it doesn't exist
    db = SessionLocal()
    try:
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if not test_user:
            hashed_pw = hash_password("testpassword")
            db_user = User(
                first_name="Test",
                last_name="User",
                email="test@example.com",
                hashed_password=hashed_pw,
            )
            db.add(db_user)
            db.commit()
    except Exception as e:
        print(f"Error seeding test user: {e}")
    finally:
        db.close()
    yield


app = FastAPI(lifespan=lifespan)

# Include routers
app.include_router(users_router, prefix="/api/v1", tags=["users"])
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the User Account Creation and Password Reset Microservice"
    }
