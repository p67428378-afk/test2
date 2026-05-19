
from fastapi import FastAPI
from app.api.v1 import dashboard, bookings, rooms, finance, staff
from app.db.session import engine, Base

app = FastAPI()

def create_tables():
    Base.metadata.create_all(bind=engine)

@app.on_event("startup")
async def startup_event():
    create_tables()

app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])
app.include_router(bookings.router, prefix="/api/v1/bookings", tags=["bookings"])
app.include_router(rooms.router, prefix="/api/v1/rooms", tags=["rooms"])
app.include_router(finance.router, prefix="/api/v1/finance", tags=["finance"])
app.include_router(staff.router, prefix="/api/v1/staff", tags=["staff"])

@app.get("/")
def read_root():
    return {"message": "Hotel Management System API"}
