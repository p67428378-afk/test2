import os
import uuid


class GCSService:
    def __init__(self):
        self.bucket_name = os.getenv("GCS_BUCKET_NAME", "sdlc-designer-assets")

    def upload_file(self, file_content: bytes, filename: str) -> str:
        # In a real GCP environment, we would use google-cloud-storage.
        # For local development, testing, and sandbox environments, we simulate the upload
        # and return a deterministic or mock URL.
        unique_id = uuid.uuid4()
        # Return a simulated GCS URL
        return f"https://storage.googleapis.com/{self.bucket_name}/claims/{unique_id}_{filename}"


gcs_service = GCSService()
