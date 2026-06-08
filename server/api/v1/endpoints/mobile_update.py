import hashlib
import random
import logging
import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import schemas, crud, models
from server.database import get_db

router = APIRouter()
logger = logging.getLogger(__name__)

def hash_string(value: str) -> str:
    return hashlib.sha256(value.encode('utf-8')).hexdigest()

def generate_otp() -> str:
    # Generate a 6-digit numeric OTP
    return f"{random.randint(100000, 999999)}"

# Mock external services
def send_sms(mobile_number: str, message: str) -> bool:
    logger.info(f"[SMS Gateway] Sending SMS to {mobile_number}: {message}")
    # Simulate success
    return True

def send_voice_call(mobile_number: str, message: str) -> bool:
    logger.info(f"[Voice Gateway] Initiating voice call to {mobile_number}: {message}")
    return True

def update_cbs_and_ckyc(account_number: str, new_mobile_number: str) -> bool:
    # Simulate CBS and CKYC update
    # If the new mobile number is "9999999999", simulate a failure
    if new_mobile_number == "9999999999":
        logger.error(f"[CBS/CKYC] Failed to update mobile number for account {account_number}")
        return False
    logger.info(f"[CBS/CKYC] Successfully updated mobile number to {new_mobile_number} for account {account_number}")
    return True

@router.post("/mobile-update/initiate", response_model=schemas.MobileUpdateInitiateResponse)
def initiate_mobile_update(request: schemas.MobileUpdateInitiateRequest, db: Session = Depends(get_db)):
    # Validate account number format (12 digits)
    if not request.account_number.isdigit() or len(request.account_number) != 12:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid account number format. Must be a 12-digit number."
        )
    
    # Validate new mobile number format (10 digits)
    if not request.new_mobile_number.isdigit() or len(request.new_mobile_number) != 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid mobile number format. Must be a 10-digit number."
        )

    # Find user by account number
    user = crud.get_user_by_account_number(db, request.account_number)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )

    # Rate limiting: check if there is an active request created in the last 1 minute
    one_minute_ago = datetime.utcnow() - timedelta(minutes=1)
    recent_request = db.query(models.MobileUpdateRequest).filter(
        models.MobileUpdateRequest.account_number == request.account_number,
        models.MobileUpdateRequest.created_at >= one_minute_ago
    ).first()
    if recent_request:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded for OTP generation. Please try again in a minute."
        )

    # Generate OTP
    otp = generate_otp()
    otp_hash = hash_string(otp)
    expires_at = datetime.utcnow() + timedelta(minutes=5) # OTP valid for 5 minutes

    # Hash mobile numbers
    old_mobile_hash = hash_string(user.mobile_number)
    new_mobile_hash = hash_string(request.new_mobile_number)

    # Create Mobile Update Request
    update_request = crud.create_mobile_update_request(
        db=db,
        account_number=request.account_number,
        old_mobile_number=user.mobile_number,
        new_mobile_number=request.new_mobile_number,
        old_mobile_hash=old_mobile_hash,
        new_mobile_hash=new_mobile_hash
    )

    # Create OTP Verification entry
    crud.create_otp_verification(
        db=db,
        request_id=update_request.id,
        otp_hash=otp_hash,
        mobile_number_type="OLD",
        expires_at=expires_at
    )

    # Send OTP to old mobile number (SMS primary, voice call backup)
    sms_sent = send_sms(user.mobile_number, f"Your OTP for mobile number update is {otp}. Valid for 5 minutes.")
    if not sms_sent:
        send_voice_call(user.mobile_number, f"Your OTP for mobile number update is {otp}.")

    return schemas.MobileUpdateInitiateResponse(
        message="OTP sent to old mobile number",
        request_id=str(update_request.id),
        status=update_request.status
    )

