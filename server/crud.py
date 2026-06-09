from sqlalchemy.orm import Session
from server import models, schemas
from uuid import UUID

def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()

def get_user_by_mobile_number(db: Session, mobile_number: str):
    return db.query(models.User).filter(models.User.mobile_number == mobile_number).first()

def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at)
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp

def get_otp(db: Session, otp_session_id: str):
    return db.query(models.OTP).filter(models.OTP.id == otp_session_id).first()

def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True
    db.commit()
    db.refresh(otp)
    return otp

def create_password_history(db: Session, user_id: str, hashed_password: str):
    db_password_history = models.PasswordHistory(user_id=user_id, hashed_password=hashed_password)
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history

def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user

# Code Review System CRUD
def get_reviews(db: Session, skip: int = 0, limit: int = 20):
    return db.query(models.Review).order_by(models.Review.created_at.desc()).offset(skip).limit(limit).all()

def get_review_by_id(db: Session, review_id: UUID):
    return db.query(models.Review).filter(models.Review.review_id == review_id).first()

def get_config(db: Session):
    config = db.query(models.CodeReviewConfig).first()
    if not config:
        config = models.CodeReviewConfig(pep8_enabled=True, max_line_length=120, owasp_top_10=True)
        db.add(config)
        db.commit()
        db.refresh(config)
    return config

def update_config(db: Session, config_schema: schemas.CodeReviewConfigSchema):
    config = db.query(models.CodeReviewConfig).first()
    if not config:
        config = models.CodeReviewConfig(
            pep8_enabled=config_schema.pep8_enabled,
            max_line_length=config_schema.max_line_length,
            owasp_top_10=config_schema.owasp_top_10
        )
        db.add(config)
    else:
        config.pep8_enabled = config_schema.pep8_enabled
        config.max_line_length = config_schema.max_line_length
        config.owasp_top_10 = config_schema.owasp_top_10
    db.commit()
    db.refresh(config)
    return config

def create_review(db: Session, pr_id: str, repo_name: str, title: str = None, branch_name: str = None, status: str = "PENDING"):
    db_review = models.Review(
        pr_id=pr_id,
        repo_name=repo_name,
        title=title,
        branch_name=branch_name,
        status=status
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def create_issue(db: Session, review_id: UUID, file_path: str, line_number: int, message: str, severity: str = "INFO"):
    db_issue = models.Issue(
        review_id=review_id,
        file_path=file_path,
        line_number=line_number,
        message=message,
        severity=severity
    )
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue
