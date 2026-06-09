from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.database import Base, engine
from server.routers import inventory, orders, customers, reports

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Glass Management System API", version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(inventory.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")
app.include_router(customers.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Glass Management System API"}
