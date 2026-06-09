
from sqlalchemy.orm import Session
from server.crud.base import CRUDBase
from server.models.kpi import Kpi
from server.schemas.kpi import Kpi as KpiSchema

class CRUDKpi(CRUDBase[Kpi, KpiSchema, KpiSchema]):
    def get_latest(self, db: Session) -> Kpi:
        return db.query(self.model).order_by(self.model.calculation_date.desc()).first()

kpi = CRUDKpi(Kpi)
