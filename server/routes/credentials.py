import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server.database import get_db
from server.models import Credential, User
from server.schemas import CredentialCreate, CredentialUpdate, CredentialResponse
from server.auth import get_current_user

router = APIRouter()


@router.get("", response_model=List[CredentialResponse])
def list_credentials(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    credentials = (
        db.query(Credential)
        .filter(Credential.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [
        CredentialResponse(
            id=str(c.id),
            encrypted_data=c.encrypted_data,
            created_at=c.created_at,
            updated_at=c.updated_at,
        )
        for c in credentials
    ]


@router.post("", response_model=CredentialResponse, status_code=status.HTTP_201_CREATED)
def create_credential(
    cred_in: CredentialCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_cred = Credential(
        user_id=current_user.id, encrypted_data=cred_in.encrypted_data
    )
    db.add(new_cred)
    db.commit()
    db.refresh(new_cred)

    return CredentialResponse(
        id=str(new_cred.id),
        encrypted_data=new_cred.encrypted_data,
        created_at=new_cred.created_at,
        updated_at=new_cred.updated_at,
    )


@router.put("/{credential_id}", response_model=CredentialResponse)
def update_credential(
    credential_id: str,
    cred_in: CredentialUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        cred_uuid = uuid.UUID(credential_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Credential not found"
        )

    credential = (
        db.query(Credential)
        .filter(Credential.id == cred_uuid, Credential.user_id == current_user.id)
        .first()
    )

    if not credential:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Credential not found"
        )

    credential.encrypted_data = cred_in.encrypted_data
    db.commit()
    db.refresh(credential)

    return CredentialResponse(
        id=str(credential.id),
        encrypted_data=credential.encrypted_data,
        created_at=credential.created_at,
        updated_at=credential.updated_at,
    )


@router.delete("/{credential_id}")
def delete_credential(
    credential_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        cred_uuid = uuid.UUID(credential_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Credential not found"
        )

    credential = (
        db.query(Credential)
        .filter(Credential.id == cred_uuid, Credential.user_id == current_user.id)
        .first()
    )

    if not credential:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Credential not found"
        )

    db.delete(credential)
    db.commit()
    return {"detail": "Credential deleted successfully"}


@router.get("/search", response_model=List[CredentialResponse])
def search_credentials(
    q: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    credentials = (
        db.query(Credential).filter(Credential.user_id == current_user.id).all()
    )

    return [
        CredentialResponse(
            id=str(c.id),
            encrypted_data=c.encrypted_data,
            created_at=c.created_at,
            updated_at=c.updated_at,
        )
        for c in credentials
    ]
