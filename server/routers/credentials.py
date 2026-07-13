from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server.database import get_db
from server.models import Credential, User
from server.schemas import CredentialCreate, CredentialUpdate, CredentialResponse
from server.routers.auth import get_current_user, active_deks
from server.security import encrypt_data, decrypt_data

router = APIRouter(prefix="/api/v1/credentials", tags=["credentials"])


@router.get("", response_model=List[CredentialResponse])
def get_credentials(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    db_credentials = (
        db.query(Credential).filter(Credential.user_id == current_user.id).all()
    )
    dek = active_deks.get(current_user.id)

    results = []
    for cred in db_credentials:
        try:
            title = decrypt_data(
                cred.title_encrypted[12:], cred.title_encrypted[:12], dek
            )
            username = decrypt_data(
                cred.username_encrypted[12:], cred.username_encrypted[:12], dek
            )
            password = decrypt_data(
                cred.password_encrypted[12:], cred.password_encrypted[:12], dek
            )
            url = (
                decrypt_data(cred.url_encrypted[12:], cred.url_encrypted[:12], dek)
                if cred.url_encrypted
                else None
            )

            results.append(
                CredentialResponse(
                    id=cred.id,
                    title=title,
                    username=username,
                    password=password,
                    url=url,
                    updated_at=cred.updated_at,
                )
            )
        except Exception:
            continue

    return results


@router.post("", response_model=CredentialResponse, status_code=status.HTTP_201_CREATED)
def create_credential(
    cred_in: CredentialCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    dek = active_deks.get(current_user.id)

    # Encrypt fields with unique IVs
    title_enc, iv = encrypt_data(cred_in.title, dek)
    username_enc, username_iv = encrypt_data(cred_in.username, dek)
    password_enc, password_iv = encrypt_data(cred_in.password, dek)
    url_enc = None
    url_iv = None
    if cred_in.url:
        url_enc, url_iv = encrypt_data(cred_in.url, dek)

    title_stored = iv + title_enc
    username_stored = username_iv + username_enc
    password_stored = password_iv + password_enc
    url_stored = (url_iv + url_enc) if url_enc else None

    new_cred = Credential(
        user_id=current_user.id,
        title_encrypted=title_stored,
        username_encrypted=username_stored,
        password_encrypted=password_stored,
        url_encrypted=url_stored,
        iv=iv,
    )
    db.add(new_cred)
    db.commit()
    db.refresh(new_cred)

    return CredentialResponse(
        id=new_cred.id,
        title=cred_in.title,
        username=cred_in.username,
        password=cred_in.password,
        url=cred_in.url,
        updated_at=new_cred.updated_at,
    )


@router.put("/{credential_id}", response_model=CredentialResponse)
def update_credential(
    credential_id: str,
    cred_in: CredentialUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cred = (
        db.query(Credential)
        .filter(Credential.id == credential_id, Credential.user_id == current_user.id)
        .first()
    )

    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")

    dek = active_deks.get(current_user.id)

    # Decrypt existing values (extracting prepended IVs)
    curr_title = decrypt_data(cred.title_encrypted[12:], cred.title_encrypted[:12], dek)
    curr_username = decrypt_data(
        cred.username_encrypted[12:], cred.username_encrypted[:12], dek
    )
    curr_password = decrypt_data(
        cred.password_encrypted[12:], cred.password_encrypted[:12], dek
    )
    curr_url = (
        decrypt_data(cred.url_encrypted[12:], cred.url_encrypted[:12], dek)
        if cred.url_encrypted
        else None
    )

    new_title = cred_in.title if cred_in.title is not None else curr_title
    new_username = cred_in.username if cred_in.username is not None else curr_username
    new_password = cred_in.password if cred_in.password is not None else curr_password
    new_url = cred_in.url if cred_in.url is not None else curr_url

    # Re-encrypt with new IVs
    title_enc, iv = encrypt_data(new_title, dek)
    username_enc, username_iv = encrypt_data(new_username, dek)
    password_enc, password_iv = encrypt_data(new_password, dek)
    url_enc = None
    url_iv = None
    if new_url:
        url_enc, url_iv = encrypt_data(new_url, dek)

    cred.title_encrypted = iv + title_enc
    cred.username_encrypted = username_iv + username_enc
    cred.password_encrypted = password_iv + password_enc
    cred.url_encrypted = (url_iv + url_enc) if url_enc else None
    cred.iv = iv

    db.commit()
    db.refresh(cred)

    return CredentialResponse(
        id=cred.id,
        title=new_title,
        username=new_username,
        password=new_password,
        url=new_url,
        updated_at=cred.updated_at,
    )


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
        raise HTTPException(status_code=404, detail="Credential not found")

    db.delete(cred)
    db.commit()
    return {"success": True, "message": "Credential deleted successfully"}
