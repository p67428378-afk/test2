from fastapi import FastAPI
from .database import engine, Base
from .routers import policy
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.on_event("startup")
async def startup_event():
    """
    Create database tables on application startup.
    This ensures tables are created when the app runs normally,
    but not when imported for testing, where test fixtures handle it.
    In a production environment, consider using Alembic for migrations.
    """
    Base.metadata.create_all(bind=engine)

app.include_router(policy.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Policyholder Self-Service API"}
