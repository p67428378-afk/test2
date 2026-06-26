from contextlib import asynccontextmanager
from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, auth, books, loans
from server.database import Base, engine, SessionLocal
from server.core.security import get_password_hash
from server import models


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed test accounts
    db = SessionLocal()
    try:
        # Seed member
        test_member = (
            db.query(models.User)
            .filter(models.User.email == "test@example.com")
            .first()
        )
        if not test_member:
            hashed_password = get_password_hash("testpassword")
            db_user = models.User(
                username="testuser",
                email="test@example.com",
                password_hash=hashed_password,
                role="member",
                login_id="testuser",
                mobile_number="0000000000_testuser",
                hashed_password=hashed_password,
                security_question="dummy",
                security_answer_hash="dummy",
            )
            db.add(db_user)

        # Seed librarian
        test_librarian = (
            db.query(models.User)
            .filter(models.User.email == "librarian@example.com")
            .first()
        )
        if not test_librarian:
            hashed_password = get_password_hash("testpassword")
            db_librarian = models.User(
                username="librarian",
                email="librarian@example.com",
                password_hash=hashed_password,
                role="librarian",
                login_id="librarian",
                mobile_number="0000000000_librarian",
                hashed_password=hashed_password,
                security_question="dummy",
                security_answer_hash="dummy",
            )
            db.add(db_librarian)

        db.commit()
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()
    yield


app = FastAPI(lifespan=lifespan)

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(books.router, prefix="/api/v1", tags=["books"])
app.include_router(loans.router, prefix="/api/v1", tags=["loans"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Library Management System API"}
