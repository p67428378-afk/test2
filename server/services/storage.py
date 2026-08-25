import os
import uuid
from fastapi import UploadFile, HTTPException, status

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")


class StorageService:
    def __init__(self):
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)

    def save_resume(self, file: UploadFile) -> str:
        # Validate file type
        if (
            file.content_type != "application/pdf"
            and not file.filename.lower().endswith(".pdf")
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF files are allowed",
            )

        # Validate file size (5MB limit)
        # Read file content to check size
        content = file.file.read()
        if len(content) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds the 5MB limit",
            )

        # Reset file pointer
        file.file.seek(0)

        # Generate unique filename
        file_ext = ".pdf"
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        # Save file locally
        with open(file_path, "wb") as f:
            f.write(content)

        # Return a relative URL or path
        return f"/uploads/{unique_filename}"


storage_service = StorageService()
