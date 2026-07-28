from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from uuid import UUID, uuid4
import hashlib

from server.database import get_db, log_audit, log_chain_of_custody
from server.models import Evidence, Case, User
from server.schemas import (
    EvidenceUploadRequest,
    EvidenceUploadResponse,
    EvidenceResponse,
)
from server.auth import get_current_user, RoleChecker

router = APIRouter(prefix="/evidence", tags=["evidence"])

ALLOWED_CONTENT_TYPES = {
    # Images
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    # Videos
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    # Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}


@router.post("/upload", response_model=EvidenceUploadResponse)
def upload_evidence(
    req: EvidenceUploadRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Administrator", "Investigator"])),
):
    # Validate file type
    if req.file_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{req.file_type}' is not supported. Allowed types: images, videos, and documents.",
        )

    # If case_id is provided, verify it exists
    if req.case_id:
        case = db.query(Case).filter(Case.id == req.case_id).first()
        if not case:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Case not found"
            )

    evidence_id = uuid4()
    storage_path = f"evidence/{evidence_id}/{req.filename}"
    # Generate a mock upload URL pointing to our mock upload endpoint
    upload_url = f"http://localhost:8000/api/v1/evidence/upload-file/{evidence_id}"

    # Create evidence metadata
    evidence = Evidence(
        id=evidence_id,
        filename=req.filename,
        file_type=req.file_type,
        file_size=req.file_size,
        sha256_hash=req.sha256_hash,
        storage_path=storage_path,
        uploaded_by_id=current_user.id,
        case_id=req.case_id,
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)

    # Log chain of custody
    log_chain_of_custody(
        db,
        evidence.id,
        current_user.id,
        "UPLOAD",
        {
            "filename": req.filename,
            "case_id": str(req.case_id) if req.case_id else None,
        },
    )

    # Log audit
    log_audit(
        db,
        current_user.id,
        "EVIDENCE_UPLOAD_INITIATED",
        {"evidence_id": str(evidence.id), "filename": req.filename},
    )

    return {
        "id": evidence.id,
        "filename": evidence.filename,
        "storage_path": evidence.storage_path,
        "upload_url": upload_url,
    }


@router.get("/{id}", response_model=EvidenceResponse)
def get_evidence(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    evidence = db.query(Evidence).filter(Evidence.id == id).first()
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Evidence not found"
        )

    # Log chain of custody for access
    log_chain_of_custody(
        db, evidence.id, current_user.id, "ACCESS", {"action": "VIEW_METADATA"}
    )

    # Log audit
    log_audit(
        db, current_user.id, "EVIDENCE_ACCESSED", {"evidence_id": str(evidence.id)}
    )

    return evidence


@router.post("/{id}/analyze", response_model=EvidenceResponse)
def analyze_evidence(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        RoleChecker(["Administrator", "Investigator", "Analyst"])
    ),
):
    evidence = db.query(Evidence).filter(Evidence.id == id).first()
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Evidence not found"
        )

    # Log chain of custody for analysis
    log_chain_of_custody(
        db, evidence.id, current_user.id, "ANALYSIS", {"action": "RUN_ANALYSIS"}
    )

    # Log audit
    log_audit(
        db, current_user.id, "EVIDENCE_ANALYZED", {"evidence_id": str(evidence.id)}
    )

    return evidence


# Mock upload endpoint to handle actual file uploads if called
@router.put("/upload-file/{id}", status_code=status.HTTP_200_OK)
@router.post("/upload-file/{id}", status_code=status.HTTP_200_OK)
async def upload_file_mock(
    id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Administrator", "Investigator"])),
):
    evidence = db.query(Evidence).filter(Evidence.id == id).first()
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Evidence metadata not found"
        )

    # Validate file type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{file.content_type}' is not supported. Allowed types: images, videos, and documents.",
        )

    # Compute SHA-256 hash of the uploaded file
    content = await file.read()
    computed_hash = hashlib.sha256(content).hexdigest()

    # Log chain of custody for actual file upload completion
    log_chain_of_custody(
        db,
        evidence.id,
        current_user.id,
        "UPLOAD_COMPLETE",
        {
            "filename": file.filename,
            "computed_hash": computed_hash,
            "hash_verified": computed_hash == evidence.sha256_hash,
        },
    )

    return {
        "message": "File uploaded successfully",
        "evidence_id": id,
        "computed_hash": computed_hash,
        "hash_verified": computed_hash == evidence.sha256_hash,
    }
