from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import case, func, or_
from sqlalchemy.orm import Session, joinedload

from server.app.services.ai_classifier import (
    VALID_CATEGORIES,
    classify_email_async,
)
from server.app.services.email_parser import (
    ALLOWED_EXTENSIONS,
    create_excerpt,
    parse_uploaded_file,
)
from server.database import get_db
from server.models import Classification, Email
from server.schemas import (
    CategoryOverrideRequest,
    ClassificationResponse,
    EmailListResponse,
    EmailResponse,
)

router = APIRouter(prefix="/emails", tags=["Emails"])


def _to_email_response(email_obj: Email) -> EmailResponse:
    cls = email_obj.classification
    if cls:
        primary_cat = (
            cls.user_override_category
            if (cls.is_overridden and cls.user_override_category)
            else cls.ai_category
        )
        cls_resp = ClassificationResponse(
            id=cls.id,
            email_id=cls.email_id,
            primary_category=primary_cat,
            ai_category=cls.ai_category,
            confidence_score=cls.confidence_score,
            user_override_category=cls.user_override_category,
            is_overridden=cls.is_overridden,
            created_at=cls.created_at,
            updated_at=cls.updated_at,
        )
    else:
        cls_resp = ClassificationResponse(
            primary_category="Work",
            confidence_score=0.0,
            is_overridden=False,
        )

    return EmailResponse(
        id=email_obj.id,
        sender=email_obj.sender,
        subject=email_obj.subject,
        body_text=email_obj.body_text,
        excerpt=create_excerpt(email_obj.body_text),
        source_type=email_obj.source_type,
        file_name=email_obj.file_name,
        classification=cls_resp,
        created_at=email_obj.created_at,
        updated_at=email_obj.updated_at,
    )


@router.post(
    "/classify",
    response_model=EmailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Classify raw text or uploaded email file",
)
async def classify_email_endpoint(
    request: Request,
    db: Session = Depends(get_db),
):
    content_type = request.headers.get("content-type", "")
    sender = None
    subject = None
    body_text = None
    source_type = "TEXT_ENTRY"
    file_name = None

    if "application/json" in content_type:
        try:
            body_data = await request.json()
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid JSON payload.")

        raw_text = body_data.get("text")
        if not raw_text or not str(raw_text).strip():
            raise HTTPException(
                status_code=422,
                detail="Email text is required for classification.",
            )
        body_text = str(raw_text).strip()
        subject = body_data.get("subject")
        sender = body_data.get("sender")
        source_type = "TEXT_ENTRY"

    elif "multipart/form-data" in content_type:
        form = await request.form()
        uploaded_file = form.get("file")
        form_text = form.get("text")
        form_subject = form.get("subject")
        form_sender = form.get("sender")

        if (
            uploaded_file
            and hasattr(uploaded_file, "filename")
            and uploaded_file.filename
        ):
            file_name = uploaded_file.filename
            ext = "." + file_name.split(".")[-1].lower() if "." in file_name else ""
            if ext not in ALLOWED_EXTENSIONS:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unsupported file format '{file_name}'. Please upload .eml, .txt, or .pdf",
                )

            try:
                content_bytes = await uploaded_file.read()
                extracted_sender, extracted_subject, extracted_body = (
                    parse_uploaded_file(file_name, content_bytes)
                )
            except ValueError as ve:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve)
                )
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Failed to parse uploaded file: {e!s}",
                )

            source_type = "FILE_UPLOAD"
            sender = form_sender or extracted_sender
            subject = form_subject or extracted_subject
            body_text = extracted_body
        elif form_text and str(form_text).strip():
            source_type = "TEXT_ENTRY"
            body_text = str(form_text).strip()
            subject = form_subject
            sender = form_sender
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Either 'text' or 'file' must be provided.",
            )
    else:
        # Try reading as json fallback
        try:
            body_data = await request.json()
            raw_text = body_data.get("text")
            if not raw_text or not str(raw_text).strip():
                raise HTTPException(
                    status_code=422, detail="Email text is required for classification."
                )
            body_text = str(raw_text).strip()
            subject = body_data.get("subject")
            sender = body_data.get("sender")
            source_type = "TEXT_ENTRY"
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported Content-Type. Use 'application/json' or 'multipart/form-data'.",
            )

    if not body_text or not body_text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Email content is empty.",
        )

    # Run AI Categorization with timeout protection
    try:
        best_cat, confidence, _ = await classify_email_async(
            subject=subject, body_text=body_text
        )
    except TimeoutError:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="AI categorization service timed out. Please retry.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI categorization failed: {e!s}",
        )

    now = datetime.now(timezone.utc)
    email_record = Email(
        sender=sender,
        subject=subject,
        body_text=body_text,
        source_type=source_type,
        file_name=file_name,
        created_at=now,
        updated_at=now,
    )
    db.add(email_record)
    db.flush()

    classification_record = Classification(
        email_id=email_record.id,
        ai_category=best_cat,
        confidence_score=confidence,
        user_override_category=None,
        is_overridden=False,
        created_at=now,
        updated_at=now,
    )
    db.add(classification_record)

    try:
        db.commit()
        db.refresh(email_record)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database commit failed: {e!s}",
        )

    return _to_email_response(email_record)


