from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from server.database import Base, engine, get_db
from server import models, websocket
from server.api.v1.endpoints import password_reset, appointments, insurance

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CareFlow Appointment Booking Service")

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
app.include_router(appointments.router, prefix="/api/v1", tags=["appointments"])
app.include_router(insurance.router, prefix="/api/v1", tags=["insurance"])

# Include WebSocket router
app.include_router(websocket.router)


# Seed test data on startup
@app.on_event("startup")
def startup_populate():
    db = next(get_db())
    try:
        # Seed doctors if none exist
        if db.query(models.Doctor).count() == 0:
            doc1 = models.Doctor(name="Dr. Alice Smith", specialty="Cardiology")
            doc2 = models.Doctor(name="Dr. Robert Chen", specialty="Pediatrics")
            doc3 = models.Doctor(name="Dr. Emily Taylor", specialty="General Medicine")
            db.add_all([doc1, doc2, doc3])
            db.commit()

        # Seed patients if none exist
        if db.query(models.Patient).count() == 0:
            pat1 = models.Patient(
                name="Sarah Jenkins",
                contact_info={"email": "sarah@example.com", "phone": "555-0199"},
            )
            pat2 = models.Patient(
                name="John Doe",
                contact_info={"email": "test@example.com", "phone": "555-0100"},
            )
            db.add_all([pat1, pat2])
            db.commit()
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Welcome to the CareFlow Appointment Booking Service"}
