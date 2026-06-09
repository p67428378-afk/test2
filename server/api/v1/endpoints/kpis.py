
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.crud.kpi_crud import kpi
from server.schemas.kpi import Kpi as KpiSchema

router = APIRouter()

@router.get("/kpis", response_model=KpiSchema)
def read_kpis(db: Session = Depends(get_db)):
    return kpi.get_latest(db=db)
