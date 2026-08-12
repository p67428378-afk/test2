from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/settings", response_model=schemas.UserSettingsResponse)
def read_settings(db: Session = Depends(get_db)):
    settings = crud.get_user_settings(db)
    return settings


@router.put("/settings", response_model=schemas.UserSettingsResponse)
def update_settings(
    settings_update: schemas.UserSettingsUpdate,
    db: Session = Depends(get_db),
):
    updated_settings = crud.update_user_settings(db, settings_update=settings_update)
    return updated_settings
