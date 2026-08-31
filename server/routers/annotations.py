import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Module, ImageLayer, Hotspot
from server.schemas import (
    AnnotationBundleResponse,
    ImageLayerResponse,
    HotspotResponse,
    ImageLayerCreate,
    HotspotCreate,
)

router = APIRouter(prefix="/api/v1/annotations", tags=["Image Annotations & Hotspots"])


@router.get("/module/{module_id}", response_model=AnnotationBundleResponse)
def get_module_annotations(module_id: str, db: Session = Depends(get_db)):
    try:
        uuid.UUID(str(module_id))
    except (ValueError, TypeError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid UUID format for module ID",
        )

    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Module with ID '{module_id}' not found",
        )

    all_hotspots = []
    layers_resp = []

    for layer in module.image_layers:
        layer_hotspots = []
        for h in layer.hotspots:
            h_obj = HotspotResponse(
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
            layer_hotspots.append(h_obj)
            all_hotspots.append(h_obj)

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
                hotspots=layer_hotspots,
            )
        )

    primary_image_url = (
        layers_resp[0].image_url if layers_resp else module.thumbnail_url
    )

    return AnnotationBundleResponse(
        module_id=module.id,
        image_url=primary_image_url,
        layers=layers_resp,
        hotspots=all_hotspots,
    )


@router.post(
    "/layers", response_model=ImageLayerResponse, status_code=status.HTTP_201_CREATED
)
def create_layer(layer_in: ImageLayerCreate, db: Session = Depends(get_db)):
    try:
        uuid.UUID(str(layer_in.module_id))
    except (ValueError, TypeError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid module_id UUID",
        )

    module = db.query(Module).filter(Module.id == layer_in.module_id).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Module with ID '{layer_in.module_id}' not found",
        )

    layer = ImageLayer(
        module_id=layer_in.module_id,
        layer_name=layer_in.layer_name,
        layer_order=layer_in.layer_order,
        image_url=layer_in.image_url,
    )
    db.add(layer)
    db.commit()
    db.refresh(layer)

    return ImageLayerResponse(
        id=layer.id,
        module_id=layer.module_id,
        layer_name=layer.layer_name,
        name=layer.layer_name,
        layer_order=layer.layer_order,
        order=layer.layer_order,
        image_url=layer.image_url,
        layer_url=layer.image_url,
        hotspots=[],
    )


@router.post(
    "/hotspots", response_model=HotspotResponse, status_code=status.HTTP_201_CREATED
)
def create_hotspot(hotspot_in: HotspotCreate, db: Session = Depends(get_db)):
    try:
        uuid.UUID(str(hotspot_in.layer_id))
    except (ValueError, TypeError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid layer_id UUID",
        )

    layer = db.query(ImageLayer).filter(ImageLayer.id == hotspot_in.layer_id).first()
    if not layer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ImageLayer with ID '{hotspot_in.layer_id}' not found",
        )

    hotspot = Hotspot(
        layer_id=hotspot_in.layer_id,
        x_percent=hotspot_in.x_percent,
        y_percent=hotspot_in.y_percent,
        title=hotspot_in.title,
        clinical_notes=hotspot_in.clinical_notes,
        clinical_significance=hotspot_in.clinical_significance,
    )
    db.add(hotspot)
    db.commit()
    db.refresh(hotspot)

    return HotspotResponse(
        id=hotspot.id,
        layer_id=hotspot.layer_id,
        x_percent=hotspot.x_percent,
        y_percent=hotspot.y_percent,
        x_coord=hotspot.x_percent,
        y_coord=hotspot.y_percent,
        title=hotspot.title,
        clinical_notes=hotspot.clinical_notes,
        notes=hotspot.clinical_notes,
        clinical_significance=hotspot.clinical_significance,
    )
