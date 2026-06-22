from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.database import Base, engine
from server.router import router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Greetings of India API",
    description="A RESTful API to serve traditional greetings from different regions across India.",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router
app.include_router(router, prefix="/api/v1", tags=["greetings"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Greetings of India API", "docs_url": "/docs"}
