
from sqlalchemy.orm import Session
from . import models

class LoanApplicationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_pending(self, sort: str = None):
        query = self.db.query(models.LoanApplication).filter(models.LoanApplication.status == 'pending')
        if sort == 'ease_of_approval_desc':
            query = query.order_by(models.LoanApplication.ease_of_approval_score.desc())
        return query.all()

    def get_by_id(self, application_id: str):
        return self.db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()

    def update_status(self, application_id: str, status: str):
        application = self.get_by_id(application_id)
        if application:
            application.status = status
            self.db.commit()
        return application

class BankRepresentativeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_username(self, username: str):
        return self.db.query(models.BankRepresentative).filter(models.BankRepresentative.username == username).first()
