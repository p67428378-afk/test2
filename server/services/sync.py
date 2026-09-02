import uuid
from typing import List
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from server.models.site import ExcavationSite
from server.models.artifact import DiscoveredArtifact
from server.models.stratigraphy import StratigraphicLayer
from server.models.custody import CustodyTransfer
from server.models.sync import SyncTransaction
from server.schemas.sync import (
    BatchSyncRequest,
    BatchSyncResponse,
    SyncResultItem,
    SyncStatusResponse,
)


def process_batch_sync(db: Session, request: BatchSyncRequest) -> BatchSyncResponse:
    synced = 0
    failed = 0
    results: List[SyncResultItem] = []

    for item in request.transactions:
        tx_id = item.client_tx_id
        ptype = item.payload_type.lower()
        payload = item.payload or {}

        try:
            entity_id = None
            if ptype in ("create_site", "site"):
                site_code = payload.get("site_code") or f"SITE-{uuid.uuid4().hex[:6].upper()}"
                existing = db.query(ExcavationSite).filter(ExcavationSite.site_code == site_code).first()
                if not existing:
                    site = ExcavationSite(
                        id=payload.get("id") or str(uuid.uuid4()),
                        name=payload.get("name", "Synced Excavation Site"),
                        site_code=site_code,
                        region=payload.get("region", "Unknown"),
                        historical_period=payload.get("historical_period", "Unspecified"),
                        latitude=float(payload.get("latitude", 0.0)),
                        longitude=float(payload.get("longitude", 0.0)),
                        altitude_meters=float(payload.get("altitude_meters", 0.0)) if payload.get("altitude_meters") is not None else None,
                        description=payload.get("description"),
                        created_at=datetime.now(timezone.utc),
                        updated_at=datetime.now(timezone.utc),
                    )
                    db.add(site)
                    db.flush()
                    entity_id = site.id
                else:
                    entity_id = existing.id

            elif ptype in ("create_artifact", "artifact"):
                art_code = payload.get("artifact_code") or f"ART-{uuid.uuid4().hex[:6].upper()}"
                site_id = payload.get("site_id")
                if not site_id:
                    # Fallback to first available site
                    first_site = db.query(ExcavationSite).first()
                    site_id = first_site.id if first_site else str(uuid.uuid4())

                existing = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.artifact_code == art_code).first()
                if not existing:
                    art = DiscoveredArtifact(
                        id=payload.get("id") or str(uuid.uuid4()),
                        site_id=site_id,
                        artifact_code=art_code,
                        material=payload.get("material", "Unclassified"),
                        context_layer=payload.get("context_layer"),
                        depth_meters=float(payload.get("depth_meters")) if payload.get("depth_meters") is not None else None,
                        excavation_date=payload.get("excavation_date"),
                        finder_member_id=payload.get("finder_member_id"),
                        description=payload.get("description"),
                        x_offset_meters=float(payload.get("x_offset_meters")) if payload.get("x_offset_meters") is not None else None,
                        y_offset_meters=float(payload.get("y_offset_meters")) if payload.get("y_offset_meters") is not None else None,
                        z_depth_meters=float(payload.get("z_depth_meters")) if payload.get("z_depth_meters") is not None else None,
                        qr_code_identifier=payload.get("qr_code_identifier"),
                        created_at=datetime.now(timezone.utc),
                        updated_at=datetime.now(timezone.utc),
                    )
                    db.add(art)
                    db.flush()
                    entity_id = art.id
                else:
                    entity_id = existing.id

            elif ptype in ("update_artifact",):
                art_code = payload.get("artifact_code")
                art_id = payload.get("id")
                art = None
                if art_id:
                    art = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id == art_id).first()
                elif art_code:
                    art = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.artifact_code == art_code).first()

                if art:
                    for k in ("material", "context_layer", "depth_meters", "x_offset_meters", "y_offset_meters", "z_depth_meters", "description"):
                        if k in payload:
                            setattr(art, k, payload[k])
                    art.updated_at = datetime.now(timezone.utc)
                    db.flush()
                    entity_id = art.id

            elif ptype in ("create_layer", "stratigraphic_layer"):
                layer = StratigraphicLayer(
                    id=payload.get("id") or str(uuid.uuid4()),
                    site_id=payload.get("site_id"),
                    layer_code=payload.get("layer_code", "Stratum X"),
                    historical_period=payload.get("historical_period", "Ancient"),
                    depth_top_meters=float(payload.get("depth_top_meters", 0.0)),
                    depth_bottom_meters=float(payload.get("depth_bottom_meters", 1.0)),
                    color_hex=payload.get("color_hex", "#8B4513"),
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc),
                )
                db.add(layer)
                db.flush()
                entity_id = layer.id

            # Record sync transaction
            stx = SyncTransaction(
                id=str(uuid.uuid4()),
                client_tx_id=tx_id,
                payload_type=ptype,
                payload=payload,
                status="SYNCED",
                client_timestamp=item.client_timestamp or datetime.now(timezone.utc),
                server_timestamp=datetime.now(timezone.utc),
                created_at=datetime.now(timezone.utc),
            )
            db.add(stx)
            db.commit()

            synced += 1
            results.append(
                SyncResultItem(
                    client_tx_id=tx_id,
                    status="SYNCED",
                    entity_id=entity_id,
                    detail=f"Successfully processed {ptype}",
                )
            )

        except Exception as e:
            db.rollback()
            failed += 1
            results.append(
                SyncResultItem(
                    client_tx_id=tx_id,
                    status="FAILED",
                    detail=str(e),
                )
            )

    return BatchSyncResponse(
        total_received=len(request.transactions),
        synced_count=synced,
        failed_count=failed,
        results=results,
    )


def get_sync_status(db: Session) -> SyncStatusResponse:
    total_tx = db.query(SyncTransaction).count()
    return SyncStatusResponse(
        server_time=datetime.now(timezone.utc),
        server_version="v2.0.0",
        status="online",
        total_synced_transactions=total_tx,
    )
