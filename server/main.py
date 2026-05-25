from fastapi import FastAPI
from .database import engine
from . import models
from .routers import campaigns, deliverables, social_media, metrics

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(campaigns.router, prefix="/api/v1/campaigns", tags=["campaigns"])
app.include_router(deliverables.router, prefix="/api/v1", tags=["deliverables"])
app.include_router(social_media.router, prefix="/api/v1", tags=["social_media"])
app.include_router(metrics.router, prefix="/api/v1", tags=["metrics"])

@app.get("/")
def read_root():
    return {"Hello": "World"}
