from contextlib import asynccontextmanager
from fastapi import FastAPI
from server.database import Base, engine, SessionLocal
from server.models.doctor import Doctor
from server.models.medication import Medication
from server.routers import (
    patients,
    doctors,
    appointments,
    medical_records,
    medications,
    prescriptions,
    invoices,
    payments,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed initial data if empty
    db = SessionLocal()
    try:
        # Seed a doctor if none exists
        if db.query(Doctor).count() == 0:
            default_doctor = Doctor(
                name="Dr. Alex Mercer",
                specialty="General Medicine",
                phone="555-0199",
                email="alex.mercer@careflow.com",
            )
            db.add(default_doctor)

        # Seed some medications if none exist
        if db.query(Medication).count() == 0:
            meds = [
                Medication(
                    name="Amoxicillin",
                    code="AMX500",
                    description="Antibiotic",
                    price=15.50,
                    stock_quantity=100,
                ),
                Medication(
                    name="Ibuprofen",
                    code="IBU400",
                    description="Pain Reliever",
                    price=8.20,
                    stock_quantity=250,
                ),
                Medication(
                    name="Paracetamol",
                    code="PAR500",
                    description="Antipyretic",
                    price=5.00,
                    stock_quantity=500,
                ),
            ]
            for med in meds:
                db.add(med)

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
    finally:
        db.close()

    yield


app = FastAPI(
    title="CareFlow HMS API",
    description="Comprehensive Hospital Management System API",
    version="1.0.0",
    lifespan=lifespan,
)

# Include routers
app.include_router(patients.router, prefix="/api/v1", tags=["Patients"])
app.include_router(doctors.router, prefix="/api/v1", tags=["Doctors"])
app.include_router(appointments.router, prefix="/api/v1", tags=["Appointments"])
app.include_router(medical_records.router, prefix="/api/v1", tags=["Medical Records"])
app.include_router(medications.router, prefix="/api/v1", tags=["Medications"])
app.include_router(prescriptions.router, prefix="/api/v1", tags=["Prescriptions"])
app.include_router(invoices.router, prefix="/api/v1", tags=["Invoices"])
app.include_router(payments.router, prefix="/api/v1", tags=["Payments"])


@app.get("/")
def read_root():
    return {"message": "Welcome to CareFlow Hospital Management System API"}
