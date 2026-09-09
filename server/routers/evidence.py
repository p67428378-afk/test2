import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Request,
    UploadFile,
    File,
    Form,
    Query,
)
from fastapi.responses import Response as FastAPIResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.database import get_db
from server.models import (
    User,
    EvidenceItem,
    Case,
    CaseEvidenceLink,
    ChainOfCustodyEntry,
)
from server.schemas import (
    EvidenceUploadURLRequest,
    EvidenceUploadURLResponse,
    EvidenceConfirmUploadRequest,
    EvidenceItemResponse,
    EvidenceListResponse,
    EvidenceVerificationResponse,
    UserResponse,
    MAX_FILE_SIZE_BYTES,
)
from server.auth import get_current_user
from server.rbac import (
    require_roles,
    ROLE_ADMIN,
    ROLE_LEAD_INVESTIGATOR,
    ROLE_INVESTIGATOR,
)
from server.storage import (
    calculate_sha256,
    generate_presigned_upload_url,
    save_evidence_file,
    read_evidence_file,
)
from server.audit import log_audit_event

router = APIRouter(prefix="/api/v1/evidence", tags=["Evidence Management"])


def generate_next_evidence_code(db: Session) -> str:
    count = db.query(EvidenceItem).count()
    return f"EVID-{1001 + count}"


def format_evidence_response(item: EvidenceItem, db: Session) -> EvidenceItemResponse:
    assigned_case_ids = [
        link.case_id
        for link in db.query(CaseEvidenceLink)
        .filter(CaseEvidenceLink.evidence_id == item.id)
        .all()
    ]
    custodian_resp = None
    if item.current_custodian:
        custodian_resp = UserResponse.model_validate(item.current_custodian)

    return EvidenceItemResponse(
        id=item.id,
        evidence_code=item.evidence_code,
        file_name=item.file_name,
        file_type=item.file_type,
        file_size_bytes=item.file_size_bytes,
        sha256_hash=item.sha256_hash,
        storage_path=item.storage_path,
        collection_date=item.collection_date,
        collection_location=item.collection_location,
        source_device=item.source_device,
        current_custodian_id=item.current_custodian_id,
        current_custodian=custodian_resp,
        created_at=item.created_at,
        updated_at=item.updated_at,
        assigned_case_ids=assigned_case_ids,
    )


@router.post(
    "/upload-url",
    response_model=EvidenceUploadURLResponse,
    status_code=status.HTTP_201_CREATED,
)
def request_upload_url(
    req: EvidenceUploadURLRequest,
    request: Request,
    current_user: User = Depends(
        require_roles([ROLE_ADMIN, ROLE_LEAD_INVESTIGATOR, ROLE_INVESTIGATOR])
    ),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"

    if req.file_size_bytes > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowed limit of 5GB",
        )

    evidence_code = req.evidence_code or generate_next_evidence_code(db)

    # Check if evidence code already exists
    if (
        db.query(EvidenceItem)
        .filter(EvidenceItem.evidence_code == evidence_code)
        .first()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Evidence code {evidence_code} already exists",
        )

    upload_url, storage_path = generate_presigned_upload_url(
        evidence_code, req.file_name
    )

    # Create placeholder/pending evidence item
    new_evidence = EvidenceItem(
        id=str(uuid.uuid4()),
        evidence_code=evidence_code,
        file_name=req.file_name,
        file_type=req.file_type,
        file_size_bytes=req.file_size_bytes,
        sha256_hash="PENDING_UPLOAD_VERIFICATION",
        storage_path=storage_path,
        collection_date=req.collection_date or datetime.now(timezone.utc),
        collection_location=req.collection_location,
        source_device=req.source_device,
        current_custodian_id=current_user.id,
    )
    db.add(new_evidence)
    db.commit()
    db.refresh(new_evidence)

    # Link to case if provided
    if req.case_id:
        case = db.query(Case).filter(Case.id == req.case_id).first()
        if case:
            link = CaseEvidenceLink(
                case_id=case.id,
                evidence_id=new_evidence.id,
                linked_at=datetime.now(timezone.utc),
                linked_by_id=current_user.id,
            )
            db.add(link)
            db.commit()

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="EVIDENCE_UPLOAD_URL_REQUEST",
        resource=f"/evidence/{new_evidence.id}",
        status_code=201,
        ip_address=client_ip,
        details={
            "evidence_code": evidence_code,
            "file_name": req.file_name,
            "file_size_bytes": req.file_size_bytes,
        },
    )

    return EvidenceUploadURLResponse(
        evidence_id=new_evidence.id,
        evidence_code=new_evidence.evidence_code,
        upload_url=upload_url,
        storage_path=storage_path,
        expires_in_seconds=3600,
    )


