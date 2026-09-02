import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.artifact import DiscoveredArtifact
from server.models.lab import LabAnalysis
from server.schemas.lab import LabAnalysisCreate, LabAnalysisUpdate, LabAnalysisResponse

router = APIRouter(prefix="/lab-analyses", tags=["Lab Analyses"])


@router.get("", response_model=List[LabAnalysisResponse])
def get_lab_analyses(
    artifact_id: Optional[str] = None,
    test_type: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1),
    db: Session = Depends(get_db),
):
    query = db.query(LabAnalysis)
    if artifact_id:
        query = query.filter(LabAnalysis.artifact_id == artifact_id)
    if test_type:
        query = query.filter(LabAnalysis.test_type.ilike(f"%{test_type}%"))
    if status:
        query = query.filter(LabAnalysis.status == status)
    return query.offset(skip).limit(limit).all()


@router.post("", response_model=LabAnalysisResponse, status_code=status.HTTP_201_CREATED)
def create_lab_analysis(analysis_in: LabAnalysisCreate, db: Session = Depends(get_db)):
    artifact = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id == analysis_in.artifact_id).first()
    if not artifact:
        raise HTTPException(status_code=404, detail=f"Artifact with id {analysis_in.artifact_id} not found")

    new_analysis = LabAnalysis(
        id=str(uuid.uuid4()),
        artifact_id=analysis_in.artifact_id,
        test_type=analysis_in.test_type,
        lab_name=analysis_in.lab_name,
        status=analysis_in.status or "Pending",
        results=analysis_in.results,
        notes=analysis_in.notes,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)
    return new_analysis


@router.get("/{analysis_id}", response_model=LabAnalysisResponse)
def get_lab_analysis(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(LabAnalysis).filter(LabAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail=f"Lab analysis with id {analysis_id} not found")
    return analysis


@router.patch("/{analysis_id}", response_model=LabAnalysisResponse)
def update_lab_analysis(analysis_id: str, analysis_in: LabAnalysisUpdate, db: Session = Depends(get_db)):
    analysis = db.query(LabAnalysis).filter(LabAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail=f"Lab analysis with id {analysis_id} not found")

    update_data = analysis_in.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(analysis, k, v)

    analysis.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(analysis)
    return analysis


@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lab_analysis(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(LabAnalysis).filter(LabAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail=f"Lab analysis with id {analysis_id} not found")
    db.delete(analysis)
    db.commit()
    return None
