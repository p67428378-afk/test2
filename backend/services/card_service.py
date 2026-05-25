
from sqlalchemy.orm import Session
from backend.schemas import BlockCardRequest, BlockCardResponse
from backend.models import BlockingRequest, AuditLog, BlockingStatus, OTPStatus
import uuid
import datetime

def block_card(db: Session, request: BlockCardRequest) -> BlockCardResponse:
    # This is a mock implementation. In a real application, you would integrate with
    # an OTP service and a Card Management System.

    # 1. Create a new blocking request
    new_request = BlockingRequest(
        card_identifier=request.identifier.card_number,
        account_identifier=request.identifier.account_number,
        customer_id="mock_customer_id",  # Replace with actual customer ID from session
        source_channel="API",
        reference_number=f"DCB-{datetime.datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    # 2. Log the initiation
    log_init = AuditLog(
        request_id=new_request.request_id,
        event_type="CARD_BLOCK_INITIATED",
        user_id="mock_user_id" # Replace with actual user ID
    )
    db.add(log_init)
    db.commit()


    # 3. Verify OTP (mocked)
    if request.otp == "123456":
        new_request.otp_status = OTPStatus.VERIFIED
        log_otp = AuditLog(
            request_id=new_request.request_id,
            event_type="OTP_VERIFIED",
            user_id="mock_user_id"
        )
    else:
        new_request.otp_status = OTPStatus.FAILED
        new_request.blocking_status = BlockingStatus.FAILED
        log_otp = AuditLog(
            request_id=new_request.request_id,
            event_type="OTP_VERIFICATION_FAILED",
            user_id="mock_user_id"
        )
        db.add(log_otp)
        db.commit()
        db.refresh(new_request)
        return BlockCardResponse(status=new_request.blocking_status, reference_number=new_request.reference_number)


    # 4. Block card (mocked)
    new_request.blocking_status = BlockingStatus.BLOCKED
    log_block = AuditLog(
        request_id=new_request.request_id,
        event_type="CARD_BLOCKED",
        user_id="mock_user_id"
    )
    db.add(log_block)
    db.commit()

    # 5. Trigger replacement card request (mocked)
    log_replacement = AuditLog(
        request_id=new_request.request_id,
        event_type="REPLACEMENT_CARD_REQUEST_TRIGGERED",
        user_id="mock_user_id"
    )
    db.add(log_replacement)
    db.commit()
    db.refresh(new_request)

    return BlockCardResponse(status=new_request.blocking_status, reference_number=new_request.reference_number)
