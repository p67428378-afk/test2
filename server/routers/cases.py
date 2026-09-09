import uuid
from datetime import datetime, timezone
from typing import Optional, List, Any, Union
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query, Body
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.database import get_db
from server.models import (
    User,
    Case,
    EvidenceItem,
    CaseEvidenceLink,
    ChainOfCustodyEntry,
)
from server.schemas import (
    CaseCreateRequest,
    CaseUpdateRequest,
    CaseResponse,
    CaseDetailResponse,
    CaseListResponse,
    AssignEvidenceRequest,
    CaseStatsSummaryResponse,
    UserResponse,
)
from server.routers.evidence import format_evidence_response
from server.auth import get_current_user
from server.rbac import (
    require_roles,
    ROLE_ADMIN,
    ROLE_LEAD_INVESTIGATOR,
    ROLE_INVESTIGATOR,
)
from server.audit import log_audit_event

router = APIRouter(prefix="/api/v1/cases", tags=["Case Management"])


def format_case_response(case: Case, db: Session) -> CaseResponse:
    lead_user = None
    if case.lead_investigator:
        lead_user = UserResponse.model_validate(case.lead_investigator)
    evidence_count = (
        db.query(CaseEvidenceLink).filter(CaseEvidenceLink.case_id == case.id).count()
    )

    return CaseResponse(
        id=case.id,
        case_number=case.case_number,
        title=case.title,
        description=case.description,
        lead_investigator_id=case.lead_investigator_id,
        lead_investigator=lead_user,
        status=case.status,
        evidence_count=evidence_count,
        created_at=case.created_at,
        updated_at=case.updated_at,
    )


@router.get("/stats/summary", response_model=CaseStatsSummaryResponse)
def get_case_statistics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total_cases = db.query(Case).count()
    active_cases = db.query(Case).filter(Case.status == "Active").count()
    total_evidence_items = db.query(EvidenceItem).count()

    # Evidence items not linked to any case
    linked_evidence_subquery = (
        db.query(CaseEvidenceLink.evidence_id).distinct().subquery()
    )
    unassigned_artifacts = (
        db.query(EvidenceItem)
        .filter(EvidenceItem.id.notin_(linked_evidence_subquery))
        .count()
    )

    # Count pending transfers (actions of type TRANSFER in last 7 days or sample count)
    pending_transfers = (
        db.query(ChainOfCustodyEntry)
        .filter(ChainOfCustodyEntry.action == "TRANSFER")
        .count()
    )

    return CaseStatsSummaryResponse(
        active_cases=active_cases,
        total_cases=total_cases,
        total_evidence_items=total_evidence_items,
        pending_transfers=pending_transfers,
        unassigned_artifacts=unassigned_artifacts,
    )


@router.post("", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
def create_case(
    case_in: CaseCreateRequest,
    request: Request,
    current_user: User = Depends(
        require_roles([ROLE_ADMIN, ROLE_LEAD_INVESTIGATOR, ROLE_INVESTIGATOR])
    ),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"

    existing_case = (
        db.query(Case).filter(Case.case_number == case_in.case_number).first()
    )
    if existing_case:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Case number '{case_in.case_number}' already exists",
        )

    lead_id = case_in.lead_investigator_id or current_user.id

    new_case = Case(
        id=str(uuid.uuid4()),
        case_number=case_in.case_number,
        title=case_in.title,
        description=case_in.description,
        lead_investigator_id=lead_id,
        status=case_in.status,
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="CASE_CREATE",
        resource=f"/cases/{new_case.id}",
        status_code=201,
        ip_address=client_ip,
        details={"case_number": new_case.case_number, "title": new_case.title},
    )

    return format_case_response(new_case, db)


@router.get("", response_model=CaseListResponse)
def list_cases(
    request: Request,
    query: Optional[str] = None,
    status_filter: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"
    q = db.query(Case)

    if status_filter:
        q = q.filter(Case.status == status_filter)
    if query:
        q = q.filter(
            or_(
                Case.case_number.ilike(f"%{query}%"),
                Case.title.ilike(f"%{query}%"),
                Case.description.ilike(f"%{query}%"),
            )
        )

    total = q.count()
    cases = q.order_by(Case.created_at.desc()).offset(skip).limit(limit).all()
    case_items = [format_case_response(c, db) for c in cases]

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="CASE_SEARCH",
        resource="/api/v1/cases",
        status_code=200,
        ip_address=client_ip,
        details={"query": query, "status": status_filter, "count": total},
    )

    return CaseListResponse(
        total=total,
        items=case_items,
        cases=case_items,
    )


@router.get("/{case_id}", response_model=CaseDetailResponse)
def get_case(
    case_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"

    case = (
        db.query(Case)
        .filter(or_(Case.id == case_id, Case.case_number == case_id))
        .first()
    )
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case '{case_id}' not found",
        )

    # Get linked evidence items
    evidence_links = (
        db.query(CaseEvidenceLink).filter(CaseEvidenceLink.case_id == case.id).all()
    )
    evidence_items = []
    for link in evidence_links:
        if link.evidence_item:
            evidence_items.append(format_evidence_response(link.evidence_item, db))

    base_resp = format_case_response(case, db)

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="CASE_VIEW",
        resource=f"/cases/{case.id}",
        status_code=200,
        ip_address=client_ip,
        details={
            "case_number": case.case_number,
            "linked_evidence_count": len(evidence_items),
        },
    )

    return CaseDetailResponse(
        **base_resp.model_dump(),
        evidence_items=evidence_items,
        evidence_ids=[e.id for e in evidence_items],
        assigned_evidence=[e.evidence_code for e in evidence_items],
    )


