
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from server.crud.base import CRUDBase
from server.models.sku_performance import SkuPerformance
from server.models.product import Product
from server.schemas.sku import Sku as SkuSchema

class CRUDSku(CRUDBase[SkuPerformance, SkuSchema, SkuSchema]):
    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100, sort_by: str = 'sales', filter_by_status: Optional[str] = None
    ) -> List[SkuPerformance]:
        query = db.query(self.model).join(Product).options(joinedload(self.model.product))
        if filter_by_status:
            query = query.filter(self.model.status_badge == filter_by_status)
        
        if hasattr(self.model, sort_by):
            query = query.order_by(getattr(self.model, sort_by).desc())
        elif hasattr(Product, sort_by):
            query = query.order_by(getattr(Product, sort_by).desc())

        return query.offset(skip).limit(limit).all()

    def count(self, db: Session, filter_by_status: Optional[str] = None) -> int:
        query = db.query(self.model)
        if filter_by_status:
            query = query.filter(self.model.status_badge == filter_by_status)
        return query.count()

sku = CRUDSku(SkuPerformance)
