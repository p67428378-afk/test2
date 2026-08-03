from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os
from server.api.v1.endpoints import (
    password_reset,
    auth,
    books,
    members,
    loans,
    fines,
    inventory,
)
from server.database import init_db, seed_data, SessionLocal

# Initialize database tables
init_db()

# Seed initial data
db = SessionLocal()
try:
    seed_data(db)
finally:
    db.close()

app = FastAPI(title="Library Management System API", version="1.0.0")

# CORS Middleware configuration
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
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(books.router, prefix="/api/v1", tags=["books"])
app.include_router(members.router, prefix="/api/v1", tags=["members"])
app.include_router(loans.router, prefix="/api/v1", tags=["loans"])
app.include_router(fines.router, prefix="/api/v1", tags=["fines"])
app.include_router(inventory.router, prefix="/api/v1", tags=["inventory"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Library Management System API"}
