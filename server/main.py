from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.database import Base, engine, SessionLocal
from server.models import User, SolarSystem, Alert, ServiceRequest
from server.auth import get_password_hash
from server.routes import auth, systems, alerts, service_requests
from contextlib import asynccontextmanager


# Seed test accounts in lifespan startup hook
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed default users if they don't exist
    db = SessionLocal()
    try:
        # 1. Solar Owner
        owner = db.query(User).filter(User.email == "test@example.com").first()
        if not owner:
            owner = User(
                email="test@example.com",
                name="Test Solar Owner",
                role="owner",
                password_hash=get_password_hash("testpassword"),
            )
            db.add(owner)
            db.commit()
            db.refresh(owner)

        # 2. Technician
        tech = db.query(User).filter(User.email == "tech@example.com").first()
        if not tech:
            tech = User(
                email="tech@example.com",
                name="Test Technician",
                role="technician",
                password_hash=get_password_hash("testpassword"),
            )
            db.add(tech)
            db.commit()
            db.refresh(tech)

        # Seed a default solar system for the owner if none exists
        system = db.query(SolarSystem).filter(SolarSystem.user_id == owner.id).first()
        if not system:
            system = SolarSystem(
                user_id=owner.id, name="Main Residential Array", status="Online"
            )
            db.add(system)
            db.commit()
            db.refresh(system)

            # Seed a critical alert to trigger a service request
            alert = Alert(
                system_id=system.id,
                severity="Critical",
                description="Inverter output dropped by 35% (Threshold: 25%)",
                is_resolved=False,
            )
            db.add(alert)
            db.commit()
            db.refresh(alert)

            # Seed a service request for the critical alert
            service_req = ServiceRequest(
                alert_id=alert.id,
                status="New",
                notes="Automated service request created for critical inverter failure.",
            )
            db.add(service_req)
            db.commit()

    finally:
        db.close()

    yield


app = FastAPI(lifespan=lifespan)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(systems.router, prefix="/api/v1", tags=["systems"])
app.include_router(alerts.router, prefix="/api/v1", tags=["alerts"])
app.include_router(service_requests.router, prefix="/api/v1", tags=["service-requests"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Solar Panel Monitoring Platform API"}
