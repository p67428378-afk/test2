from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from server.database import get_db
from server.schemas import PlotTypeResponse
from server.crud import get_plot_types
from server.auth import get_current_user
from server.models import User

router = APIRouter()


@router.get("/plot-types", response_model=List[PlotTypeResponse])
def read_plot_types(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return get_plot_types(db)
