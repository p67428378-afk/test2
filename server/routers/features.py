"""Expanded Feature endpoints for v2 studio features."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.crud import (
    create_feature,
    delete_feature,
    get_feature_by_id,
    get_features,
    update_feature,
)
from server.database import get_db
from server.schemas import FeatureCreate, FeatureOut, FeatureUpdate

router = APIRouter(prefix="/api/v1/features", tags=["features"])


@router.get("", response_model=List[FeatureOut])
def list_features(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_features(db, skip=skip, limit=limit)


@router.post("", response_model=FeatureOut, status_code=status.HTTP_201_CREATED)
def add_feature(feat_in: FeatureCreate, db: Session = Depends(get_db)):
    return create_feature(db, feat_in)


@router.get("/{id}", response_model=FeatureOut)
def get_feature(id: str, db: Session = Depends(get_db)):
    feat = get_feature_by_id(db, id)
    if not feat:
        raise HTTPException(status_code=404, detail="Feature resource not found")
    return feat


@router.put("/{id}", response_model=FeatureOut)
def edit_feature(id: str, feat_in: FeatureUpdate, db: Session = Depends(get_db)):
    updated = update_feature(db, id, feat_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Feature resource not found")
    return updated


@router.delete("/{id}")
def remove_feature(id: str, db: Session = Depends(get_db)):
    success = delete_feature(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Feature resource not found")
    return {"detail": "Feature deleted successfully"}
