from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from server.database import Base, engine
from server.routers import auth, properties, inquiries, dashboard
from server.api.v1.endpoints import password_reset

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Homely House Broker API", version="1.0.0")

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
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(properties.router, prefix="/api/v1", tags=["properties"])
app.include_router(inquiries.router, prefix="/api/v1", tags=["inquiries"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["dashboard"])
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])


@app.get("/")
def read_root():
    return {"message": "Welcome to Homely House Broker API"}
