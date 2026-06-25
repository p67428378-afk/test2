from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from server.api.v1.endpoints import password_reset, payment
from server.database import Base, engine, SessionLocal
from server import models
import uuid


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed test user
    db = SessionLocal()
    try:
        test_user = (
            db.query(models.User)
            .filter(models.User.login_id == "test@example.com")
            .first()
        )
        if not test_user:
            # Use passlib bcrypt for password hashing
            try:
                from passlib.context import CryptContext

                pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
                hashed_password = pwd_context.hash("testpassword")
            except ImportError:
                hashed_password = "hashed_testpassword"

            db_user = models.User(
                id=uuid.UUID("00000000-0000-0000-0000-000000000000"),
                login_id="test@example.com",
                mobile_number="1234567890",
                hashed_password=hashed_password,
                security_question="What is your favorite color?",
                security_answer_hash="blue",
            )
            db.add(db_user)
            db.commit()
    finally:
        db.close()
    yield


app = FastAPI(lifespan=lifespan)


# Exception handler to convert 422 validation errors to 400 as per WorkSpec
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=400, content={"detail": exc.errors()})


app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(payment.router, prefix="/api/v1", tags=["payment"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Payment and Password Reset Microservice"}
