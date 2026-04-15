
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend import crud, schemas
from backend.database import get_db
import json

router = APIRouter()

@router.post("/", response_model=schemas.Application)
def create_application(
    application: str = Form(...),
    account_statement: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    application_dict = json.loads(application)
    application_schema = schemas.ApplicationCreate(**application_dict)

    account_statement_ref = account_statement.filename

    return crud.create_application(db=db, application=application_schema, account_statement_ref=account_statement_ref)
