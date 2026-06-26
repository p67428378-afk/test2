from fastapi import FastAPI
from contextlib import asynccontextmanager
from server.api.v1.endpoints import password_reset, auth, leave_requests
from server.database import Base, engine, SessionLocal
from server import models
from server.core import security


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed data
    db = SessionLocal()
    try:
        # Check if manager exists
        manager = (
            db.query(models.User).filter(models.User.login_id == "manager").first()
        )
        if not manager:
            manager_data = {
                "login_id": "manager",
                "hashed_password": security.get_password_hash("testpassword"),
                "email": "manager@example.com",
                "name": "Manager User",
                "role": "manager",
                "mobile_number": "0987654321",
                "security_question": "What is your favorite color?",
                "security_answer_hash": "blue",
                "leave_balance": 20,
            }
            manager = models.User(**manager_data)
            db.add(manager)
            db.commit()
            db.refresh(manager)

        # Check if test user exists
        test_user = (
            db.query(models.User).filter(models.User.login_id == "testuser").first()
        )
        if not test_user:
            user_data = {
                "login_id": "testuser",
                "hashed_password": security.get_password_hash("testpassword"),
                "email": "test@example.com",
                "name": "Test User",
                "role": "employee",
                "mobile_number": "1234567890",
                "security_question": "What is your favorite color?",
                "security_answer_hash": "blue",
                "leave_balance": 20,
                "manager_id": manager.id,
            }
            test_user = models.User(**user_data)
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
    finally:
        db.close()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(leave_requests.router, prefix="/api/v1", tags=["leave-requests"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Employee Leave Management System"}
