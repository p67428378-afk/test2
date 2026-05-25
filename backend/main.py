from fastapi import FastAPI
from .database import engine, Base
from .routers import statement_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Bank Account Statement Generation Service",
    description="A service to generate bank account statements in PDF/Excel format.",
    version="1.0.0",
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Bank Account Statement Generation Service"}

app.include_router(statement_router.router, prefix="/statements", tags=["statements"])
