from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from server import crud, schemas, models
from server.database import get_db
from server.routers.profiles import get_current_user

router = APIRouter(prefix="/api/v1/exchanges", tags=["exchanges"])


@router.post(
    "",
    response_model=schemas.ExchangeRequestResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_exchange_request(
    request_data: schemas.ExchangeRequestCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Create a new skill exchange request.
    """
    return crud.create_exchange_request(db, current_user.id, request_data)


@router.get("", response_model=List[schemas.ExchangeRequestResponse])
def list_exchange_requests(
    role_filter: Optional[str] = Query(
        "all", description="Filter by role: incoming, outgoing, or all"
    ),
    status_filter: Optional[str] = Query(
        None, description="Filter by status: PENDING, ACCEPTED, REJECTED, CANCELLED"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    List exchange requests (incoming, outgoing, or all) with optional status filter.
    """
    return crud.get_exchange_requests_for_user(
        db=db,
        user_id=current_user.id,
        role_filter=role_filter,
        status_filter=status_filter,
        skip=skip,
        limit=limit,
    )


@router.patch("/{id}/status", response_model=schemas.ExchangeRequestResponse)
def update_exchange_request_status(
    id: str,
    status_update: schemas.ExchangeStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Accept, reject, or cancel an exchange request.
    Action: ACCEPT (recipient), REJECT (recipient), CANCEL (requester).
    """
    return crud.update_exchange_request_status(
        db=db, request_id=id, user_id=current_user.id, action=status_update.action
    )
