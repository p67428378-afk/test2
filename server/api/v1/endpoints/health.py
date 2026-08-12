from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from server.database import get_db
from server import schemas

router = APIRouter()


@router.get("/health", response_model=schemas.HealthResponse)
def health_check(db: Session = Depends(get_db)):
    """Health check monitoring database readiness and service status."""
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection failed: {str(e)}",
        )

    return schemas.HealthResponse(
        status="healthy", database=db_status, timestamp=datetime.now(timezone.utc)
    )
