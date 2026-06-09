from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.get("/config", response_model=schemas.CodeReviewConfigSchema)
def read_config(db: Session = Depends(get_db)):
    config = crud.get_config(db)
    return config

@router.put("/config", response_model=schemas.CodeReviewConfigSchema)
def update_config(config_schema: schemas.CodeReviewConfigSchema, db: Session = Depends(get_db)):
    config = crud.update_config(db, config_schema)
    return config
