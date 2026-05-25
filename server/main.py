
from fastapi import FastAPI
from server.api.v1.endpoints import submissions
from server.db.base import Base
from server.db.session import engine

# This is to ensure models are registered with SQLAlchemy
from server.models import submission

# Create DB tables
# In a real production app, you would use Alembic migrations.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Form 15G/15H Submission Microservice",
    description="A microservice to handle digital submission of Form 15G/15H for TDS exemption.",
    version="1.0.0"
)

app.include_router(submissions.router, prefix="/api/v1/forms", tags=["Form Submissions"])

@app.get("/health")
def read_health():
    return {"status": "ok"}
