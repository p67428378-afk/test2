
from sqlalchemy.orm import Session
from server.app.models.position import Position
import uuid

def get_positions_by_trader(db: Session, trader_id: uuid.UUID):
    return db.query(Position).filter(Position.trader_id == trader_id).all()
