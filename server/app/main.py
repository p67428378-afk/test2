from fastapi import FastAPI
from server.app.database import Base, engine
from server.app.routers import bodies, funerals, invoices

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Mortuary Management System",
    description="API for managing mortuary operations, body tracking, funeral arrangements, and billing.",
    version="1.0.0"
)

# Include routers
app.include_router(bodies.router, prefix="/api/v1")
app.include_router(funerals.router, prefix="/api/v1")
app.include_router(invoices.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Mortuary Management System API"}
