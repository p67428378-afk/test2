from fastapi import FastAPI
from contextlib import asynccontextmanager
from server.app.database import Base, engine, SessionLocal
from server.app.models import User, SLA
from server.app.routes import incidents, users, slas


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed test user and default SLAs
    db = SessionLocal()
    try:
        # Seed test user
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if not test_user:
            db_user = User(name="Test User", email="test@example.com", role="Engineer")
            db.add(db_user)

        # Seed default SLAs
        default_slas = [
            {"priority": "High", "response_time": 15, "resolution_time": 60},
            {"priority": "Medium", "response_time": 30, "resolution_time": 120},
            {"priority": "Low", "response_time": 60, "resolution_time": 240},
        ]
        for sla_data in default_slas:
            existing_sla = (
                db.query(SLA).filter(SLA.priority == sla_data["priority"]).first()
            )
            if not existing_sla:
                db_sla = SLA(
                    priority=sla_data["priority"],
                    response_time=sla_data["response_time"],
                    resolution_time=sla_data["resolution_time"],
                )
                db.add(db_sla)

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()

    yield


app = FastAPI(title="IT Incident and SLA Management System", lifespan=lifespan)

# Include routers
app.include_router(incidents.router, prefix="/api/v1", tags=["incidents"])
app.include_router(users.router, prefix="/api/v1", tags=["users"])
app.include_router(slas.router, prefix="/api/v1", tags=["slas"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the IT Incident and SLA Management System API"}
