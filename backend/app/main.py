from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.api_router import api_router
from .database import Base, engine

def create_tables():
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KYC Onboarding Service",
    description="A microservice to handle KYC onboarding for a retail bank.",
    version="1.0.0",
)

@app.on_event("startup")
def on_startup():
    create_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok"}
