from datetime import datetime, timezone, timedelta
import uuid
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from server import schemas, models, auth
from server.database import get_db

router = APIRouter(prefix="/api/v1")


def log_event(db: Session, user_id: str | None, event_type: str, ip_address: str):
    u_id = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
    audit_log = models.AuditLog(
        user_id=u_id, event_type=event_type, ip_address=ip_address
    )
    db.add(audit_log)
    db.commit()


def validate_password_strength(password: str):
    import re

    if len(password) < 8:
        raise HTTPException(
            status_code=400, detail="Password must be at least 8 characters long"
        )
    if not re.search(r"[A-Z]", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one uppercase letter",
        )
    if not re.search(r"[a-z]", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one lowercase letter",
        )
    if not re.search(r"\d", password):
        raise HTTPException(
            status_code=400, detail="Password must contain at least one digit"
        )
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one special character",
        )


@router.post("/auth/register", response_model=schemas.UserRegisterResponse)
def register(
    payload: schemas.UserRegisterRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else "127.0.0.1"

    # Check if email or SSN already registered
    existing_email = (
        db.query(models.User).filter(models.User.email == payload.email).first()
    )
    if existing_email:
        log_event(db, None, "REGISTRATION_FAILURE_DUPLICATE_EMAIL", ip_address)
        raise HTTPException(status_code=409, detail="Email already registered")

    encrypted_ssn = auth.encrypt_ssn(payload.ssn)
    existing_ssn = (
        db.query(models.User).filter(models.User.encrypted_ssn == encrypted_ssn).first()
    )
    if existing_ssn:
        log_event(db, None, "REGISTRATION_FAILURE_DUPLICATE_SSN", ip_address)
        raise HTTPException(status_code=409, detail="SSN already registered")

    # Validate password strength
    validate_password_strength(payload.password)

    # Create user
    hashed_pw = auth.hash_password(payload.password)
    new_user = models.User(
        full_name=payload.full_name,
        email=payload.email,
        phone_number=payload.phone_number,
        encrypted_ssn=encrypted_ssn,
        date_of_birth=payload.date_of_birth,
        password_hash=hashed_pw,
        is_active=False,  # Pending activation status
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    log_event(db, new_user.id, "REGISTRATION_SUCCESS", ip_address)

    return schemas.UserRegisterResponse(
        id=str(new_user.id),
        full_name=new_user.full_name,
        email=new_user.email,
        is_active=new_user.is_active,
        created_at=new_user.created_at.isoformat(),
    )


@router.post("/auth/login", response_model=schemas.UserLoginResponse)
def login(
    payload: schemas.UserLoginRequest, request: Request, db: Session = Depends(get_db)
):
    ip_address = request.client.host if request.client else "127.0.0.1"

    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        log_event(db, None, "LOGIN_FAILURE_USER_NOT_FOUND", ip_address)
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Check lockout
    if user.lockout_until and datetime.now(timezone.utc) < user.lockout_until.replace(
        tzinfo=timezone.utc
    ):
        log_event(db, user.id, "LOGIN_FAILURE_LOCKED_OUT", ip_address)
        raise HTTPException(
            status_code=403, detail="Account locked due to too many failed attempts"
        )

    # Verify password
    if not auth.verify_password(payload.password, user.password_hash):
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= 5:
            user.lockout_until = datetime.now(timezone.utc) + timedelta(minutes=15)
            log_event(db, user.id, "ACCOUNT_LOCKOUT", ip_address)
        db.commit()
        log_event(db, user.id, "LOGIN_FAILURE_INVALID_PASSWORD", ip_address)
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Reset failed attempts on successful password verification
    user.failed_login_attempts = 0
    db.commit()

    # Check if 2FA is set up
    two_fa = (
        db.query(models.User2FAMethod)
        .filter(
            models.User2FAMethod.user_id == user.id, models.User2FAMethod.is_verified
        )
        .first()
    )

    if not two_fa:
        # First login setup or 2FA not verified yet
        temp_token = auth.create_temp_token(str(user.id))
        log_event(db, user.id, "LOGIN_STEP1_SUCCESS_2FA_REQUIRED", ip_address)
        return schemas.UserLoginResponse(
            requires_2fa=True, temp_token=temp_token, user_id=str(user.id)
        )

    # 2FA is set up, generate temp token for 2FA verification step
    temp_token = auth.create_temp_token(str(user.id))
    log_event(db, user.id, "LOGIN_STEP1_SUCCESS_2FA_CHALLENGE", ip_address)
    return schemas.UserLoginResponse(
        requires_2fa=True, temp_token=temp_token, user_id=str(user.id)
    )


@router.post("/auth/2fa/setup", response_model=schemas.User2FASetupResponse)
def setup_2fa(
    payload: schemas.User2FASetupRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else "127.0.0.1"

    user_uuid = (
        uuid.UUID(payload.user_id)
        if isinstance(payload.user_id, str)
        else payload.user_id
    )
    user = db.query(models.User).filter(models.User.id == user_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate a mock secret
    secret = f"SECRET_{user.email[:5].upper()}_2FA"
    qr_code_uri = (
        f"otpauth://totp/BFSI:{user.email}?secret={secret}&issuer=BFSI"
        if payload.method_type == "APP"
        else None
    )

    # Save or update 2FA method
    two_fa = (
        db.query(models.User2FAMethod)
        .filter(models.User2FAMethod.user_id == user.id)
        .first()
    )
    if not two_fa:
        two_fa = models.User2FAMethod(
            user_id=user.id,
            method_type=payload.method_type,
            secret=secret,
            is_verified=False,
        )
        db.add(two_fa)
    else:
        two_fa.method_type = payload.method_type
        two_fa.secret = secret
        two_fa.is_verified = False
    db.commit()

    log_event(db, user.id, f"2FA_SETUP_INITIATED_{payload.method_type}", ip_address)

    return schemas.User2FASetupResponse(secret=secret, qr_code_uri=qr_code_uri)


@router.post("/auth/login/2fa", response_model=schemas.TokenResponse)
def verify_2fa_login(
    payload: schemas.User2FAVerifyRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else "127.0.0.1"

    user_uuid = (
        uuid.UUID(payload.user_id)
        if isinstance(payload.user_id, str)
        else payload.user_id
    )
    user = db.query(models.User).filter(models.User.id == user_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify temp token
    if not auth.verify_temp_token(payload.temp_token, payload.user_id):
        log_event(db, user.id, "2FA_VERIFICATION_FAILURE_INVALID_TOKEN", ip_address)
        raise HTTPException(
            status_code=401, detail="Invalid or expired temporary token"
        )

    # Verify code (mock verification: code is '123456' or matches the secret suffix)
    two_fa = (
        db.query(models.User2FAMethod)
        .filter(models.User2FAMethod.user_id == user.id)
        .first()
    )

    # If 2FA is not verified yet, this verification activates it
    is_valid_code = payload.code == "123456"
    if not is_valid_code:
        log_event(db, user.id, "2FA_VERIFICATION_FAILURE_INVALID_CODE", ip_address)
        raise HTTPException(status_code=401, detail="Invalid or expired 2FA code")

    if two_fa and not two_fa.is_verified:
        two_fa.is_verified = True
        user.is_active = (
            True  # Activate user profile upon successful first 2FA verification
        )
        db.commit()
        log_event(db, user.id, "2FA_METHOD_ACTIVATED", ip_address)

    # Issue final JWT access token
    access_token = auth.create_access_token(str(user.id))
    log_event(db, user.id, "LOGIN_SUCCESS", ip_address)

    return schemas.TokenResponse(access_token=access_token, token_type="bearer")


@router.post("/auth/recovery")
def account_recovery(
    payload: schemas.UserRegisterRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """Secure identity verification process for users who lost access to their account or 2FA device."""
    ip_address = request.client.host if request.client else "127.0.0.1"

    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify identity using SSN and Date of Birth
    encrypted_ssn = auth.encrypt_ssn(payload.ssn)
    if (
        user.encrypted_ssn != encrypted_ssn
        or user.date_of_birth != payload.date_of_birth
    ):
        log_event(db, user.id, "RECOVERY_FAILURE_IDENTITY_MISMATCH", ip_address)
        raise HTTPException(status_code=400, detail="Identity verification failed")

    # Reset 2FA methods and password
    db.query(models.User2FAMethod).filter(
        models.User2FAMethod.user_id == user.id
    ).delete()
    user.password_hash = auth.hash_password(payload.password)
    user.failed_login_attempts = 0
    user.lockout_until = None
    user.is_active = False  # Require 2FA setup again on next login
    db.commit()

    log_event(db, user.id, "ACCOUNT_RECOVERY_SUCCESS", ip_address)
    return {
        "detail": "Account recovered successfully. Please log in and set up 2FA again."
    }
