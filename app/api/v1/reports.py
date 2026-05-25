
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import item as item_model
from app.models import sale as sale_model
from sqlalchemy import func

router = APIRouter()

@router.get("/bestsellers")
def get_bestsellers(db: Session = Depends(get_db)):
    return db.query(
        item_model.Item.name, 
        func.sum(sale_model.SaleItem.quantity).label('total_quantity')
    ).join(sale_model.SaleItem, item_model.Item.id == sale_model.SaleItem.item_id)
    .group_by(item_model.Item.name)
    .order_by(func.sum(sale_model.SaleItem.quantity).desc())
    .all()

@router.get("/slowmovers")
def get_slowmovers(db: Session = Depends(get_db)):
    return db.query(item_model.Item).filter(item_model.Item.stock_level > 0)
    .order_by(item_model.Item.updated_at.asc()).limit(10).all()

@router.get("/profitability")
def get_profitability(db: Session = Depends(get_db)):
    total_profit = db.query(func.sum(sale_model.Sale.profit)).scalar()
    total_revenue = db.query(func.sum(sale_model.Sale.total_amount)).scalar()
    return {"total_profit": total_profit, "total_revenue": total_revenue}
