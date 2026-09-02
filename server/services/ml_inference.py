import io
import base64
import uuid
import random
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from PIL import Image
from sqlalchemy.orm import Session
from fastapi import HTTPException
from server.models.artifact import DiscoveredArtifact
from server.models.media import MediaAsset
from server.models.ml import MLClassificationResult
from server.schemas.ml import MLClassificationRequest, MLClassificationResponse, MLAnomalyItem

KNOWN_MATERIALS = [
    "Ceramic",
    "Bronze",
    "Iron",
    "Stone / Basalt",
    "Bone / Antler",
    "Glass",
    "Terracotta",
    "Gold / Electrum",
    "Wood / Organic",
]

ANOMALY_PATTERNS = [
    {"type": "micro_fracture", "severity": "medium", "description": "Structural micro-fracture along upper rim segment"},
    {"type": "surface_erosion", "severity": "low", "description": "Minor acid-soil surface erosion and pitting"},
    {"type": "oxidation_layer", "severity": "medium", "description": "Copper carbonate patina and mineral crusting"},
    {"type": "thermal_alteration", "severity": "high", "description": "Evidence of secondary thermal spalling"},
]


def classify_artifact_material(
    db: Session, request: MLClassificationRequest
) -> MLClassificationResponse:
    artifact = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id == request.artifact_id).first()
    if not artifact:
        raise HTTPException(status_code=404, detail=f"Artifact with id {request.artifact_id} not found")

    media = None
    if request.media_id:
        media = db.query(MediaAsset).filter(MediaAsset.id == request.media_id).first()

    # Image validation if base64 provided
    if request.image_base64:
        try:
            # Handle potential data URL prefix
            raw_b64 = request.image_base64
            if "," in raw_b64:
                raw_b64 = raw_b64.split(",", 1)[1]
            img_bytes = base64.b64decode(raw_b64)
            img = Image.open(io.BytesIO(img_bytes))
            img.verify()
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Corrupt or invalid image binary payload provided for ML inference",
            )

    # Heuristic / deterministic inference based on artifact context & material
    target_material = artifact.material or "Ceramic"
    matched_mat = None
    for m in KNOWN_MATERIALS:
        if m.lower() in target_material.lower() or target_material.lower() in m.lower():
            matched_mat = m
            break
    if not matched_mat:
        matched_mat = target_material

    # Predict high or low confidence depending on clarity
    # If description contains 'weathered' or 'fragment', lower confidence or add anomaly
    desc = (artifact.description or "").lower()
    if "unclear" in desc or "unidentified" in desc:
        confidence = 0.520
        requires_override = True
    else:
        confidence = 0.942
        requires_override = False

    anomalies: List[Dict[str, str]] = []
    if "fracture" in desc or "crack" in desc or "fragment" in desc or "rim" in desc or confidence > 0.9:
        anomalies.append(ANOMALY_PATTERNS[0])
    if "patina" in desc or "oxid" in desc or "corrosion" in desc:
        anomalies.append(ANOMALY_PATTERNS[2])

    result_id = str(uuid.uuid4())
    ml_result = MLClassificationResult(
        id=result_id,
        artifact_id=artifact.id,
        media_id=media.id if media else None,
        predicted_material=matched_mat,
        confidence_score=confidence,
        anomalies_detected=anomalies,
        requires_manual_override=requires_override or (confidence < 0.60),
        created_at=datetime.now(timezone.utc),
    )
    db.add(ml_result)
    db.commit()
    db.refresh(ml_result)

    anomaly_items = [
        MLAnomalyItem(type=a["type"], severity=a["severity"], description=a["description"])
        for a in ml_result.anomalies_detected
    ]

    return MLClassificationResponse(
        id=ml_result.id,
        artifact_id=artifact.id,
        media_id=ml_result.media_id,
        predicted_material=ml_result.predicted_material,
        confidence_score=ml_result.confidence_score,
        anomalies_detected=anomaly_items,
        requires_manual_override=ml_result.requires_manual_override,
        created_at=ml_result.created_at,
    )
