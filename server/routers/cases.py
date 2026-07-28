from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from server.database import get_db, log_audit, log_chain_of_custody
from server.models import Case, Evidence, User
from server.schemas import (
    CaseCreate,
    CaseResponse,
    CaseListResponse,
    CaseEvidenceResponse,
    AssignEvidenceRequest,
    AssignEvidenceResponse,
)
from server.auth import get_current_user, RoleChecker

router = APIRouter(prefix="/cases", tags=["cases"])


@router.post("", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
def create_case(
    req: CaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Administrator", "Investigator"])),
):
    existing_case = db.query(Case).filter(Case.case_number == req.case_number).first()
    if existing_case:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Case number already exists"
        )

    new_case = Case(case_number=req.case_number, description=req.description)
    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    # Log audit
    log_audit(
        db,
        current_user.id,
        "CASE_CREATED",
        {"case_id": str(new_case.id), "case_number": new_case.case_number},
    )

    return new_case


@router.get("", response_model=List[CaseListResponse])
def list_cases(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    cases = db.query(Case).all()

    result = []
    for case in cases:
        evidence_count = db.query(Evidence).filter(Evidence.case_id == case.id).count()
        result.append(
            {
                "id": case.id,
                "case_number": case.case_number,
                "description": case.description,
                "evidence_count": evidence_count,
                "created_at": case.created_at,
                "updated_at": case.updated_at,
            }
        )

    return result


@router.get("/{id}/evidence", response_model=List[CaseEvidenceResponse])
def get_case_evidence(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    case = db.query(Case).filter(Case.id == id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Case not found"
        )

    evidence_list = db.query(Evidence).filter(Evidence.case_id == id).all()

    result = []
    for ev in evidence_list:
        uploader = db.query(User).filter(User.id == ev.uploaded_by_id).first()
        uploader_name = uploader.username if uploader else "Unknown"
        result.append(
            {
                "id": ev.id,
                "filename": ev.filename,
                "file_type": ev.file_type,
                "file_size": ev.file_size,
                "sha256_hash": ev.sha256_hash,
                "uploaded_by": uploader_name,
                "created_at": ev.created_at,
            }
        )

    return result


@router.post("/{id}/evidence", response_model=AssignEvidenceResponse)
def assign_evidence(
    id: UUID,
    req: AssignEvidenceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Administrator", "Investigator"])),
):
    case = db.query(Case).filter(Case.id == id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Case not found"
        )

    evidence = db.query(Evidence).filter(Evidence.id == req.evidence_id).first()
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Evidence not found"
        )

    old_case_id = evidence.case_id
    evidence.case_id = id
    db.commit()
    db.refresh(evidence)

    # Log chain of custody
    log_chain_of_custody(
        db,
        evidence.id,
        current_user.id,
        "TRANSFER",
        {
            "action": "ASSIGN_TO_CASE",
            "old_case_id": str(old_case_id) if old_case_id else None,
            "new_case_id": str(id),
        },
    )

    # Log audit
    log_audit(
        db,
        current_user.id,
        "EVIDENCE_ASSIGNED_TO_CASE",
        {
            "evidence_id": str(evidence.id),
            "case_id": str(id),
            "case_number": case.case_number,
        },
    )

    return {"id": evidence.id, "filename": evidence.filename, "case_id": id}
