from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from server.app.database import get_db
from server.app.models import SKU
from server.app.schemas import SKUListResponse, SKUItemResponse

router = APIRouter()


@router.get("/skus", response_model=SKUListResponse)
def get_skus(
    sub_category: Optional[str] = Query(
        None, description="Optional sub-category filter string"
    ),
    category: Optional[str] = Query(
        None, description="Optional category filter string"
    ),
    status_badge: Optional[str] = Query(
        None,
        description="Optional status badge filter string (GROW, MAINTAIN, SWAP, REDUCE)",
    ),
    db: Session = Depends(get_db),
):
    try:
        query = db.query(SKU)
        cat_filter = sub_category or category
        if cat_filter and cat_filter.lower() != "all sub-categories":
            query = query.filter(SKU.sub_category.ilike(f"%{cat_filter}%"))
        if status_badge:
            query = query.filter(SKU.status_badge.ilike(status_badge))

        skus = query.all()

        sku_items = [
            SKUItemResponse(
                sku_id=str(s.sku_code),
                product_name=str(s.product_name),
                sub_category=str(s.sub_category),
                sales_volume_weekly=float(s.sales_volume_weekly),
                sales_volume=float(s.sales_volume_weekly),
                margin_pct=float(s.margin_pct),
                linear_space_ft=float(s.linear_space_ft),
                is_private_brand=bool(s.is_private_brand),
                private_brand_indicator=bool(s.is_private_brand),
                status_badge=str(s.status_badge),
            )
            for s in skus
        ]

        return SKUListResponse(total_skus=len(sku_items), skus=sku_items)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal server error querying SKUs: {str(e)}"
        )
