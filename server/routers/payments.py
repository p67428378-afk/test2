from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.payment import Payment
from server.models.compliance import ComplianceCheck
from server.models.fraud import FraudScore
from server.models.audit import AuditLog
from server.schemas.payment import (
    PaymentCreateRequest,
    PaymentCreateResponse,
    PaymentListResponse,
    PaymentDetailResponse,
    PaymentRetryResponse,
)
from server.schemas.compliance import ComplianceCheckResponse
from server.schemas.fraud import FraudCheckResponse
from server.schemas.audit import AuditLogResponse
from server.services.fx_service import FXService
from server.services.compliance_service import ComplianceService
from server.services.fraud_service import FraudService
from server.services.risk_service import RiskService
from server.services.settlement_service import SettlementService
from server.services.notification_service import NotificationService
from server.services.audit_service import AuditService

router = APIRouter()


@router.post("/payments", response_model=PaymentCreateResponse)
def create_payment(request: PaymentCreateRequest, db: Session = Depends(get_db)):
    # 1. Validate rate lock
    fx_rate = FXService.validate_rate_lock(request.rate_lock_id, db)
    if not fx_rate:
        raise HTTPException(status_code=400, detail="Rate lock expired or invalid")

    # 2. Validate risk limits
    valid, reason = RiskService.validate_limits(
        amount=request.amount,
        currency=request.source_currency,
        country=request.destination_country,
        db=db,
    )
    if not valid:
        # Block payment and notify treasury manager
        NotificationService.notify_treasury_manager(
            subject="Payment Blocked - Risk Limit Exceeded", body=reason
        )
        raise HTTPException(status_code=403, detail=reason)

    # 3. Create payment record
    payment = Payment(
        source_account_id=request.source_account_id,
        beneficiary_name=request.beneficiary_name,
        beneficiary_account_number=request.beneficiary_account_number,
        beneficiary_routing_number=request.beneficiary_routing_number,
        destination_country=request.destination_country,
        source_currency=request.source_currency,
        target_currency=request.target_currency,
        amount=request.amount,
        rate=float(fx_rate.ask_rate),
        fee=float(fx_rate.fee),
        settlement_network=request.settlement_network,
        status="Pending",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    # Log creation in audit log
    AuditService.log_change(
        table_name="payments",
        record_id=payment.payment_id,
        operation="CREATE",
        changed_by="Treasury Manager",
        new_data={"status": "Pending", "amount": request.amount},
        db=db,
    )

    # Send notification
    NotificationService.notify_treasury_manager(
        subject="Payment Initiated",
        body=f"Payment {payment.payment_id} of {payment.amount} {payment.source_currency} initiated.",
    )

    # 4. Run compliance checks
    compliance_check = ComplianceService.run_checks(
        payment_id=payment.payment_id,
        amount=request.amount,
        beneficiary_name=request.beneficiary_name,
        currency=request.source_currency,
        destination_country=request.destination_country,
        db=db,
    )

    # Log compliance check in audit log
    AuditService.log_change(
        table_name="compliance_checks",
        record_id=compliance_check.check_id,
        operation="CREATE",
        changed_by="Compliance Service",
        new_data={
            "status": compliance_check.status,
            "risk_score": float(compliance_check.risk_score),
        },
        db=db,
    )

    if compliance_check.status == "Failed":
        # Automatically reverse transaction
        payment.status = "Reversed"
        db.commit()

        AuditService.log_change(
            table_name="payments",
            record_id=payment.payment_id,
            operation="UPDATE",
            changed_by="System",
            old_data={"status": "Pending"},
            new_data={"status": "Reversed"},
            db=db,
        )

        NotificationService.notify_treasury_manager(
            subject="Payment Reversed - Compliance Failure",
            body=f"Payment {payment.payment_id} reversed due to compliance failure: {compliance_check.details}",
        )

        raise HTTPException(
            status_code=403, detail=f"Blocked by compliance: {compliance_check.details}"
        )

    # 5. Run fraud checks
    fraud_score = FraudService.analyze_fraud(
        payment_id=payment.payment_id,
        amount=request.amount,
        beneficiary_name=request.beneficiary_name,
        currency=request.source_currency,
        destination_country=request.destination_country,
        db=db,
    )

    # Log fraud check in audit log
    AuditService.log_change(
        table_name="fraud_scores",
        record_id=fraud_score.score_id,
        operation="CREATE",
        changed_by="Fraud Service",
        new_data={"status": fraud_score.status, "score": float(fraud_score.score)},
        db=db,
    )

    if fraud_score.status == "Manual Review":
        payment.status = "Manual Review"
        db.commit()

        AuditService.log_change(
            table_name="payments",
            record_id=payment.payment_id,
            operation="UPDATE",
            changed_by="System",
            old_data={"status": "Pending"},
            new_data={"status": "Manual Review"},
            db=db,
        )

        NotificationService.notify_treasury_manager(
            subject="Payment Routed to Manual Review",
            body=f"Payment {payment.payment_id} routed to manual review due to high fraud score: {fraud_score.score}",
        )

        return PaymentCreateResponse(
            compliance_status=compliance_check.status,
            created_at=payment.created_at,
            fraud_status=fraud_score.status,
            payment_id=payment.payment_id,
            risk_status="Passed",
            settlement_status="Pending",
            status="Manual Review",
        )

    # 6. Execute settlement
    settlement_status = SettlementService.execute_settlement(
        payment_id=payment.payment_id, network=request.settlement_network, db=db
    )

    payment.status = settlement_status
    db.commit()

    # Update risk limits usage on success
    if settlement_status == "Settled":
        RiskService.update_usage(
            amount=request.amount,
            currency=request.source_currency,
            country=request.destination_country,
            db=db,
        )

    AuditService.log_change(
        table_name="payments",
        record_id=payment.payment_id,
        operation="UPDATE",
        changed_by="Settlement Service",
        old_data={"status": "Pending"},
        new_data={"status": settlement_status},
        db=db,
    )

    NotificationService.notify_treasury_manager(
        subject=f"Payment Settlement: {settlement_status}",
        body=f"Payment {payment.payment_id} settlement status: {settlement_status}.",
    )

    return PaymentCreateResponse(
        compliance_status=compliance_check.status,
        created_at=payment.created_at,
        fraud_status=fraud_score.status,
        payment_id=payment.payment_id,
        risk_status="Passed",
        settlement_status=settlement_status,
        status=settlement_status,
    )


@router.get("/payments", response_model=List[PaymentListResponse])
def list_payments(
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Payment)
    if status:
        query = query.filter(Payment.status == status)

    payments = query.offset(skip).limit(limit).all()

    return [
        PaymentListResponse(
            amount=float(p.amount),
            beneficiary_name=p.beneficiary_name,
            created_at=p.created_at,
            currency=p.source_currency,
            payment_id=p.payment_id,
            status=p.status,
        )
        for p in payments
    ]


@router.get("/payments/{payment_id}", response_model=PaymentDetailResponse)
def get_payment_detail(payment_id: str, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    # Fetch compliance check
    comp_check = (
        db.query(ComplianceCheck)
        .filter(ComplianceCheck.payment_id == payment_id)
        .first()
    )
    compliance_response = None
    if comp_check:
        compliance_response = ComplianceCheckResponse(
            check_id=comp_check.check_id,
            details=comp_check.details,
            risk_score=float(comp_check.risk_score),
            sanction_screen_status=comp_check.sanction_screen_status,
            status=comp_check.status,
        )

    # Fetch fraud score
    fr_score = db.query(FraudScore).filter(FraudScore.payment_id == payment_id).first()
    fraud_response = None
    if fr_score:
        fraud_response = FraudCheckResponse(
            score_id=fr_score.score_id,
            score=float(fr_score.score),
            status=fr_score.status,
            details=fr_score.details,
        )

    # Fetch audit logs
    logs = db.query(AuditLog).filter(AuditLog.record_id == payment_id).all()
    audit_responses = [
        AuditLogResponse(
            log_id=log.log_id,
            action=log.operation,
            actor=log.changed_by,
            details=f"Operation {log.operation} on table {log.table_name}",
            timestamp=log.changed_at,
        )
        for log in logs
    ]

    return PaymentDetailResponse(
        amount=float(payment.amount),
        audit_logs=audit_responses,
        beneficiary_account_number=payment.beneficiary_account_number,
        beneficiary_name=payment.beneficiary_name,
        compliance_check=compliance_response,
        destination_country=payment.destination_country,
        fee=float(payment.fee),
        fraud_score=fraud_response,
        payment_id=payment.payment_id,
        rate=float(payment.rate),
        settlement_network=payment.settlement_network,
        source_account_id=payment.source_account_id,
        source_currency=payment.source_currency,
        status=payment.status,
        target_currency=payment.target_currency,
    )


@router.post("/payments/{payment_id}/retry", response_model=PaymentRetryResponse)
def retry_payment(payment_id: str, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    if payment.status != "Failed":
        raise HTTPException(
            status_code=400, detail="Only failed payments can be retried"
        )

    # Retry settlement with same locked rate
    settlement_status = SettlementService.execute_settlement(
        payment_id=payment.payment_id, network=payment.settlement_network, db=db
    )

    payment.status = settlement_status
    db.commit()

    AuditService.log_change(
        table_name="payments",
        record_id=payment.payment_id,
        operation="RETRY",
        changed_by="System",
        old_data={"status": "Failed"},
        new_data={"status": settlement_status},
        db=db,
    )

    return PaymentRetryResponse(
        details=f"Payment retry completed with status: {settlement_status}",
        payment_id=payment.payment_id,
        status=settlement_status,
    )
