from fastapi import FastAPI

from server.api.v1.endpoints import auth, movies, users
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Films Dashboard System",
    description="Personalized Movie Discovery",
    version="1.0.0",
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(movies.router, prefix="/api/v1/movies", tags=["movies"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Films Dashboard System"}
