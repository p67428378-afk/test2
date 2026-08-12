from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server import models_painting as models
from server.schemas_painting import (
    PriceCalculationRequest,
    PriceCalculationResponse,
    FrameOptionOut,
)
from server.services.pricing import calculate_painting_price

router = APIRouter()


@router.post("/configurator/price", response_model=PriceCalculationResponse)
def calculate_dynamic_price(
    payload: PriceCalculationRequest, db: Session = Depends(get_db)
):
    """
    Calculate dynamic price for custom artwork dimensions (12"-120") and frame selection.
    """
    painting = (
        db.query(models.Painting)
        .filter(models.Painting.id == payload.painting_id)
        .first()
    )
    if not painting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Painting not found",
        )

    price_multiplier = 1.0
    flat_fee = 0.0

    if payload.frame_option_id:
        frame_option = (
            db.query(models.FrameOption)
            .filter(models.FrameOption.id == payload.frame_option_id)
            .first()
        )
        if not frame_option:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Frame option not found",
            )
        price_multiplier = frame_option.price_multiplier
        flat_fee = frame_option.flat_fee

    is_valid, validation_error, area_sq, dim_mult, calculated_price = (
        calculate_painting_price(
            base_price=painting.base_price,
            custom_width=payload.custom_width_inches,
            custom_height=payload.custom_height_inches,
            price_multiplier=price_multiplier,
            flat_fee=flat_fee,
        )
    )

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=validation_error,
        )

    return PriceCalculationResponse(
        painting_id=painting.id,
        base_price=painting.base_price,
        custom_width_inches=payload.custom_width_inches,
        custom_height_inches=payload.custom_height_inches,
        area_sq_inches=area_sq,
        dimension_multiplier=dim_mult,
        frame_fee=flat_fee,
        calculated_unit_price=calculated_price,
        is_valid=is_valid,
        validation_error=validation_error,
    )


@router.get("/configurator/frame-options", response_model=List[FrameOptionOut])
def get_configurator_frame_options(db: Session = Depends(get_db)):
    """
    Get available frame options for custom configurator.
    """
    return db.query(models.FrameOption).all()
