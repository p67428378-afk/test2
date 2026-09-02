import io
import base64
import uuid
import qrcode
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException
from server.models.artifact import DiscoveredArtifact
from server.models.custody import StorageContainer, CustodyTransfer
from server.models.team import TeamMember
from server.schemas.custody import (
    StorageContainerCreate,
    StorageContainerResponse,
    CustodyTransferCreate,
    CustodyTransferResponse,
)


def create_storage_container(db: Session, container_in: StorageContainerCreate) -> StorageContainerResponse:
    existing = db.query(StorageContainer).filter(StorageContainer.container_code == container_in.container_code).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Storage container with code '{container_in.container_code}' already exists",
        )

    container = StorageContainer(
        id=str(uuid.uuid4()),
        container_code=container_in.container_code,
        room_name=container_in.room_name,
        rack_number=container_in.rack_number,
        bin_number=container_in.bin_number,
        description=container_in.description,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(container)
    db.commit()
    db.refresh(container)
    return StorageContainerResponse.model_validate(container)


def list_storage_containers(db: Session, skip: int = 0, limit: int = 50) -> List[StorageContainerResponse]:
    containers = db.query(StorageContainer).offset(skip).limit(limit).all()
    return [StorageContainerResponse.model_validate(c) for c in containers]


def transfer_custody(db: Session, transfer_in: CustodyTransferCreate) -> CustodyTransferResponse:
    artifact = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id == transfer_in.artifact_id).first()
    if not artifact:
        raise HTTPException(status_code=404, detail=f"Artifact with id {transfer_in.artifact_id} not found")

    container = None
    if transfer_in.container_id:
        container = db.query(StorageContainer).filter(StorageContainer.id == transfer_in.container_id).first()
        if not container:
            raise HTTPException(status_code=404, detail=f"Container with id {transfer_in.container_id} not found")

    receiver = db.query(TeamMember).filter(TeamMember.id == transfer_in.receiving_custodian_id).first()
    if not receiver:
        raise HTTPException(
            status_code=404,
            detail=f"Receiving custodian member with id {transfer_in.receiving_custodian_id} not found",
        )

    releaser = None
    if transfer_in.releasing_custodian_id:
        releaser = db.query(TeamMember).filter(TeamMember.id == transfer_in.releasing_custodian_id).first()

    transfer = CustodyTransfer(
        id=str(uuid.uuid4()),
        artifact_id=transfer_in.artifact_id,
        container_id=transfer_in.container_id,
        releasing_custodian_id=transfer_in.releasing_custodian_id,
        receiving_custodian_id=transfer_in.receiving_custodian_id,
        transfer_timestamp=datetime.now(timezone.utc),
        notes=transfer_in.notes,
        created_at=datetime.now(timezone.utc),
    )
    db.add(transfer)
    db.commit()
    db.refresh(transfer)

    return CustodyTransferResponse(
        id=transfer.id,
        artifact_id=artifact.id,
        artifact_code=artifact.artifact_code,
        container_id=container.id if container else None,
        container_code=container.container_code if container else None,
        room_name=container.room_name if container else None,
        rack_number=container.rack_number if container else None,
        bin_number=container.bin_number if container else None,
        releasing_custodian_id=releaser.id if releaser else None,
        releasing_custodian_name=releaser.full_name if releaser else None,
        receiving_custodian_id=receiver.id,
        receiving_custodian_name=receiver.full_name,
        transfer_timestamp=transfer.transfer_timestamp,
        notes=transfer.notes,
        created_at=transfer.created_at,
    )


def get_custody_history(db: Session, artifact_id: str) -> List[CustodyTransferResponse]:
    artifact = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.id == artifact_id).first()
    if not artifact:
        raise HTTPException(status_code=404, detail=f"Artifact with id {artifact_id} not found")

    transfers = (
        db.query(CustodyTransfer)
        .filter(CustodyTransfer.artifact_id == artifact_id)
        .order_by(CustodyTransfer.transfer_timestamp.desc())
        .all()
    )

    results = []
    for t in transfers:
        results.append(
            CustodyTransferResponse(
                id=t.id,
                artifact_id=artifact.id,
                artifact_code=artifact.artifact_code,
                container_id=t.container_id,
                container_code=t.container.container_code if t.container else None,
                room_name=t.container.room_name if t.container else None,
                rack_number=t.container.rack_number if t.container else None,
                bin_number=t.container.bin_number if t.container else None,
                releasing_custodian_id=t.releasing_custodian_id,
                releasing_custodian_name=t.releasing_custodian.full_name if t.releasing_custodian else None,
                receiving_custodian_id=t.receiving_custodian_id,
                receiving_custodian_name=t.receiving_custodian.full_name if t.receiving_custodian else None,
                transfer_timestamp=t.transfer_timestamp,
                notes=t.notes,
                created_at=t.created_at,
            )
        )
    return results


def generate_qr_payload(db: Session, entity_type: str, entity_id: str) -> Dict[str, Any]:
    qr_data = ""
    label = ""
    if entity_type.lower() == "artifact":
        artifact = db.query(DiscoveredArtifact).filter(
            (DiscoveredArtifact.id == entity_id) | (DiscoveredArtifact.artifact_code == entity_id)
        ).first()
        if not artifact:
            raise HTTPException(status_code=404, detail=f"Artifact '{entity_id}' not found")
        qr_data = f"ARCHEXCAV:ARTIFACT:{artifact.id}:{artifact.artifact_code}"
        label = artifact.artifact_code
    elif entity_type.lower() in ("container", "storage_container"):
        container = db.query(StorageContainer).filter(
            (StorageContainer.id == entity_id) | (StorageContainer.container_code == entity_id)
        ).first()
        if not container:
            raise HTTPException(status_code=404, detail=f"Storage container '{entity_id}' not found")
        qr_data = f"ARCHEXCAV:CONTAINER:{container.id}:{container.container_code}"
        label = container.container_code
    else:
        qr_data = f"ARCHEXCAV:{entity_type.upper()}:{entity_id}"
        label = f"{entity_type}-{entity_id}"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b64_img = base64.b64encode(buf.getvalue()).decode("utf-8")

    return {
        "entity_type": entity_type,
        "entity_id": entity_id,
        "label": label,
        "qr_data": qr_data,
        "mime_type": "image/png",
        "base64_image": f"data:image/png;base64,{b64_img}",
    }
