import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas
from server.database import get_db

router = APIRouter()

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post(
    "/manuscripts",
    response_model=schemas.ManuscriptUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_manuscript(
    file: UploadFile = File(...), db: Session = Depends(get_db)
):
    # Validate file type
    filename = file.filename or ""
    ext = os.path.splitext(filename)[1].lower()
    if ext not in [".pdf", ".txt", ".docx", ".doc"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF, TXT, DOCX, and DOC are allowed.",
        )

    # Save file
    file_id = uuid.uuid4()
    saved_filename = f"{file_id}_{filename}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)

    try:
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}",
        )

    # Automated Metadata Extraction
    title = os.path.splitext(filename)[0].replace("_", " ").replace("-", " ").title()
    abstract = "No abstract extracted."

    if ext == ".txt":
        try:
            text_content = content.decode("utf-8")
            lines = [line.strip() for line in text_content.split("\n") if line.strip()]
            if lines:
                first_line = lines[0]
                if first_line.lower().startswith("title:"):
                    title = first_line[6:].strip()
                else:
                    title = first_line

                # Look for abstract
                for i, line in enumerate(lines):
                    if line.lower().startswith("abstract:"):
                        abstract = line[9:].strip()
                        break
                    elif line.lower() == "abstract" and i + 1 < len(lines):
                        abstract = lines[i + 1]
                        break
        except Exception:
            pass  # Fallback to default title/abstract

    # Create manuscript in DB
    creator_id = uuid.uuid4()
    try:
        manuscript = crud.create_manuscript(
            db=db,
            title=title,
            abstract=abstract,
            file_path=file_path,
            creator_id=creator_id,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Metadata extraction failed: {str(e)}",
        )

    return manuscript


@router.get("/manuscripts", response_model=List[schemas.ManuscriptResponse])
def get_manuscripts(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return crud.list_manuscripts(db=db, skip=skip, limit=limit)


@router.get("/manuscripts/{id}", response_model=schemas.ManuscriptResponse)
def get_manuscript_details(id: uuid.UUID, db: Session = Depends(get_db)):
    manuscript = crud.get_manuscript(db=db, manuscript_id=id)
    if not manuscript:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Manuscript not found"
        )
    return manuscript


@router.put("/manuscripts/{id}", response_model=schemas.ManuscriptResponse)
def update_manuscript_details(
    id: uuid.UUID,
    update_data: schemas.ManuscriptUpdateRequest,
    db: Session = Depends(get_db),
):
    manuscript = crud.get_manuscript(db=db, manuscript_id=id)
    if not manuscript:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Manuscript not found"
        )

    # Validate update data
    if update_data.title is not None and not update_data.title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Title cannot be empty"
        )

    updated_manuscript = crud.update_manuscript(
        db=db, manuscript=manuscript, update_data=update_data
    )
    return updated_manuscript


@router.post(
    "/manuscripts/{id}/collaborators",
    response_model=schemas.CollaboratorResponse,
    status_code=status.HTTP_201_CREATED,
)
def invite_collaborator(
    id: uuid.UUID,
    invite_data: schemas.CollaboratorInviteRequest,
    db: Session = Depends(get_db),
):
    manuscript = crud.get_manuscript(db=db, manuscript_id=id)
    if not manuscript:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Manuscript not found"
        )

    # Validate email
    if "@" not in invite_data.email or "." not in invite_data.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email address"
        )

    # Check if already assigned
    existing = crud.get_collaborator_by_email(
        db=db, manuscript_id=id, email=invite_data.email
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Collaborator with this email is already assigned to this manuscript",
        )

    collaborator = crud.create_collaborator(
        db=db, manuscript_id=id, email=invite_data.email, role=invite_data.role
    )
    return collaborator


@router.get(
    "/manuscripts/{id}/collaborators", response_model=List[schemas.CollaboratorResponse]
)
def list_collaborators(id: uuid.UUID, db: Session = Depends(get_db)):
    manuscript = crud.get_manuscript(db=db, manuscript_id=id)
    if not manuscript:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Manuscript not found"
        )
    return crud.get_collaborators(db=db, manuscript_id=id)


@router.post(
    "/manuscripts/{id}/compliance-check", response_model=schemas.ComplianceCheckResponse
)
def run_compliance_check(
    id: uuid.UUID,
    check_data: schemas.ComplianceCheckRequest,
    db: Session = Depends(get_db),
):
    manuscript = crud.get_manuscript(db=db, manuscript_id=id)
    if not manuscript:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Manuscript not found"
        )

    stylesheet = crud.get_stylesheet(db=db, stylesheet_id=check_data.stylesheet_id)
    if not stylesheet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Style sheet not found"
        )

    errors = []
    warnings = []

    rules = stylesheet.rules or {}

    # Check title length
    max_title_len = rules.get("max_title_length", 100)
    if manuscript.title and len(manuscript.title) > max_title_len:
        errors.append(f"Title exceeds maximum length of {max_title_len} characters.")

    # Check abstract presence
    if not manuscript.abstract or manuscript.abstract == "No abstract extracted.":
        errors.append("Abstract is missing or empty.")
    elif len(manuscript.abstract) < rules.get("min_abstract_length", 10):
        warnings.append("Abstract is very short.")

    # Check file path
    if not manuscript.file_path:
        errors.append("Manuscript file is missing.")

    status_result = "failed" if errors else "passed"

    return {"status": status_result, "errors": errors, "warnings": warnings}


@router.get(
    "/manuscripts/{id}/revisions", response_model=List[schemas.RevisionResponse]
)
def get_revisions(id: uuid.UUID, db: Session = Depends(get_db)):
    manuscript = crud.get_manuscript(db=db, manuscript_id=id)
    if not manuscript:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Manuscript not found"
        )
    return crud.get_revisions(db=db, manuscript_id=id)


@router.post(
    "/manuscripts/{id}/revisions/{revision_id}/rebuttal",
    response_model=schemas.RevisionResponse,
)
def submit_rebuttal(
    id: uuid.UUID,
    revision_id: uuid.UUID,
    rebuttal_data: schemas.RebuttalRequest,
    db: Session = Depends(get_db),
):
    manuscript = crud.get_manuscript(db=db, manuscript_id=id)
    if not manuscript:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Manuscript not found"
        )

    revision = crud.get_revision(db=db, revision_id=revision_id)
    if not revision or revision.manuscript_id != id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Revision not found for this manuscript",
        )

    if not rebuttal_data.author_rebuttal.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rebuttal text cannot be empty",
        )

    updated_revision = crud.update_revision_rebuttal(
        db=db,
        revision=revision,
        rebuttal=rebuttal_data.author_rebuttal,
        text_link=rebuttal_data.text_link,
    )
    return updated_revision
