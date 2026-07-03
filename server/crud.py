from sqlalchemy.orm import Session
from typing import Optional
from server import models


def get_products_with_metrics(
    db: Session,
    search: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = None,
):
    query = db.query(models.Product).join(models.PerformanceMetric)

    if search:
        query = query.filter(
            (models.Product.product_name.ilike(f"%{search}%"))
            | (models.Product.sku_id.ilike(f"%{search}%"))
        )

    # Sorting logic
    if sort_by:
        col = None
        if sort_by == "sku_id":
            col = models.Product.sku_id
        elif sort_by == "product_name":
            col = models.Product.product_name
        elif sort_by == "current_sales":
            col = models.PerformanceMetric.current_sales
        elif sort_by == "sales_growth":
            col = models.PerformanceMetric.sales_growth
        elif sort_by == "status":
            col = models.PerformanceMetric.status

        if col is not None:
            if sort_order == "desc":
                query = query.order_by(col.desc())
            else:
                query = query.order_by(col.asc())
    else:
        query = query.order_by(models.Product.sku_id.asc())

    return query.all()
