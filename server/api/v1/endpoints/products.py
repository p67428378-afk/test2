
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.weather import TextProduct, TextProductCreate
from server.models.weather import TextProduct as TextProductModel
from server.services.auth import get_current_active_user
from server.schemas.user import User

router = APIRouter()

@router.get("/products/text", response_model=list[TextProduct])
def get_text_products(db: Session = Depends(get_db)):
    return db.query(TextProductModel).all()

@router.post("/products/text", response_model=TextProduct)
def create_text_product(product: TextProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_product = TextProductModel(**product.dict(), user_id=current_user.id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
