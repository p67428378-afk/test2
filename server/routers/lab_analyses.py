import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import LabAnalysis, DiscoveredArtifact
from server.schemas import (
    LabAnalysisCreate,
    LabAnalysisUpdate,
    LabAnalysisResponse,
    LabAnalysisListResponse,
)

router = APIRouter(prefix="/api/v1/lab-analyses", tags=["Laboratory Analysis"])


@router.post("", response_model=LabAnalysisResponse, status_code=status.HTTP_201_CREATED)
def request_lab_analysis(analysis_in: LabAnalysisCreate, db: Session = Depends(get_db)):
    artifact = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id == analysis_in.artifact_id).first()
    if not artifact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Target artifact '{analysis_in.artifact_id}' does not exist"
        )

    new_analysis = LabAnalysis(
        id=str(uuid.uuid4()),
        artifact_id=analysis_in.artifact_id,
        test_type=analysis_in.test_type,
        lab_name=analysis_in.lab_name,
        status=analysis_in.status or "Pending",
        request_date=analysis_in.request_date,
        completion_date=analysis_in.completion_date,
        result_summary=analysis_in.result_summary,
    )
    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)
    return new_analysis


@router.get("", response_model=LabAnalysisListResponse)
def list_lab_analyses(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    artifact_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    test_type: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(LabAnalysis)
    if artifact_id:
        query = query.filter(LabAnalysis.artifact_id == artifact_id)
    if status_filter:
        query = query.filter(LabAnalysis.status == status_filter)
    if test_type:
        query = query.filter(LabAnalysis.test_type.ilike(f"%{test_type}%"))

    total = query.count()
    items = query.order_by(LabAnalysis.created_at.desc()).offset(skip).limit(limit).all()
    return LabAnalysisListResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{analysis_id}", response_model=LabAnalysisResponse)
def get_lab_analysis(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(LabAnalysis).filter(LabAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lab analysis request '{analysis_id}' not found"
        )
    return analysis


@router.patch("/{analysis_id}", response_model=LabAnalysisResponse)
def update_lab_analysis(analysis_id: str, analysis_in: LabAnalysisUpdate, db: Session = Depends(get_db)):
    analysis = db.query(LabAnalysis).filter(LabAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lab analysis request '{analysis_id}' not found"
        )

    update_data = analysis_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(analysis, key, value)

    db.commit()
    db.refresh(analysis)
    return analysis


@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lab_analysis(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(LabAnalysis).filter(LabAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lab analysis request '{analysis_id}' not found"
        )
    db.delete(analysis)
    db.commit()
    return None
