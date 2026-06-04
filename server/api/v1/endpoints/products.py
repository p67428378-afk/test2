from fastapi import APIRouter
from typing import List
import uuid
from server.schemas.weather import TextProduct, TextProductCreate

router = APIRouter()

@router.get("/text", response_model=List[TextProduct])
async def get_text_products():
    # Mock data
    return []

@router.post("/text")
async def create_text_product(product: TextProductCreate):
    return {"id": uuid.uuid4(), "status": "created"}
