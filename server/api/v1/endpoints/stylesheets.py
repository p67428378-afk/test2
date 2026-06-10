from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from server import crud, models, schemas
from server.database import get_db

router = APIRouter()


@router.get("/stylesheets", response_model=List[schemas.StylesheetResponse])
def get_stylesheets(db: Session = Depends(get_db)):
    # Ensure default stylesheet exists
    default_sheet = (
        db.query(models.Stylesheet)
        .filter(models.Stylesheet.name == "Standard Academic Style")
        .first()
    )
    if not default_sheet:
        default_rules = {
            "max_title_length": 100,
            "min_abstract_length": 50,
            "required_sections": ["Abstract", "Introduction", "Conclusion"],
        }
        crud.create_stylesheet(
            db=db, name="Standard Academic Style", rules=default_rules
        )
    return crud.list_stylesheets(db=db)


# Optional helper endpoint to create stylesheets for testing
@router.post(
    "/stylesheets",
    response_model=schemas.StylesheetResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_stylesheet(name: str, rules: dict, db: Session = Depends(get_db)):
    return crud.create_stylesheet(db=db, name=name, rules=rules)
