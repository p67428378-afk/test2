import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/notes", response_model=List[schemas.NoteListResponse])
def read_notes(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    q: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    notes = crud.get_notes(db, skip=skip, limit=limit, q=q, tag=tag)
    response_data = []
    for note in notes:
        response_data.append(
            {
                "id": note.id,
                "title": note.title,
                "content": note.content,
                "tags": [t.name for t in note.tags],
                "attachments_count": len(note.attachments),
                "created_at": note.created_at,
                "updated_at": note.updated_at,
            }
        )
    return response_data


@router.get("/notes/{id}", response_model=schemas.NoteDetailResponse)
def read_note(id: UUID, db: Session = Depends(get_db)):
    note = crud.get_note_by_id(db, note_id=id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return {
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "tags": [t.name for t in note.tags],
        "attachments": [
            {
                "id": att.id,
                "filename": att.filename,
                "file_size": att.file_size,
                "file_path": att.file_path,
                "created_at": att.created_at,
            }
            for att in note.attachments
        ],
        "created_at": note.created_at,
        "updated_at": note.updated_at,
    }


@router.post("/notes", response_model=schemas.NoteCreateUpdateResponse)
def create_note(note_in: schemas.NoteCreateUpdate, db: Session = Depends(get_db)):
    note = crud.create_note(db, note_in=note_in)
    return {
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "tags": [t.name for t in note.tags],
        "attachments": [],
        "created_at": note.created_at,
        "updated_at": note.updated_at,
    }


@router.put("/notes/{id}", response_model=schemas.NoteCreateUpdateResponse)
def update_note(
    id: UUID, note_in: schemas.NoteCreateUpdate, db: Session = Depends(get_db)
):
    note = crud.get_note_by_id(db, note_id=id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note = crud.update_note(db, db_note=note, note_in=note_in)
    return {
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "tags": [t.name for t in note.tags],
        "attachments": [
            {
                "id": att.id,
                "filename": att.filename,
                "file_size": att.file_size,
                "file_path": att.file_path,
                "created_at": att.created_at,
            }
            for att in note.attachments
        ],
        "created_at": note.created_at,
        "updated_at": note.updated_at,
    }


@router.delete("/notes/{id}", response_model=schemas.DeleteResponse)
def delete_note(id: UUID, db: Session = Depends(get_db)):
    note = crud.get_note_by_id(db, note_id=id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    crud.delete_note(db, db_note=note)
    return {"status": "success"}


@router.post("/notes/{id}/attachments", response_model=schemas.AttachmentResponse)
async def upload_attachment(
    id: UUID, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    note = crud.get_note_by_id(db, note_id=id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    filename = file.filename or "unnamed"
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{uuid.uuid4()}_{filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    file_size = os.path.getsize(file_path)

    attachment = crud.create_attachment(
        db, note_id=id, filename=filename, file_size=file_size, file_path=file_path
    )
    return {
        "id": attachment.id,
        "note_id": attachment.note_id,
        "filename": attachment.filename,
        "file_size": attachment.file_size,
        "file_path": attachment.file_path,
        "created_at": attachment.created_at,
    }


@router.delete("/attachments/{id}", response_model=schemas.DeleteResponse)
def delete_attachment(id: UUID, db: Session = Depends(get_db)):
    attachment = crud.get_attachment_by_id(db, attachment_id=id)
    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")

    if os.path.exists(attachment.file_path):
        try:
            os.remove(attachment.file_path)
        except Exception:
            pass

    crud.delete_attachment(db, db_attachment=attachment)
    return {"status": "success"}


@router.get("/attachments", response_model=List[schemas.RecentAttachmentResponse])
def read_attachments(db: Session = Depends(get_db)):
    attachments = crud.get_all_attachments(db)
    return [
        {
            "id": att.id,
            "note_id": att.note_id,
            "note_title": att.note.title,
            "filename": att.filename,
            "file_size": att.file_size,
            "file_path": att.file_path,
            "created_at": att.created_at,
        }
        for att in attachments
    ]


@router.get("/tags", response_model=List[str])
def read_tags(db: Session = Depends(get_db)):
    return crud.get_all_tags(db)
