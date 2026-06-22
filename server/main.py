from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api.v1.endpoints import password_reset, auth, packages, bookings, payments
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RoamEase Travel Booking API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(packages.router, prefix="/api/v1", tags=["packages"])
app.include_router(bookings.router, prefix="/api/v1", tags=["bookings"])
app.include_router(payments.router, prefix="/api/v1", tags=["payments"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the RoamEase Travel Booking API"}
