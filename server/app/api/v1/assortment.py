from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.app.database import get_db
from server.app.schemas.assortment import (
    ClusterKPIsResponse,
    SKUListResponse,
    ScenariosResponse,
    SubmitRecommendationRequest,
    SubmitRecommendationResponse,
)
from server.app.services.assortment_service import AssortmentService
from server.app.services.audit_service import AuditService

router = APIRouter(prefix="/assortment", tags=["Assortment Advisor"])


@router.get("/kpis", response_model=ClusterKPIsResponse)
def get_cluster_kpis(
    cluster_id: str = Query("small-town-value", description="Cluster code identifier"),
    db: Session = Depends(get_db),
):
    kpis = AssortmentService.get_cluster_kpis(db, cluster_id=cluster_id)
    if not kpis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cluster '{cluster_id}' not found.",
        )
    return kpis


@router.get("/skus", response_model=SKUListResponse)
def get_cluster_skus(
    cluster_id: str = Query("small-town-value", description="Cluster code identifier"),
    category: Optional[str] = Query(None, description="Category filter e.g. Snacks"),
    db: Session = Depends(get_db),
):
    return AssortmentService.get_cluster_skus(
        db, cluster_id=cluster_id, category=category
    )


@router.get("/scenarios", response_model=ScenariosResponse)
def get_scenarios():
    return AssortmentService.get_scenarios()


@router.post(
    "/submit",
    response_model=SubmitRecommendationResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_recommendation(
    payload: SubmitRecommendationRequest,
    db: Session = Depends(get_db),
):
    try:
        return AuditService.submit_recommendation(db, payload)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
