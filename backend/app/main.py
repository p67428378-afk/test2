from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .api import premium_calculator
from .db.database import Base, engine
from .dependencies import get_db

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In a production environment, restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(premium_calculator.router, prefix="/api", dependencies=[Depends(get_db)])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Vehicle Insurance Premium Calculator"}
