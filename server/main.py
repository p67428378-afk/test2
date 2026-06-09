from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api.v1.endpoints import password_reset, calculate
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Simple Calculator API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(calculate.router, prefix="/api/v1", tags=["calculator"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Simple Calculator API"}
