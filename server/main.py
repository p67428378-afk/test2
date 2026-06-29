from contextlib import asynccontextmanager
from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, advisor
from server.database import Base, engine, SessionLocal
from server.crud import seed_data

# Create tables
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed data on startup
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(advisor.router, prefix="/api/v1", tags=["advisor"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the DG Cluster Assortment Advisor Microservice"}
