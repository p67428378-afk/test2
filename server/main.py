
from fastapi import FastAPI
from server.database import engine, Base
from server.routers import auth, clients, matters, documents, time_entries, invoices

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(clients.router, prefix="/api/v1/clients", tags=["clients"])
app.include_router(matters.router, prefix="/api/v1/matters", tags=["matters"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["documents"])
app.include_router(time_entries.router, prefix="/api/v1/time-entries", tags=["time-entries"])
app.include_router(invoices.router, prefix="/api/v1/invoices", tags=["invoices"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Law Management System API"}
