
from fastapi import FastAPI
from server.api.v1.endpoints import pandits, bookings, shifts
from server.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(pandits.router, prefix="/api/v1/pandits", tags=["pandits"])
app.include_router(bookings.router, prefix="/api/v1/bookings", tags=["bookings"])
app.include_router(shifts.router, prefix="/api/v1/shifts", tags=["shifts"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Temple Prayer Booking System"}