@router.get(
    "",
    response_model=EmailListResponse,
    summary="Get all classified emails with filtering and pagination",
)
def get_emails(
    category: str | None = Query(
        None, description="Filter by category (Work, Personal, Urgent, Promotional)"
    ),
    min_confidence: float | None = Query(
        None, ge=0.0, le=100.0, description="Minimum confidence score"
    ),
    search: str | None = Query(
        None, description="Search keyword in subject, sender, or body"
    ),
    start_date: datetime | None = Query(None, description="Filter from creation date"),
    end_date: datetime | None = Query(None, description="Filter to creation date"),
    skip: int = Query(0, ge=0, description="Pagination skip offset"),
    limit: int = Query(20, ge=1, le=100, description="Pagination limit"),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Email)
        .join(Classification, Email.id == Classification.email_id)
        .options(joinedload(Email.classification))
    )

    if category:
        effective_cat = case(
            (
                (Classification.is_overridden.is_(True))
                & (Classification.user_override_category.isnot(None)),
                Classification.user_override_category,
            ),
            else_=Classification.ai_category,
        )
        query = query.filter(func.lower(effective_cat) == category.strip().lower())

    if min_confidence is not None:
        query = query.filter(Classification.confidence_score >= min_confidence)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Email.subject.ilike(search_term),
                Email.body_text.ilike(search_term),
                Email.sender.ilike(search_term),
            )
        )

    if start_date:
        query = query.filter(Email.created_at >= start_date)

    if end_date:
        query = query.filter(Email.created_at <= end_date)

    total = query.count()
    items = query.order_by(Email.created_at.desc()).offset(skip).limit(limit).all()

    return EmailListResponse(
        total=total,
        skip=skip,
        limit=limit,
        items=[_to_email_response(item) for item in items],
    )


@router.get(
    "/{email_id}",
    response_model=EmailResponse,
    summary="Get single email classification details",
)
def get_email_detail(
    email_id: str,
    db: Session = Depends(get_db),
):
    email_obj = (
        db.query(Email)
        .options(joinedload(Email.classification))
        .filter(Email.id == email_id)
        .first()
    )
    if not email_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Email with ID '{email_id}' not found.",
        )
    return _to_email_response(email_obj)


@router.patch(
    "/{email_id}",
    response_model=EmailResponse,
    summary="Override AI classification for an email",
)
def override_classification(
    email_id: str,
    payload: CategoryOverrideRequest,
    db: Session = Depends(get_db),
):
    target_category = payload.category.strip()
    valid_normalized = {c.lower(): c for c in VALID_CATEGORIES}
    if target_category.lower() not in valid_normalized:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category '{target_category}'. Allowed values: {', '.join(VALID_CATEGORIES)}",
        )
    canonical_category = valid_normalized[target_category.lower()]

    email_obj = (
        db.query(Email)
        .options(joinedload(Email.classification))
        .filter(Email.id == email_id)
        .first()
    )
    if not email_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Email with ID '{email_id}' not found.",
        )

    now = datetime.now(timezone.utc)
    cls = email_obj.classification
    if not cls:
        cls = Classification(
            email_id=email_obj.id,
            ai_category=canonical_category,
            confidence_score=100.0,
            user_override_category=canonical_category,
            is_overridden=True,
            created_at=now,
            updated_at=now,
        )
        db.add(cls)
    else:
        cls.user_override_category = canonical_category
        cls.is_overridden = True
        cls.updated_at = now

    email_obj.updated_at = now

    try:
        db.commit()
        db.refresh(email_obj)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update category: {e!s}",
        )

    return _to_email_response(email_obj)


@router.delete(
    "/{email_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an email and its classification",
)
def delete_email(
    email_id: str,
    db: Session = Depends(get_db),
):
    email_obj = db.query(Email).filter(Email.id == email_id).first()
    if not email_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Email with ID '{email_id}' not found.",
        )

    db.delete(email_obj)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete email: {e!s}",
        )
