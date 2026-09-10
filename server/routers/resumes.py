import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import UserModel
from server.schemas import (
    ResumeCreate,
    ResumeUpdate,
    ResumeResponse,
    ExportPdfRequest,
    TemplateInfo,
)
from server.services.auth_service import get_optional_current_user
from server.services.resume_service import (
    create_resume,
    get_resume,
    list_resumes,
    update_resume,
    delete_resume,
    get_templates,
)
from server.services.pdf_service import generate_resume_pdf

router = APIRouter(prefix="/api/v1", tags=["Resumes"])


@router.get("/templates", response_model=List[TemplateInfo])
def list_available_templates():
    return get_templates()


@router.post(
    "/resumes", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED
)
def create_new_resume(
    resume_in: ResumeCreate,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user),
):
    user_id = str(current_user.id) if current_user else resume_in.user_id
    created = create_resume(db=db, resume_in=resume_in, user_id=user_id)
    return created


@router.get("/resumes", response_model=List[ResumeResponse])
def get_all_resumes(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user),
):
    user_id = str(current_user.id) if current_user else None
    return list_resumes(db=db, skip=skip, limit=limit, user_id=user_id)


@router.get("/resumes/{resume_id}", response_model=ResumeResponse)
def get_single_resume(
    resume_id: str,
    db: Session = Depends(get_db),
):
    resume = get_resume(db=db, resume_id=resume_id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume with id '{resume_id}' not found",
        )
    return resume


@router.put("/resumes/{resume_id}", response_model=ResumeResponse)
def update_existing_resume(
    resume_id: str,
    resume_update: ResumeUpdate,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user),
):
    user_id = str(current_user.id) if current_user else None
    updated = update_resume(
        db=db, resume_id=resume_id, resume_update=resume_update, user_id=user_id
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume with id '{resume_id}' not found or unauthorized",
        )
    return updated


@router.delete("/resumes/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user),
):
    user_id = str(current_user.id) if current_user else None
    deleted = delete_resume(db=db, resume_id=resume_id, user_id=user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume with id '{resume_id}' not found or unauthorized",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/resumes/export-pdf")
def export_resume_pdf(
    payload: ExportPdfRequest,
    db: Session = Depends(get_db),
):
    try:
        data_dict = payload.model_dump()
        pdf_bytes = generate_resume_pdf(data_dict)

        clean_name = payload.user_name.strip() if payload.user_name else "User"
        clean_name = re.sub(r"[^\w\s-]", "", clean_name)
        clean_name = re.sub(r"[\s]+", "_", clean_name) or "User"
        filename = f"{clean_name}_Resume.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition",
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compile PDF CV: {str(e)}",
        )
