from contextlib import asynccontextmanager
from fastapi import FastAPI
from server.api.v1.endpoints import (
    password_reset,
    auth,
    books,
    patrons,
    circulation,
    reports,
)
from server.database import Base, engine, SessionLocal
from server.api.v1.endpoints.auth import get_password_hash
from server import models


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed test accounts
    db = SessionLocal()
    try:
        # Seed librarian
        librarian = (
            db.query(models.User)
            .filter(models.User.login_id == "test@example.com")
            .first()
        )
        if not librarian:
            hashed_pw = get_password_hash("testpassword")
            new_lib = models.User(
                login_id="test@example.com",
                mobile_number="1234567890",
                hashed_password=hashed_pw,
                security_question="What is your favorite color?",
                security_answer_hash=hashed_pw,
            )
            db.add(new_lib)

        # Seed patron
        patron = (
            db.query(models.Patron)
            .filter(models.Patron.email == "test@example.com")
            .first()
        )
        if not patron:
            hashed_pw = get_password_hash("testpassword")
            new_patron = models.Patron(
                username="test_patron",
                email="test@example.com",
                hashed_password=hashed_pw,
                full_name="Test Patron",
                mobile_number="1234567890",
            )
            db.add(new_patron)

        db.commit()
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

    yield


app = FastAPI(lifespan=lifespan)

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(books.router, prefix="/api/v1", tags=["books"])
app.include_router(patrons.router, prefix="/api/v1", tags=["patrons"])
app.include_router(circulation.router, prefix="/api/v1", tags=["circulation"])
app.include_router(reports.router, prefix="/api/v1", tags=["reports"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Library Management System API"}
