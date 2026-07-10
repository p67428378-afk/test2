import secrets
import string
import csv
import io
import base64
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Credential, User
from server.schemas import (
    PasswordGenerateRequest,
    PasswordGenerateResponse,
    VaultImportRequest,
    VaultImportResponse,
    VaultExportResponse,
)
from server.auth import get_current_user

router = APIRouter()


@router.post("/generate-password", response_model=PasswordGenerateResponse)
def generate_password(req: PasswordGenerateRequest):
    chars = ""
    if req.include_lowercase:
        chars += string.ascii_lowercase
    if req.include_uppercase:
        chars += string.ascii_uppercase
    if req.include_numbers:
        chars += string.digits
    if req.include_symbols:
        chars += string.punctuation

    if not chars:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one character type must be selected",
        )

    password = "".join(secrets.choice(chars) for _ in range(req.length))
    return PasswordGenerateResponse(password=password)


@router.post("/vault/import", response_model=VaultImportResponse)
def import_vault(
    req: VaultImportRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        try:
            decoded = base64.b64decode(req.csv_data).decode("utf-8")
            csv_content = decoded
        except Exception:
            csv_content = req.csv_data

        f = io.StringIO(csv_content.strip())
        reader = csv.reader(f)

        header = next(reader, None)
        if not header:
            raise HTTPException(status_code=400, detail="Empty CSV file")

        imported_count = 0
        for row in reader:
            if not row:
                continue
            if len(row) >= 5:
                row_data = {
                    "title": row[0],
                    "url": row[1],
                    "username": row[2],
                    "password": row[3],
                    "notes": row[4] if len(row) > 4 else "",
                }
                encrypted_blob = base64.b64encode(
                    json.dumps(row_data).encode("utf-8")
                ).decode("utf-8")
            elif len(row) == 1:
                encrypted_blob = row[0]
            else:
                continue

            new_cred = Credential(
                user_id=current_user.id, encrypted_data=encrypted_blob
            )
            db.add(new_cred)
            imported_count += 1

        db.commit()
        return VaultImportResponse(
            detail="Vault imported successfully", imported_count=imported_count
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid CSV format: {str(e)}",
        )


@router.get("/vault/export", response_model=VaultExportResponse)
def export_vault(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    credentials = (
        db.query(Credential).filter(Credential.user_id == current_user.id).all()
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["title", "url", "username", "password", "notes"])

    for c in credentials:
        try:
            decoded = base64.b64decode(c.encrypted_data).decode("utf-8")
            data = json.loads(decoded)
            writer.writerow(
                [
                    data.get("title", ""),
                    data.get("url", ""),
                    data.get("username", ""),
                    data.get("password", ""),
                    data.get("notes", ""),
                ]
            )
        except Exception:
            writer.writerow(["Encrypted Entry", "", "", c.encrypted_data, ""])

    return VaultExportResponse(csv_data=output.getvalue())
