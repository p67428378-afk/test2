
from sqlalchemy.orm import Session
from app.models import sale as sale_model
from app.models import item as item_model
from app.schemas import sale as sale_schema

def create_sale(db: Session, sale: sale_schema.SaleCreate):
    total_amount = 0
    profit = 0
    db_items = []

    for item_in in sale.items:
        item = db.query(item_model.Item).filter(item_model.Item.id == item_in.item_id).first()
        if not item or item.stock_level < item_in.quantity:
            raise ValueError(f"Item {item_in.item_id} is out of stock or does not exist.")
        
        total_amount += item_in.price * item_in.quantity
        profit += (item_in.price - item.cost) * item_in.quantity
        item.stock_level -= item_in.quantity
        db.add(item)
        db_items.append(sale_model.SaleItem(
            item_id=item_in.item_id, 
            quantity=item_in.quantity, 
            price=item_in.price
        ))

    db_sale = sale_model.Sale(
        customer_id=sale.customer_id,
        total_amount=total_amount,
        profit=profit,
        items=db_items
    )
    
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

def get_sales_history(db: Session, skip: int = 0, limit: int = 100):
    return db.query(sale_model.Sale).offset(skip).limit(limit).all()
