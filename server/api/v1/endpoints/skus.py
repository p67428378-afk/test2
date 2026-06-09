
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from server.database import get_db
from server.crud.sku_crud import sku
from server.schemas.sku import SkuPaginated, Sku

router = APIRouter()

@router.get("/skus", response_model=SkuPaginated)
def read_skus(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sort_by: str = Query("sales", enum=["sales", "profit_margin", "inventory_level", "name"]),
    filter_by_status: Optional[str] = Query(None, enum=["GROW", "MAINTAIN", "SWAP", "REDUCE"])
):
    skus_from_db = sku.get_multi(
        db=db, 
        skip=(page - 1) * limit, 
        limit=limit, 
        sort_by=sort_by, 
        filter_by_status=filter_by_status
    )
    
    skus_list: List[Sku] = []
    for s in skus_from_db:
        skus_list.append(Sku(
            id=s.id,
            name=s.product.name,
            sales=s.sales,
            profit_margin=s.profit_margin,
            inventory_level=s.inventory_level,
            status_badge=s.status_badge
        ))

    total_skus = sku.count(db=db, filter_by_status=filter_by_status)
    return {
        "skus": skus_list,
        "page": page,
        "limit": limit,
        "total_skus": total_skus
    }
