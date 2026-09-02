from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.services.custody import generate_qr_payload

router = APIRouter(prefix="/qr", tags=["QR / Barcode"])


@router.get("/generate/{entity_type}/{id}")
def get_qr_code(entity_type: str, id: str, db: Session = Depends(get_db)):
    return generate_qr_payload(db=db, entity_type=entity_type, entity_id=id)
