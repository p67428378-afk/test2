
from fastapi import FastAPI
from .database import engine, Base
from .routers import campaigns, deliverables, social_media, metrics

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(campaigns.router, prefix="/api/v1/campaigns", tags=["campaigns"])
app.include_router(deliverables.router, prefix="/api/v1/deliverables", tags=["deliverables"])
app.include_router(social_media.router, prefix="/api/v1/social-media-accounts", tags=["social_media"])
app.include_router(metrics.router, prefix="/api/v1/engagement-metrics", tags=["metrics"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Influencer Hub API"}

