
from fastapi import FastAPI
from server.database import engine
from server.models import Base
from server.api.v1.endpoints import pandits, bookings, devotees

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(pandits.router, prefix="/api/v1", tags=["pandits"])
app.include_router(bookings.router, prefix="/api/v1", tags=["bookings"])
app.include_router(devotees.router, prefix="/api/v1", tags=["devotees"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Pandit Management System"}
