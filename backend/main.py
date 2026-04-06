from fastapi import FastAPI
from backend.routers import users, applicants, credit_cards, applications
from backend.database import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router, prefix="/api/v1", tags=["users"])
app.include_router(applicants.router, prefix="/api/v1", tags=["applicants"])
app.include_router(credit_cards.router, prefix="/api/v1", tags=["credit_cards"])
app.include_router(applications.router, prefix="/api/v1", tags=["applications"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Credit Card Application API"}
