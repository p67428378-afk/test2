
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from backend import crud, schemas
from backend.database import get_db
import json
from pydantic import ValidationError

router = APIRouter()

@router.post("/", response_model=schemas.Application)
def create_application(
    application: str = Form(...),
    account_statement: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        application_dict = json.loads(application)
        application_schema = schemas.ApplicationCreate(**application_dict)
    except (ValidationError, json.JSONDecodeError) as e:
        raise HTTPException(status_code=422, detail=str(e))

    account_statement_ref = account_statement.filename

    return crud.create_application(db=db, application=application_schema, account_statement_ref=account_statement_ref)
