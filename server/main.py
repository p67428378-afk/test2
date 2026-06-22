from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, notes, stats
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NoteFlow API")

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(notes.router, prefix="/api/v1", tags=["notes"])
app.include_router(stats.router, prefix="/api/v1", tags=["stats"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the NoteFlow API"}
