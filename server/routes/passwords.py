import string
import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from server.database import get_db
from server.models import User, PasswordEntry
from server.schemas import (
    PasswordEntryCreate,
    PasswordEntryUpdate,
    PasswordEntryResponse,
    PasswordGenerateRequest,
    PasswordGenerateResponse,
)
from server.security import verify_access_token, encrypt_data, decrypt_data

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid JWT token",
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid JWT token",
        )
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    return user


@router.get("", response_model=List[PasswordEntryResponse])
def get_passwords(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    entries = (
        db.query(PasswordEntry).filter(PasswordEntry.user_id == current_user.id).all()
    )

    decrypted_entries = []
    for entry in entries:
        decrypted_entries.append(
            PasswordEntryResponse(
                id=UUID(entry.id),
                title=decrypt_data(entry.title, current_user.master_password_hash),
                url=decrypt_data(entry.url, current_user.master_password_hash)
                if entry.url
                else None,
                username=decrypt_data(
                    entry.username, current_user.master_password_hash
                ),
                password=decrypt_data(
                    entry.password, current_user.master_password_hash
                ),
                created_at=entry.created_at,
                updated_at=entry.updated_at,
            )
        )
    return decrypted_entries


@router.post(
    "", response_model=PasswordEntryResponse, status_code=status.HTTP_201_CREATED
)
def create_password(
    request: PasswordEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    key = current_user.master_password_hash
    encrypted_title = encrypt_data(request.title, key)
    encrypted_url = encrypt_data(request.url, key) if request.url else None
    encrypted_username = encrypt_data(request.username, key)
    encrypted_password = encrypt_data(request.password, key)

    new_entry = PasswordEntry(
        user_id=current_user.id,
        title=encrypted_title,
        url=encrypted_url,
        username=encrypted_username,
        password=encrypted_password,
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return PasswordEntryResponse(
        id=UUID(new_entry.id),
        title=request.title,
        url=request.url,
        username=request.username,
        password=request.password,
        created_at=new_entry.created_at,
        updated_at=new_entry.updated_at,
    )


@router.put("/{id}", response_model=PasswordEntryResponse)
def update_password(
    id: UUID,
    request: PasswordEntryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = (
        db.query(PasswordEntry)
        .filter(PasswordEntry.id == str(id), PasswordEntry.user_id == current_user.id)
        .first()
    )
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Password entry not found"
        )

    key = current_user.master_password_hash

    ret_title = decrypt_data(entry.title, key)
    ret_url = decrypt_data(entry.url, key) if entry.url else None
    ret_username = decrypt_data(entry.username, key)
    ret_password = decrypt_data(entry.password, key)

    if request.title is not None:
        entry.title = encrypt_data(request.title, key)
        ret_title = request.title
    if request.url is not None:
        entry.url = encrypt_data(request.url, key)
        ret_url = request.url
    if request.username is not None:
        entry.username = encrypt_data(request.username, key)
        ret_username = request.username
    if request.password is not None:
        entry.password = encrypt_data(request.password, key)
        ret_password = request.password

    db.commit()
    db.refresh(entry)

    return PasswordEntryResponse(
        id=UUID(entry.id),
        title=ret_title,
        url=ret_url,
        username=ret_username,
        password=ret_password,
        created_at=entry.created_at,
        updated_at=entry.updated_at,
    )


@router.delete("/{id}")
def delete_password(
    id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = (
        db.query(PasswordEntry)
        .filter(PasswordEntry.id == str(id), PasswordEntry.user_id == current_user.id)
        .first()
    )
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Password entry not found"
        )
    db.delete(entry)
    db.commit()
    return {"detail": "Password entry deleted successfully"}


@router.post("/generate", response_model=PasswordGenerateResponse)
def generate_password(request: PasswordGenerateRequest):
    chars = ""
    if request.include_lowercase:
        chars += string.ascii_lowercase
    if request.include_uppercase:
        chars += string.ascii_uppercase
    if request.include_numbers:
        chars += string.digits
    if request.include_symbols:
        chars += string.punctuation

    if not chars:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one character type must be selected",
        )

    password = "".join(secrets.choice(chars) for _ in range(request.length))
    return {"password": password}