@router.post("/mobile-update/verify-old-otp", response_model=schemas.VerifyOldOTPResponse)
def verify_old_otp(request: schemas.VerifyOldOTPRequest, db: Session = Depends(get_db)):
    try:
        request_uuid = uuid.UUID(request.request_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request ID format"
        )

    # Find request
    update_request = crud.get_mobile_update_request(db, request_uuid)
    if not update_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )

    # Check status
    if update_request.status != "PENDING_OLD_OTP":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request status for old OTP verification"
        )

    # Find active OTP verification
    otp_verification = crud.get_active_otp_verification(db, update_request.id, "OLD")
    if not otp_verification:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active OTP verification found"
        )

    # Check expiry
    if datetime.utcnow() > otp_verification.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expired OTP"
        )

    # Verify OTP hash
    if hash_string(request.otp) != otp_verification.otp_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP"
        )

    # Mark OTP as verified
    crud.mark_otp_verification_verified(db, otp_verification)

    # Generate new OTP for new mobile number
    otp = generate_otp()
    otp_hash = hash_string(otp)
    expires_at = datetime.utcnow() + timedelta(minutes=5)

    # Create OTP Verification entry for new mobile number
    crud.create_otp_verification(
        db=db,
        request_id=update_request.id,
        otp_hash=otp_hash,
        mobile_number_type="NEW",
        expires_at=expires_at
    )

    # Update request status
    crud.update_mobile_update_request_status(db, update_request, "PENDING_NEW_OTP")

    # Send OTP to new mobile number (SMS primary, voice call backup)
    sms_sent = send_sms(update_request.new_mobile_number, f"Your OTP for mobile number update is {otp}. Valid for 5 minutes.")
    if not sms_sent:
        send_voice_call(update_request.new_mobile_number, f"Your OTP for mobile number update is {otp}.")

    return schemas.VerifyOldOTPResponse(
        message="Old mobile OTP verified. OTP sent to new mobile number",
        request_id=str(update_request.id),
        status=update_request.status
    )

@router.post("/mobile-update/verify-new-otp", response_model=schemas.VerifyNewOTPResponse)
def verify_new_otp(request: schemas.VerifyNewOTPRequest, db: Session = Depends(get_db)):
    try:
        request_uuid = uuid.UUID(request.request_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request ID format"
        )

    # Find request
    update_request = crud.get_mobile_update_request(db, request_uuid)
    if not update_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )

    # Check status
    if update_request.status != "PENDING_NEW_OTP":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request status for new OTP verification"
        )

    # Find active OTP verification
    otp_verification = crud.get_active_otp_verification(db, update_request.id, "NEW")
    if not otp_verification:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active OTP verification found"
        )

    # Check expiry
    if datetime.utcnow() > otp_verification.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expired OTP"
        )

    # Verify OTP hash
    if hash_string(request.otp) != otp_verification.otp_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP"
        )

    # Mark OTP as verified
    crud.mark_otp_verification_verified(db, otp_verification)

    # Update CBS and CKYC registry
    success = update_cbs_and_ckyc(update_request.account_number, update_request.new_mobile_number)
    if not success:
        crud.update_mobile_update_request_status(db, update_request, "FAILED")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update CBS or CKYC"
        )

    # Update user's mobile number in our database (CBS system of record)
    user = crud.get_user_by_account_number(db, update_request.account_number)
    if user:
        crud.update_user_mobile_number(db, user, update_request.new_mobile_number)

    # Update request status to COMPLETED
    crud.update_mobile_update_request_status(db, update_request, "COMPLETED")

    # Send confirmation SMS to new mobile number
    send_sms(update_request.new_mobile_number, "Your mobile number has been successfully updated in our records.")

    return schemas.VerifyNewOTPResponse(
        message="Mobile number updated successfully in CBS and CKYC",
        request_id=str(update_request.id),
        status=update_request.status
    )

@router.get("/mobile-update/status/{request_id}", response_model=schemas.MobileUpdateStatusResponse)
def get_mobile_update_status(request_id: str, db: Session = Depends(get_db)):
    try:
        request_uuid = uuid.UUID(request_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request ID format"
        )

    update_request = crud.get_mobile_update_request(db, request_uuid)
    if not update_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )

    return schemas.MobileUpdateStatusResponse(
        account_number=update_request.account_number,
        created_at=update_request.created_at,
        request_id=str(update_request.id),
        status=update_request.status,
        updated_at=update_request.updated_at
    )