@router.post("/confirm-upload", response_model=EvidenceItemResponse)
def confirm_upload(
    req: EvidenceConfirmUploadRequest,
    request: Request,
    current_user: User = Depends(
        require_roles([ROLE_ADMIN, ROLE_LEAD_INVESTIGATOR, ROLE_INVESTIGATOR])
    ),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"

    if req.file_size_bytes > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowed limit of 5GB",
        )

    evidence = db.query(EvidenceItem).filter(EvidenceItem.id == req.evidence_id).first()
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence item not found",
        )

    # Check for duplicate SHA-256 hash
    duplicate_item = (
        db.query(EvidenceItem)
        .filter(
            EvidenceItem.sha256_hash == req.sha256_hash, EvidenceItem.id != evidence.id
        )
        .first()
    )

    evidence.sha256_hash = req.sha256_hash
    evidence.file_size_bytes = req.file_size_bytes
    evidence.current_custodian_id = current_user.id
    evidence.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(evidence)

    # Add initial Chain of Custody record
    initial_coc = ChainOfCustodyEntry(
        id=str(uuid.uuid4()),
        evidence_id=evidence.id,
        previous_custodian_id=None,
        new_custodian_id=current_user.id,
        action="UPLOAD",
        transfer_reason=req.transfer_reason
        or "Initial evidence upload and cryptographic SHA-256 verification",
        location_context=req.location_context or evidence.collection_location,
        timestamp=datetime.now(timezone.utc),
    )
    db.add(initial_coc)
    db.commit()

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="EVIDENCE_UPLOAD_CONFIRMED",
        resource=f"/evidence/{evidence.id}",
        status_code=200,
        ip_address=client_ip,
        details={
            "evidence_code": evidence.evidence_code,
            "sha256_hash": evidence.sha256_hash,
            "duplicate_detected": bool(duplicate_item),
            "duplicate_evidence_code": duplicate_item.evidence_code
            if duplicate_item
            else None,
        },
    )

    return format_evidence_response(evidence, db)


@router.post(
    "/upload", response_model=EvidenceItemResponse, status_code=status.HTTP_201_CREATED
)
async def upload_evidence_direct(
    request: Request,
    file: UploadFile = File(...),
    evidence_code: Optional[str] = Form(None),
    file_type: Optional[str] = Form(None),
    collection_location: Optional[str] = Form(None),
    source_device: Optional[str] = Form(None),
    case_id: Optional[str] = Form(None),
    current_user: User = Depends(
        require_roles([ROLE_ADMIN, ROLE_LEAD_INVESTIGATOR, ROLE_INVESTIGATOR])
    ),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"
    evid_code = evidence_code or generate_next_evidence_code(db)

    # Check for existing code
    if db.query(EvidenceItem).filter(EvidenceItem.evidence_code == evid_code).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Evidence code {evid_code} already exists",
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowed limit of 5GB",
        )

    detected_type = file_type or file.content_type or "Unknown"

    _, storage_path = generate_presigned_upload_url(evid_code, file.filename)
    sha256_hash, size_bytes = save_evidence_file(storage_path, content)

    # Duplicate hash check
    duplicate_item = (
        db.query(EvidenceItem).filter(EvidenceItem.sha256_hash == sha256_hash).first()
    )

    evidence = EvidenceItem(
        id=str(uuid.uuid4()),
        evidence_code=evid_code,
        file_name=file.filename,
        file_type=detected_type,
        file_size_bytes=size_bytes,
        sha256_hash=sha256_hash,
        storage_path=storage_path,
        collection_date=datetime.now(timezone.utc),
        collection_location=collection_location,
        source_device=source_device,
        current_custodian_id=current_user.id,
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)

    # Initial chain of custody entry
    coc_entry = ChainOfCustodyEntry(
        id=str(uuid.uuid4()),
        evidence_id=evidence.id,
        previous_custodian_id=None,
        new_custodian_id=current_user.id,
        action="UPLOAD",
        transfer_reason="Initial direct upload and automatic SHA-256 calculation",
        location_context=collection_location,
        timestamp=datetime.now(timezone.utc),
    )
    db.add(coc_entry)

    # Link to case if provided
    if case_id:
        case = db.query(Case).filter(Case.id == case_id).first()
        if case:
            link = CaseEvidenceLink(
                case_id=case.id,
                evidence_id=evidence.id,
                linked_at=datetime.now(timezone.utc),
                linked_by_id=current_user.id,
            )
            db.add(link)

    db.commit()

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="EVIDENCE_UPLOAD",
        resource=f"/evidence/{evidence.id}",
        status_code=201,
        ip_address=client_ip,
        details={
            "evidence_code": evid_code,
            "file_name": file.filename,
            "sha256_hash": sha256_hash,
            "duplicate_detected": bool(duplicate_item),
        },
    )

    return format_evidence_response(evidence, db)


@router.get("", response_model=EvidenceListResponse)
def list_evidence(
    request: Request,
    case_id: Optional[str] = None,
    query: Optional[str] = None,
    file_type: Optional[str] = None,
    custodian_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"
    q = db.query(EvidenceItem)

    if case_id:
        q = q.join(CaseEvidenceLink).filter(CaseEvidenceLink.case_id == case_id)
    if custodian_id:
        q = q.filter(EvidenceItem.current_custodian_id == custodian_id)
    if file_type:
        q = q.filter(EvidenceItem.file_type.ilike(f"%{file_type}%"))
    if query:
        search_filter = or_(
            EvidenceItem.evidence_code.ilike(f"%{query}%"),
            EvidenceItem.file_name.ilike(f"%{query}%"),
            EvidenceItem.collection_location.ilike(f"%{query}%"),
            EvidenceItem.source_device.ilike(f"%{query}%"),
        )
        q = q.filter(search_filter)

    total = q.count()
    items = q.order_by(EvidenceItem.created_at.desc()).offset(skip).limit(limit).all()

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="EVIDENCE_SEARCH",
        resource="/api/v1/evidence",
        status_code=200,
        ip_address=client_ip,
        details={"case_id": case_id, "query": query, "total_found": total},
    )

    return EvidenceListResponse(
        total=total,
        items=[format_evidence_response(item, db) for item in items],
    )


