from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os

from server.api.v1.endpoints import password_reset, books
from server.database import Base, engine, SessionLocal
from server import models

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

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
app.include_router(books.router, prefix="/api/v1", tags=["books"])


@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    try:
        # Seed books if empty
        if db.query(models.Book).count() == 0:
            sample_books = [
                models.Book(
                    title="The Hobbit",
                    author="J.R.R. Tolkien",
                    isbn="9780345391803",
                    published_year=1937,
                    genre="Fantasy",
                    total_copies=5,
                    available_copies=5,
                    is_available=True,
                    cover_image_url="",
                ),
                models.Book(
                    title="The Fellowship of the Ring",
                    author="J.R.R. Tolkien",
                    isbn="9780618346257",
                    published_year=1954,
                    genre="Fantasy",
                    total_copies=5,
                    available_copies=5,
                    is_available=True,
                    cover_image_url="",
                ),
                models.Book(
                    title="The Two Towers",
                    author="J.R.R. Tolkien",
                    isbn="9780618346264",
                    published_year=1954,
                    genre="Fantasy",
                    total_copies=5,
                    available_copies=0,
                    is_available=False,
                    cover_image_url="",
                ),
                models.Book(
                    title="The Return of the King",
                    author="J.R.R. Tolkien",
                    isbn="9780618346271",
                    published_year=1955,
                    genre="Fantasy",
                    total_copies=5,
                    available_copies=5,
                    is_available=True,
                    cover_image_url="",
                ),
                models.Book(
                    title="The Silmarillion",
                    author="J.R.R. Tolkien",
                    isbn="9780618391110",
                    published_year=1977,
                    genre="Fantasy",
                    total_copies=5,
                    available_copies=5,
                    is_available=True,
                    cover_image_url="",
                ),
                models.Book(
                    title="Unfinished Tales",
                    author="J.R.R. Tolkien",
                    isbn="9780618154050",
                    published_year=1980,
                    genre="Fantasy",
                    total_copies=5,
                    available_copies=5,
                    is_available=True,
                    cover_image_url="",
                ),
            ]
            db.add_all(sample_books)
            db.commit()
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Welcome to the Library Management System API"}
