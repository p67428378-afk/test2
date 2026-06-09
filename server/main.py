from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.database import Base, engine
# Import all models to ensure they are registered on Base.metadata before create_all
from server import models
from server.api.v1.endpoints import password_reset, assortment

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DG Cluster Assortment Advisor API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(assortment.router, prefix="/api/v1", tags=["assortment-advisor"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the DG Cluster Assortment Advisor API"}
