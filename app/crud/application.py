from sqlalchemy.orm import Session
from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationUpdate

class CRUDApplication:
    def get(self, db: Session, id: str) -> Application:
        return db.query(Application).filter(Application.id == id).first()

    def create(self, db: Session, *, obj_in: ApplicationCreate) -> Application:
        db_obj = Application(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: Application, obj_in: ApplicationUpdate
    ) -> Application:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field in update_data:
            setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

application = CRUDApplication()
