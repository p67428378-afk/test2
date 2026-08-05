from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from decimal import Decimal
from server.database import get_db
from server import models, schemas
from server.core.deps import get_current_user, require_roles, log_audit

router = APIRouter()

MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024  # 50MB limit


@router.get("", response_model=List[schemas.ProposalRead])
def list_proposals(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Proposal)

    if current_user.role == "RESEARCHER":
        # Researchers see only their own proposals
        query = query.filter(models.Proposal.pi_id == current_user.id)
    elif current_user.role == "REVIEWER":
        # Reviewers see non-COI submitted proposals
        query = query.filter(
            models.Proposal.status.in_(
                ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"]
            )
        ).filter(models.Proposal.department != current_user.department)
    # COMMITTEE_MEMBER and GRANT_ADMIN see all proposals

    proposals = query.offset(skip).limit(limit).all()
    log_audit(db, current_user.id, "LIST_PROPOSALS", f"count:{len(proposals)}")
    return proposals


@router.post(
    "", response_model=schemas.ProposalRead, status_code=status.HTTP_201_CREATED
)
def create_proposal(
    proposal_in: schemas.ProposalCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_roles(["RESEARCHER", "GRANT_ADMIN"])),
):
    # Business rule: Max requested budget $150,000
    if proposal_in.requested_budget > Decimal("150000.00"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Requested budget exceeds maximum limit of $150,000",
        )

    dept = proposal_in.department or current_user.department or "General"

    proposal = models.Proposal(
        title=proposal_in.title,
        abstract=proposal_in.abstract,
        pi_id=current_user.id,
        department=dept,
        requested_budget=proposal_in.requested_budget,
        co_investigators=proposal_in.co_investigators,
        timeline=proposal_in.timeline,
        status=proposal_in.status or "DRAFT",
    )
    db.add(proposal)
    db.commit()
    db.refresh(proposal)

    log_audit(db, current_user.id, "CREATE_PROPOSAL", f"proposal_id:{proposal.id}")
    return proposal


@router.get("/{id}", response_model=schemas.ProposalRead)
def get_proposal(
    id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    proposal = db.query(models.Proposal).filter(models.Proposal.id == id).first()
    if not proposal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found"
        )

    # Permission check
    if current_user.role == "RESEARCHER" and proposal.pi_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
        )

    if (
        current_user.role == "REVIEWER"
        and proposal.department == current_user.department
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Conflict of Interest: Reviewer cannot access proposal from own department",
        )

    return proposal


@router.put("/{id}", response_model=schemas.ProposalRead)
def update_proposal(
    id: str,
    proposal_in: schemas.ProposalUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    proposal = db.query(models.Proposal).filter(models.Proposal.id == id).first()
    if not proposal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found"
        )

    if current_user.role == "RESEARCHER" and proposal.pi_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
        )

    if proposal_in.title is not None:
        proposal.title = proposal_in.title
    if proposal_in.abstract is not None:
        proposal.abstract = proposal_in.abstract
    if proposal_in.requested_budget is not None:
        if proposal_in.requested_budget > Decimal("150000.00"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Requested budget exceeds maximum limit of $150,000",
            )
        proposal.requested_budget = proposal_in.requested_budget
    if proposal_in.co_investigators is not None:
        proposal.co_investigators = proposal_in.co_investigators
    if proposal_in.timeline is not None:
        proposal.timeline = proposal_in.timeline
    if proposal_in.department is not None:
        proposal.department = proposal_in.department
    if proposal_in.status is not None:
        proposal.status = proposal_in.status
    if proposal_in.document_url is not None:
        proposal.document_url = proposal_in.document_url

    db.commit()
    db.refresh(proposal)

    log_audit(
        db,
        current_user.id,
        "UPDATE_PROPOSAL",
        f"proposal_id:{proposal.id}, status:{proposal.status}",
    )
    return proposal


@router.post("/{id}/documents", response_model=schemas.ProposalRead)
async def upload_proposal_document(
    id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_roles(["RESEARCHER", "GRANT_ADMIN"])),
):
    proposal = db.query(models.Proposal).filter(models.Proposal.id == id).first()
    if not proposal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found"
        )

    if current_user.role == "RESEARCHER" and proposal.pi_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
        )

    # Read content to check file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum limit of 50MB ({len(contents)} bytes uploaded)",
        )

    # Validate file extension
    filename = file.filename or "document.pdf"
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in ["pdf", "docx", "doc", "txt"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF, DOCX, and DOC files are permitted",
        )

    # Simulate document upload URL
    proposal.document_url = f"/uploads/proposals/{proposal.id}/{filename}"
    db.commit()
    db.refresh(proposal)

    log_audit(
        db,
        current_user.id,
        "UPLOAD_DOCUMENT",
        f"proposal_id:{proposal.id}, file:{filename}",
    )
    return proposal
