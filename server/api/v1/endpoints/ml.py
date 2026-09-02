from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.ml import MLClassificationRequest, MLClassificationResponse
from server.services.ml_inference import classify_artifact_material

router = APIRouter(prefix="/ml", tags=["ML Material Inference"])


@router.post(
    "/classify-material",
    response_model=MLClassificationResponse,
    status_code=status.HTTP_200_OK,
)
def classify_material(
    request: MLClassificationRequest, db: Session = Depends(get_db)
):
    return classify_artifact_material(db=db, request=request)
