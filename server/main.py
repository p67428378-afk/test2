from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, flowers, inventory, growth, tasks
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FloraFlow - Flower Lifecycle Management API")

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(flowers.router, prefix="/api/v1", tags=["flowers"])
app.include_router(inventory.router, prefix="/api/v1", tags=["inventory"])
app.include_router(growth.router, prefix="/api/v1", tags=["growth"])
app.include_router(tasks.router, prefix="/api/v1", tags=["tasks"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the FloraFlow Flower Lifecycle Management API"}
