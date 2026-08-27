from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas import ProjectRead, ProjectDetail
from server.app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=List[ProjectRead], status_code=status.HTTP_200_OK)
def list_projects(
    tag: Optional[str] = Query(None, description="Filter projects by tech stack tag"),
    skip: int = Query(0, ge=0, description="Pagination skip offset"),
    limit: int = Query(20, ge=1, le=100, description="Pagination page limit"),
    db: Session = Depends(get_db),
):
    """
    List showcased projects with optional tech stack tag filtering and pagination.
    """
    return ProjectService.get_projects(db=db, tag=tag, skip=skip, limit=limit)


@router.get("/{id}", response_model=ProjectDetail, status_code=status.HTTP_200_OK)
def get_project_detail(id: str, db: Session = Depends(get_db)):
    """
    Retrieve comprehensive details for a specific showcased project by UUID.
    """
    project = ProjectService.get_project_by_id(db=db, project_id=id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID {id} not found",
        )
    return project
