
from .repositories import LoanApplicationRepository, BankRepresentativeRepository
from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self, bank_rep_repo: BankRepresentativeRepository):
        self.bank_rep_repo = bank_rep_repo

    def authenticate(self, username: str, password: str):
        user = self.bank_rep_repo.get_by_username(username)
        if not user or not pwd_context.verify(password, user.password):
            return None
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = {"sub": user.username, "exp": datetime.utcnow() + access_token_expires}
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return {"access_token": encoded_jwt, "token_type": "bearer"}

class LoanApplicationService:
    def __init__(self, loan_app_repo: LoanApplicationRepository):
        self.loan_app_repo = loan_app_repo

    def get_pending_applications(self, sort: str = None):
        return self.loan_app_repo.get_all_pending(sort)

    def get_application_details(self, application_id: str):
        return self.loan_app_repo.get_by_id(application_id)

    def approve_application(self, application_id: str):
        return self.loan_app_repo.update_status(application_id, 'approved')

    def reject_application(self, application_id: str):
        return self.loan_app_repo.update_status(application_id, 'rejected')
