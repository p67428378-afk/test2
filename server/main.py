from fastapi import FastAPI
from server.api.v1.endpoints import password_reset
from server.routes import dashboard, analytics, service_requests
from server.database import Base, engine

# Import all models so Base.metadata is fully populated before create_all
from server.models import (  # noqa: F401
    User,
    EnergySource,
    RealtimeMetric,
    HistoricalMetric,
    Alert,
    ServiceRequest,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Electricity Monitoring Platform API")

# Include existing password reset router
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])

# Include new electricity monitoring routers
app.include_router(dashboard.router, prefix="/api/v1", tags=["dashboard"])
app.include_router(analytics.router, prefix="/api/v1", tags=["analytics"])
app.include_router(service_requests.router, prefix="/api/v1", tags=["service-requests"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Electricity Monitoring Platform API"}