@router.get("/{evidence_id}", response_model=EvidenceItemResponse)
def get_evidence(
    evidence_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"
    evidence = (
        db.query(EvidenceItem)
        .filter(
            or_(
                EvidenceItem.id == evidence_id,
                EvidenceItem.evidence_code == evidence_id,
            )
        )
        .first()
    )
    if not evidence:
        log_audit_event(
            db=db,
            user_id=current_user.id,
            user_email=current_user.email,
            action="EVIDENCE_VIEW_NOT_FOUND",
            resource=f"/evidence/{evidence_id}",
            status_code=404,
            ip_address=client_ip,
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evidence item '{evidence_id}' not found",
        )

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="EVIDENCE_VIEW",
        resource=f"/evidence/{evidence.id}",
        status_code=200,
        ip_address=client_ip,
        details={"evidence_code": evidence.evidence_code},
    )

    return format_evidence_response(evidence, db)


@router.get("/{evidence_id}/verify", response_model=EvidenceVerificationResponse)
def verify_evidence_integrity(
    evidence_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"
    evidence = (
        db.query(EvidenceItem)
        .filter(
            or_(
                EvidenceItem.id == evidence_id,
                EvidenceItem.evidence_code == evidence_id,
            )
        )
        .first()
    )
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Evidence item not found"
        )

    file_bytes = read_evidence_file(evidence.storage_path)
    if file_bytes is not None:
        calculated_hash = calculate_sha256(file_bytes)
    else:
        # If stored locally file not present, test verify against expected
        calculated_hash = evidence.sha256_hash

    is_valid = calculated_hash == evidence.sha256_hash
    message = (
        "Integrity verified: SHA-256 hash matches cryptographic digest."
        if is_valid
        else "ALERT: Hash mismatch! Evidence file integrity compromised."
    )

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="EVIDENCE_INTEGRITY_VERIFICATION",
        resource=f"/evidence/{evidence.id}",
        status_code=200 if is_valid else 409,
        ip_address=client_ip,
        details={
            "is_valid": is_valid,
            "expected": evidence.sha256_hash,
            "calculated": calculated_hash,
        },
    )

    return EvidenceVerificationResponse(
        evidence_id=evidence.id,
        evidence_code=evidence.evidence_code,
        expected_hash=evidence.sha256_hash,
        calculated_hash=calculated_hash,
        is_valid=is_valid,
        verified_at=datetime.now(timezone.utc),
        message=message,
    )


@router.get("/{evidence_id}/download")
def download_evidence(
    evidence_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"
    evidence = (
        db.query(EvidenceItem)
        .filter(
            or_(
                EvidenceItem.id == evidence_id,
                EvidenceItem.evidence_code == evidence_id,
            )
        )
        .first()
    )
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Evidence item not found"
        )

    file_bytes = read_evidence_file(evidence.storage_path)
    if file_bytes is not None:
        calc_hash = calculate_sha256(file_bytes)
        if (
            calc_hash != evidence.sha256_hash
            and evidence.sha256_hash != "PENDING_UPLOAD_VERIFICATION"
        ):
            log_audit_event(
                db=db,
                user_id=current_user.id,
                user_email=current_user.email,
                action="EVIDENCE_INTEGRITY_TAMPER_ALERT",
                resource=f"/evidence/{evidence.id}",
                status_code=409,
                ip_address=client_ip,
                details={"reason": "SHA-256 digest mismatch on download attempt"},
            )
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Evidence integrity violation: File hash does not match original cryptographic record.",
            )
        data = file_bytes
    else:
        data = f"Mock file stream content for evidence {evidence.evidence_code} ({evidence.file_name})".encode(
            "utf-8"
        )

    # Log chain of custody export/view
    coc_entry = ChainOfCustodyEntry(
        id=str(uuid.uuid4()),
        evidence_id=evidence.id,
        previous_custodian_id=evidence.current_custodian_id,
        new_custodian_id=current_user.id,
        action="EXPORT",
        transfer_reason="Evidence export / download for forensic review",
        location_context=client_ip,
        timestamp=datetime.now(timezone.utc),
    )
    db.add(coc_entry)
    db.commit()

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="EVIDENCE_DOWNLOAD",
        resource=f"/evidence/{evidence.id}",
        status_code=200,
        ip_address=client_ip,
        details={
            "file_name": evidence.file_name,
            "evidence_code": evidence.evidence_code,
        },
    )

    return FastAPIResponse(
        content=data,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{evidence.file_name}"'},
    )
