import uuid
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException
from server.models.site import ExcavationSite
from server.models.artifact import DiscoveredArtifact
from server.models.stratigraphy import StratigraphicLayer
from server.schemas.stratigraphy import (
    StratigraphicLayerCreate,
    StratigraphicLayerResponse,
    SpatialArtifactNode,
    TrenchBounds,
    TrenchStratigraphyResponse,
)


def get_trench_stratigraphy(db: Session, site_id: str) -> TrenchStratigraphyResponse:
    site = db.query(ExcavationSite).filter(ExcavationSite.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail=f"Excavation site with id {site_id} not found")

    layers = (
        db.query(StratigraphicLayer)
        .filter(StratigraphicLayer.site_id == site_id)
        .order_by(StratigraphicLayer.depth_top_meters.asc())
        .all()
    )

    artifacts = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.site_id == site_id).all()

    spatial_nodes: List[SpatialArtifactNode] = []
    layer_map = {l.layer_code.lower(): l for l in layers}

    x_vals = [-2.0, 2.0]
    y_vals = [-2.0, 2.0]
    depth_vals = [0.0]

    for idx, art in enumerate(artifacts):
        is_interpolated = False
        x = art.x_offset_meters
        y = art.y_offset_meters
        z = art.z_depth_meters

        if x is None:
            # Deterministic spread for visualization
            x = round(((idx % 5) - 2) * 0.8, 3)
            is_interpolated = True

        if y is None:
            y = round((((idx // 5) % 5) - 2) * 0.8, 3)
            is_interpolated = True

        if z is None or z == 0.0:
            is_interpolated = True
            if art.depth_meters is not None and art.depth_meters > 0:
                z = -abs(art.depth_meters)
            elif art.context_layer and art.context_layer.lower() in layer_map:
                matched_layer = layer_map[art.context_layer.lower()]
                mid_depth = (matched_layer.depth_top_meters + matched_layer.depth_bottom_meters) / 2.0
                z = -abs(mid_depth)
            elif layers:
                z = -abs(layers[0].depth_bottom_meters / 2.0)
            else:
                z = -1.0

        x_vals.append(x)
        y_vals.append(y)
        depth_vals.append(abs(z))

        spatial_nodes.append(
            SpatialArtifactNode(
                id=art.id,
                artifact_code=art.artifact_code,
                material=art.material,
                x_offset_meters=x,
                y_offset_meters=y,
                z_depth_meters=z,
                context_layer=art.context_layer,
                interpolated_depth=is_interpolated,
            )
        )

    for l in layers:
        depth_vals.append(l.depth_bottom_meters)

    bounds = TrenchBounds(
        min_x=min(x_vals) - 1.0,
        max_x=max(x_vals) + 1.0,
        min_y=min(y_vals) - 1.0,
        max_y=max(y_vals) + 1.0,
        min_depth=0.0,
        max_depth=max(depth_vals) + 0.5,
    )

    layer_responses = [StratigraphicLayerResponse.model_validate(l) for l in layers]

    return TrenchStratigraphyResponse(
        site_id=site.id,
        site_name=site.name,
        bounds=bounds,
        layers=layer_responses,
        artifacts=spatial_nodes,
    )


def create_stratigraphic_layer(
    db: Session, site_id: str, layer_in: StratigraphicLayerCreate
) -> StratigraphicLayerResponse:
    site = db.query(ExcavationSite).filter(ExcavationSite.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail=f"Excavation site with id {site_id} not found")

    if layer_in.depth_top_meters >= layer_in.depth_bottom_meters:
        raise HTTPException(
            status_code=400,
            detail="Layer top depth must be strictly less than bottom depth",
        )

    new_layer = StratigraphicLayer(
        id=str(uuid.uuid4()),
        site_id=site_id,
        layer_code=layer_in.layer_code,
        historical_period=layer_in.historical_period,
        depth_top_meters=layer_in.depth_top_meters,
        depth_bottom_meters=layer_in.depth_bottom_meters,
        color_hex=layer_in.color_hex or "#8B4513",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_layer)
    db.commit()
    db.refresh(new_layer)
    return StratigraphicLayerResponse.model_validate(new_layer)
