from fastapi import FastAPI
from server.api.v1.endpoints import password_reset
from server import routes
from server.database import Base, engine, SessionLocal
from server.auth import hash_password
from server.models import User
import contextlib

Base.metadata.create_all(bind=engine)


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed test account if it doesn't exist
    db = SessionLocal()
    try:
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if not test_user:
            from server.auth import encrypt_ssn

            hashed_pw = hash_password("testpassword")
            new_user = User(
                full_name="Test User",
                email="test@example.com",
                phone_number="1234567890",
                encrypted_ssn=encrypt_ssn("123456789"),
                date_of_birth="1990-01-01",
                password_hash=hashed_pw,
                is_active=True,
            )
            db.add(new_user)
            db.commit()
    finally:
        db.close()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(routes.router, tags=["auth"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Password Reset and Auth Microservice"}
