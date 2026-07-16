from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os
from server.api.v1.endpoints import password_reset, animals, health_examinations, protected_zones, reports
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="EcoTrack - Wildlife Conservation Management System")

# CORS Middleware configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(animals.router, prefix="/api/v1", tags=["animals"])
app.include_router(health_examinations.router, prefix="/api/v1", tags=["health-examinations"])
app.include_router(protected_zones.router, prefix="/api/v1", tags=["protected-zones"])
app.include_router(reports.router, prefix="/api/v1", tags=["reports"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Wildlife Conservation Management System (EcoTrack) API"}
