import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from server.database import get_db
from server.models import SchemaSubject, SchemaVersion, ValidationLog
from server.schemas import (
    SchemaSubjectResponse,
    SchemaVersionCreate,
    SchemaVersionResponse,
    SchemaVersionListResponse,
    ConfigUpdate,
)
from server.compatibility import is_backward_compatible

router = APIRouter()


@router.get("/schemas", response_model=List[SchemaSubjectResponse])
def get_subjects(db: Session = Depends(get_db)):
    return db.query(SchemaSubject).all()


@router.put("/config/{subject}", response_model=SchemaSubjectResponse)
def update_config(subject: str, config: ConfigUpdate, db: Session = Depends(get_db)):
    if config.compatibility_level not in ["BACKWARD", "NONE"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid compatibility level. Allowed values: BACKWARD, NONE",
        )

    subj = db.query(SchemaSubject).filter(SchemaSubject.name == subject).first()
    if not subj:
        subj = SchemaSubject(
            name=subject, compatibility_level=config.compatibility_level
        )
        db.add(subj)
    else:
        subj.compatibility_level = config.compatibility_level
        subj.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(subj)
    return subj


@router.post("/schemas/{subject}/versions", response_model=SchemaVersionResponse)
def register_version(
    subject: str, payload: SchemaVersionCreate, db: Session = Depends(get_db)
):
    # 1. Parse the incoming schema definition
    try:
        new_schema_dict = json.loads(payload.schema_definition)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid JSON format: {str(e)}",
        )

    # 2. Find or create the subject
    subj = db.query(SchemaSubject).filter(SchemaSubject.name == subject).first()
    if not subj:
        subj = SchemaSubject(name=subject, compatibility_level="BACKWARD")
        db.add(subj)
        db.commit()
        db.refresh(subj)

    # 3. Get the latest version if any
    latest_version = (
        db.query(SchemaVersion)
        .filter(SchemaVersion.subject_id == subj.id)
        .order_by(SchemaVersion.version.desc())
        .first()
    )

    version_num = 1 if not latest_version else latest_version.version + 1
    attempted_ver_str = f"v{version_num}"

    # Determine change type description
    change_type = "Initial registration"
    if latest_version:
        # Compare fields to describe change
        old_fields = {
            f["name"]
            for f in latest_version.schema_definition.get("fields", [])
            if isinstance(f, dict) and "name" in f
        }
        new_fields = {
            f["name"]
            for f in new_schema_dict.get("fields", [])
            if isinstance(f, dict) and "name" in f
        }
        added = new_fields - old_fields
        removed = old_fields - new_fields
        if added and removed:
            change_type = f"Added {', '.join(added)} and removed {', '.join(removed)}"
        elif added:
            change_type = f"Added {', '.join(added)}"
        elif removed:
            change_type = f"Removed {', '.join(removed)}"
        else:
            change_type = "Modified existing fields"

    # 4. Perform compatibility check if compatibility_level is BACKWARD and latest_version exists
    is_compat = True
    err_msg = None
    if subj.compatibility_level == "BACKWARD" and latest_version:
        is_compat, err_msg = is_backward_compatible(
            latest_version.schema_definition, new_schema_dict
        )

    # 5. Log the validation attempt
    log_entry = ValidationLog(
        subject=subject,
        attempted_version=attempted_ver_str,
        change_type=change_type,
        compatibility_level=subj.compatibility_level,
        status="PASSED" if is_compat else "FAILED",
        error_details=err_msg,
    )
    db.add(log_entry)
    db.commit()

    if not is_compat:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Schema compatibility check failed: {err_msg}",
        )

    # 6. Save the new version
    new_version = SchemaVersion(
        subject_id=subj.id, version=version_num, schema_definition=new_schema_dict
    )
    db.add(new_version)
    db.commit()
    db.refresh(new_version)

    return SchemaVersionResponse(
        id=new_version.id,
        subject=subj.name,
        version=new_version.version,
        schema_definition=new_version.schema_definition,
        created_at=new_version.created_at,
    )


@router.get(
    "/schemas/{subject}/versions", response_model=List[SchemaVersionListResponse]
)
def get_versions(subject: str, db: Session = Depends(get_db)):
    subj = db.query(SchemaSubject).filter(SchemaSubject.name == subject).first()
    if not subj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject '{subject}' not found",
        )

    versions = (
        db.query(SchemaVersion)
        .filter(SchemaVersion.subject_id == subj.id)
        .order_by(SchemaVersion.version.asc())
        .all()
    )
    return versions


@router.get(
    "/schemas/{subject}/versions/latest", response_model=SchemaVersionListResponse
)
def get_latest_version(subject: str, db: Session = Depends(get_db)):
    subj = db.query(SchemaSubject).filter(SchemaSubject.name == subject).first()
    if not subj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject '{subject}' not found",
        )

    latest = (
        db.query(SchemaVersion)
        .filter(SchemaVersion.subject_id == subj.id)
        .order_by(SchemaVersion.version.desc())
        .first()
    )

    if not latest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No versions found for subject '{subject}'",
        )
    return latest


@router.get(
    "/schemas/{subject}/versions/{version}", response_model=SchemaVersionListResponse
)
def get_specific_version(subject: str, version: int, db: Session = Depends(get_db)):
    subj = db.query(SchemaSubject).filter(SchemaSubject.name == subject).first()
    if not subj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject '{subject}' not found",
        )

    ver = (
        db.query(SchemaVersion)
        .filter(SchemaVersion.subject_id == subj.id, SchemaVersion.version == version)
        .first()
    )

    if not ver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Version {version} not found for subject '{subject}'",
        )
    return ver
