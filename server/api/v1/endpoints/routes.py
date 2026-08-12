from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server import crud, models
from server.database import get_db
from server.schemas import DriverRouteCreate, DriverRouteResponse, DriverStopUpdate

router = APIRouter()


@router.get("/driver/{driver_id}", response_model=list[DriverRouteResponse])
def get_driver_routes(
    driver_id: str,
    zone: str | None = Query(None),
    db: Session = Depends(get_db),
):
    routes = crud.get_driver_routes(db=db, driver_id=driver_id, zone=zone)
    return routes


@router.patch("/stops/{stop_id}", response_model=DriverRouteResponse)
def update_stop_status(
    stop_id: str,
    stop_in: DriverStopUpdate,
    db: Session = Depends(get_db),
):
    stop = crud.update_stop_status(
        db=db, stop_id=stop_id, stop_status=stop_in.stop_status
    )
    if not stop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Driver stop not found"
        )
    return stop


@router.post(
    "", response_model=DriverRouteResponse, status_code=status.HTTP_201_CREATED
)
def create_driver_route(
    route_in: DriverRouteCreate,
    db: Session = Depends(get_db),
):
    dr = models.DriverRoute(
        driver_id=route_in.driver_id,
        zone=route_in.zone,
        sequence_order=route_in.sequence_order,
        order_id=route_in.order_id,
        stop_type=route_in.stop_type.upper(),
        stop_status="EN_ROUTE",
    )
    db.add(dr)
    db.commit()
    db.refresh(dr)
    return dr
