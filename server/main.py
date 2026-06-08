from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, pipelines, alerts, maintenance
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(pipelines.router, prefix="/api/v1", tags=["pipelines"])
app.include_router(alerts.router, prefix="/api/v1", tags=["alerts"])
app.include_router(maintenance.router, prefix="/api/v1", tags=["maintenance"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Gas Pipeline Management System"}
