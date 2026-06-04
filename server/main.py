
from fastapi import FastAPI
from server.app.api.v1.endpoints import premiums

app = FastAPI(title="AutoGuard Calc API", version="1.0.0")

app.include_router(premiums.router, prefix="/api/v1/premiums", tags=["premiums"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AutoGuard Calc API"}
