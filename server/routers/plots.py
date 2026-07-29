from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from server.database import get_db
from server.schemas import PlotCreate, PlotUpdate, PlotResponse, PlotDetailResponse
from server.crud import (
    get_plots,
    get_plot_by_id,
    get_plot_by_location,
    create_plot,
    update_plot,
    delete_plot,
    get_plot_type_by_id,
)
from server.auth import get_current_user
from server.models import User

router = APIRouter()


@router.get("/plots", response_model=List[PlotDetailResponse])
def read_plots(
    plot_type_id: Optional[UUID] = Query(None, description="Filter by plot type ID"),
    status: Optional[str] = Query(None, description="Filter by status"),
    section: Optional[str] = Query(None, description="Filter by section"),
    lot: Optional[str] = Query(None, description="Filter by lot"),
    plot_number: Optional[str] = Query(None, description="Filter by plot number"),
    skip: int = Query(0, ge=0, description="Skip records"),
    limit: int = Query(100, ge=1, le=1000, description="Limit records"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_plots(
        db,
        plot_type_id=plot_type_id,
        status=status,
        section=section,
        lot=lot,
        plot_number=plot_number,
        skip=skip,
        limit=limit,
    )


@router.post("/plots", response_model=PlotResponse, status_code=status.HTTP_201_CREATED)
def create_new_plot(
    plot_in: PlotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check if plot type exists
    plot_type = get_plot_type_by_id(db, plot_in.plot_type_id)
    if not plot_type:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid plot_type_id",
        )

    # Check if plot with this location already exists
    existing_plot = get_plot_by_location(
        db, plot_in.section, plot_in.lot, plot_in.plot_number
    )
    if existing_plot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Plot with this location already exists",
        )

    return create_plot(db, plot_in)


@router.get("/plots/{plot_id}", response_model=PlotDetailResponse)
def read_plot(
    plot_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plot = get_plot_by_id(db, plot_id)
    if not plot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Plot not found"
        )
    return plot


@router.put("/plots/{plot_id}", response_model=PlotResponse)
def update_existing_plot(
    plot_id: UUID,
    plot_in: PlotUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plot = get_plot_by_id(db, plot_id)
    if not plot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Plot not found"
        )

    # Check if plot type exists
    plot_type = get_plot_type_by_id(db, plot_in.plot_type_id)
    if not plot_type:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid plot_type_id",
        )

    # Check if another plot with this location already exists
    existing_plot = get_plot_by_location(
        db, plot_in.section, plot_in.lot, plot_in.plot_number
    )
    if existing_plot and existing_plot.id != plot_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Plot with this location already exists",
        )

    return update_plot(db, plot, plot_in)


@router.delete("/plots/{plot_id}")
def delete_existing_plot(
    plot_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plot = get_plot_by_id(db, plot_id)
    if not plot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Plot not found"
        )
    delete_plot(db, plot)
    return {"message": "Plot deleted successfully"}
