import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Module
from server.schemas import (
    ModuleResponse,
    ModuleDetailResponse,
    ModuleCreate,
    ImageLayerResponse,
    HotspotResponse,
    AnimationCheckpointResponse,
)

router = APIRouter(prefix="/api/v1/modules", tags=["Learning Modules"])


@router.get("", response_model=List[ModuleResponse])
def list_modules(
    subject: Optional[str] = Query(
        None, description="Filter by medical subject: anatomy, physiology, biochemistry"
    ),
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(20, ge=1, le=100, description="Limit for pagination"),
    db: Session = Depends(get_db),
):
    query = db.query(Module)
    if subject:
        query = query.filter(Module.subject.ilike(subject.strip()))
    modules = query.order_by(Module.created_at.asc()).offset(skip).limit(limit).all()
    return [ModuleResponse.model_validate(m) for m in modules]


@router.get("/{id}", response_model=ModuleDetailResponse)
def get_module(id: str, db: Session = Depends(get_db)):
    # Validate UUID
    try:
        uuid.UUID(str(id))
    except (ValueError, TypeError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid UUID format for module ID",
        )

    module = db.query(Module).filter(Module.id == id).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Module with ID '{id}' not found",
        )

    # Format layers and hotspots with compatibility aliases
    layers_resp = []
    for layer in module.image_layers:
        hotspots_resp = []
        for h in layer.hotspots:
            hotspots_resp.append(
                HotspotResponse(
                    id=h.id,
                    layer_id=h.layer_id,
                    x_percent=h.x_percent,
                    y_percent=h.y_percent,
                    x_coord=h.x_percent,
                    y_coord=h.y_percent,
                    title=h.title,
                    clinical_notes=h.clinical_notes,
                    notes=h.clinical_notes,
                    clinical_significance=h.clinical_significance,
                )
            )
        layers_resp.append(
            ImageLayerResponse(
                id=layer.id,
                module_id=layer.module_id,
                layer_name=layer.layer_name,
                name=layer.layer_name,
                layer_order=layer.layer_order,
                order=layer.layer_order,
                image_url=layer.image_url,
                layer_url=layer.image_url,
                hotspots=hotspots_resp,
            )
        )

    checkpoints_resp = [
        AnimationCheckpointResponse(
            id=cp.id,
            module_id=cp.module_id,
            timestamp_seconds=cp.timestamp_seconds,
            checkpoint_time_seconds=cp.timestamp_seconds,
            question_id=cp.id,
            question_text=cp.question_text,
            options=cp.options,
            correct_option=cp.correct_option,
            correct_option_index=cp.correct_option,
        )
        for cp in module.checkpoints
    ]

    return ModuleDetailResponse(
        id=module.id,
        title=module.title,
        subject=module.subject,
        description=module.description,
        thumbnail_url=module.thumbnail_url,
        animation_url=module.animation_url,
        created_at=module.created_at,
        image_layers=layers_resp,
        checkpoints=checkpoints_resp,
    )


@router.post("", response_model=ModuleResponse, status_code=status.HTTP_201_CREATED)
def create_module(module_in: ModuleCreate, db: Session = Depends(get_db)):
    module = Module(
        title=module_in.title,
        subject=module_in.subject.lower(),
        description=module_in.description,
        thumbnail_url=module_in.thumbnail_url,
        animation_url=module_in.animation_url,
    )
    db.add(module)
    db.commit()
    db.refresh(module)
    return ModuleResponse.model_validate(module)
