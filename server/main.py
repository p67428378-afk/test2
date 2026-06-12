from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, trails, trail_reports, wildlife_sightings, access_rules
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(trails.router, prefix="/api/v1", tags=["trails"])
app.include_router(trail_reports.router, prefix="/api/v1", tags=["trail-reports"])
app.include_router(wildlife_sightings.router, prefix="/api/v1", tags=["wildlife-sightings"])
app.include_router(access_rules.router, prefix="/api/v1", tags=["access-rules"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Mountains Management System"}
