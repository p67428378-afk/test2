from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from server.database import get_db
from server.models import Credential, User
from server.schemas import CredentialCreate, CredentialUpdate, CredentialResponse
from server.auth import get_current_user

router = APIRouter(prefix="/credentials", tags=["Credentials"])


@router.get("", response_model=List[CredentialResponse])
def get_credentials(
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Credential).filter(Credential.user_id == current_user.id)
    if search:
        # Case-insensitive search on title, username, or url
        search_filter = f"%{search}%"
        query = query.filter(
            (Credential.title.ilike(search_filter))
            | (Credential.username.ilike(search_filter))
            | (Credential.url.ilike(search_filter))
        )
    return query.all()


@router.post("", response_model=CredentialResponse, status_code=status.HTTP_201_CREATED)
def create_credential(
    credential_in: CredentialCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_cred = Credential(
        user_id=current_user.id,
        title=credential_in.title,
        username=credential_in.username,
        password=credential_in.password,
        url=credential_in.url,
        notes=credential_in.notes,
    )
    db.add(new_cred)
    db.commit()
    db.refresh(new_cred)
    return new_cred


@router.put("/{credential_id}", response_model=CredentialResponse)
def update_credential(
    credential_id: str,
    credential_in: CredentialUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cred = (
        db.query(Credential)
        .filter(Credential.id == credential_id, Credential.user_id == current_user.id)
        .first()
    )

    if not cred:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Credential not found"
        )

    update_data = credential_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(cred, key, value)

    db.commit()
    db.refresh(cred)
    return cred


@router.delete("/{credential_id}")
def delete_credential(
    credential_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cred = (
        db.query(Credential)
        .filter(Credential.id == credential_id, Credential.user_id == current_user.id)
        .first()
    )

    if not cred:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Credential not found"
        )

    db.delete(cred)
    db.commit()
    return {"success": True}