@router.put("/{case_id}", response_model=CaseResponse)
def update_case(
    case_id: str,
    case_in: CaseUpdateRequest,
    request: Request,
    current_user: User = Depends(
        require_roles([ROLE_ADMIN, ROLE_LEAD_INVESTIGATOR, ROLE_INVESTIGATOR])
    ),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"

    case = (
        db.query(Case)
        .filter(or_(Case.id == case_id, Case.case_number == case_id))
        .first()
    )
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case '{case_id}' not found",
        )

    if case_in.title is not None:
        case.title = case_in.title
    if case_in.description is not None:
        case.description = case_in.description
    if case_in.status is not None:
        case.status = case_in.status
    if case_in.lead_investigator_id is not None:
        case.lead_investigator_id = case_in.lead_investigator_id

    case.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(case)

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="CASE_UPDATE",
        resource=f"/cases/{case.id}",
        status_code=200,
        ip_address=client_ip,
        details={
            "case_number": case.case_number,
            "updates": case_in.model_dump(exclude_unset=True),
        },
    )

    return format_case_response(case, db)


@router.post("/{case_id}/evidence", response_model=CaseDetailResponse)
def assign_evidence_to_case(
    case_id: str,
    request: Request,
    assign_req: Optional[Any] = Body(None),
    current_user: User = Depends(
        require_roles([ROLE_ADMIN, ROLE_LEAD_INVESTIGATOR, ROLE_INVESTIGATOR])
    ),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"

    case = (
        db.query(Case)
        .filter(or_(Case.id == case_id, Case.case_number == case_id))
        .first()
    )
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case '{case_id}' not found",
        )

    # Extract evidence IDs from assign_req whether it is AssignEvidenceRequest, dict, list, or str
    extracted_ids = []
    if isinstance(assign_req, AssignEvidenceRequest):
        extracted_ids = assign_req.get_extracted_evidence_ids()
    elif isinstance(assign_req, dict):
        parsed = AssignEvidenceRequest(**assign_req)
        extracted_ids = parsed.get_extracted_evidence_ids()
    elif isinstance(assign_req, list):
        for item in assign_req:
            if isinstance(item, str):
                extracted_ids.append(item)
            elif isinstance(item, dict):
                for key in ["evidence_id", "id", "evidence_code", "code"]:
                    if key in item and item[key]:
                        extracted_ids.append(str(item[key]))
                        break
    elif isinstance(assign_req, str):
        extracted_ids.append(assign_req)

    assigned_codes = []
    for evid_identifier in extracted_ids:
        evidence = (
            db.query(EvidenceItem)
            .filter(
                or_(
                    EvidenceItem.id == evid_identifier,
                    EvidenceItem.evidence_code == evid_identifier,
                    EvidenceItem.file_name == evid_identifier,
                )
            )
            .first()
        )
        if not evidence:
            continue

        # Check if already linked
        existing_link = (
            db.query(CaseEvidenceLink)
            .filter(
                CaseEvidenceLink.case_id == case.id,
                CaseEvidenceLink.evidence_id == evidence.id,
            )
            .first()
        )
        if not existing_link:
            link = CaseEvidenceLink(
                case_id=case.id,
                evidence_id=evidence.id,
                linked_at=datetime.now(timezone.utc),
                linked_by_id=current_user.id,
            )
            db.add(link)
            assigned_codes.append(evidence.evidence_code)

    db.commit()

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="CASE_EVIDENCE_LINK",
        resource=f"/cases/{case.id}",
        status_code=200,
        ip_address=client_ip,
        details={"case_number": case.case_number, "assigned_evidence": assigned_codes},
    )

    return get_case(case.id, request, current_user, db)


@router.delete("/{case_id}/evidence/{evidence_id}", response_model=CaseDetailResponse)
def unassign_evidence_from_case(
    case_id: str,
    evidence_id: str,
    request: Request,
    current_user: User = Depends(
        require_roles([ROLE_ADMIN, ROLE_LEAD_INVESTIGATOR, ROLE_INVESTIGATOR])
    ),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"

    case = (
        db.query(Case)
        .filter(or_(Case.id == case_id, Case.case_number == case_id))
        .first()
    )
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case '{case_id}' not found",
        )

    evidence = (
        db.query(EvidenceItem)
        .filter(
            or_(
                EvidenceItem.id == evidence_id,
                EvidenceItem.evidence_code == evidence_id,
                EvidenceItem.file_name == evidence_id,
            )
        )
        .first()
    )
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evidence item '{evidence_id}' not found",
        )

    link = (
        db.query(CaseEvidenceLink)
        .filter(
            CaseEvidenceLink.case_id == case.id,
            CaseEvidenceLink.evidence_id == evidence.id,
        )
        .first()
    )
    if link:
        db.delete(link)
        db.commit()

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="CASE_EVIDENCE_UNLINK",
        resource=f"/cases/{case.id}",
        status_code=200,
        ip_address=client_ip,
        details={
            "case_number": case.case_number,
            "unassigned_evidence": evidence.evidence_code,
        },
    )

    return get_case(case.id, request, current_user, db)
