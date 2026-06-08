
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db
from uuid import UUID
import shutil
import uuid

router = APIRouter()

@router.post("/upload", response_model=schemas.Document)
def upload_document(matter_id: UUID, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # In a real app, you\'d save this to a secure location
    file_path = f"./{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    document = schemas.DocumentCreate(
        matter_id=matter_id, 
        file_name=file.filename, 
        file_path=file_path,
        uploaded_by_user_id=uuid.UUID("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11") # Placeholder
    )
    return crud.create_document(db=db, document=document)

@router.get("/{document_id}/download")
def download_document(document_id: UUID, db: Session = Depends(get_db)):
    db_document = crud.get_document(db, document_id=document_id)
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    # In a real app, you\'d return a FileResponse
    return {"file_content": f"content of {db_document.file_name}"}
