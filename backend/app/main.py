
from fastapi import FastAPI
from backend.app.api import statements
from backend.app.db.database import engine, Base, SessionLocal
from backend.app.services import statement_service

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    statement_service.populate_db(db)
    db.close()

app.include_router(statements.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
