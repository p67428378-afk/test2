import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.visitor import VisitorCreate, VisitorOut
from server.services import visitor_service

router = APIRouter(prefix="/visitors", tags=["Visitors"])


@router.post(
    "/register", response_model=VisitorOut, status_code=status.HTTP_201_CREATED
)
def register(visitor_in: VisitorCreate, db: Session = Depends(get_db)):
    return visitor_service.register_visitor(db, visitor_in)


@router.get("/profile", response_model=VisitorOut)
def get_profile(
    visitor_id: Optional[uuid.UUID] = Query(None),
    national_id: Optional[str] = Query(None),
    email: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return visitor_service.get_visitor_profile(
        db, visitor_id=visitor_id, national_id=national_id, email=email
    )


@router.get("", response_model=List[VisitorOut])
def list_all_visitors(
    verification_status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return visitor_service.list_visitors(
        db,
        verification_status=verification_status,
        search=search,
        skip=skip,
        limit=limit,
    )


@router.get("/{id}", response_model=VisitorOut)
def get_visitor(id: uuid.UUID, db: Session = Depends(get_db)):
    return visitor_service.get_visitor_by_id(db, id)


@router.get("/{id}/history")
def get_history(id: uuid.UUID, db: Session = Depends(get_db)):
    return visitor_service.get_visitor_history(db, id)
