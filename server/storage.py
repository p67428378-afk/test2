import os
import hashlib
import uuid
from typing import Tuple, Optional

STORAGE_DIR = os.getenv("STORAGE_DIR", "/tmp/dems_storage")
os.makedirs(STORAGE_DIR, exist_ok=True)


def calculate_sha256(file_content: bytes) -> str:
    sha = hashlib.sha256()
    sha.update(file_content)
    return sha.hexdigest()


def calculate_file_sha256(file_path: str) -> str:
    sha = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(8192):
            sha.update(chunk)
    return sha.hexdigest()


def generate_presigned_upload_url(
    evidence_code: str, file_name: str
) -> Tuple[str, str]:
    """
    Generates a presigned upload URL and relative storage path.
    In cloud environments this generates a GCS signed URL; locally it returns the direct upload endpoint.
    """
    unique_name = f"{uuid.uuid4().hex[:8]}_{file_name}"
    storage_path = f"evidence/{evidence_code}/{unique_name}"
    # Simulated presigned upload target
    upload_url = f"/api/v1/evidence/upload-stream?path={storage_path}"
    return upload_url, storage_path


def save_evidence_file(storage_path: str, content: bytes) -> Tuple[str, int]:
    full_path = os.path.join(STORAGE_DIR, storage_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "wb") as f:
        f.write(content)
    sha256_hash = calculate_sha256(content)
    return sha256_hash, len(content)


def read_evidence_file(storage_path: str) -> Optional[bytes]:
    full_path = os.path.join(STORAGE_DIR, storage_path)
    if os.path.exists(full_path):
        with open(full_path, "rb") as f:
            return f.read()
    return None
