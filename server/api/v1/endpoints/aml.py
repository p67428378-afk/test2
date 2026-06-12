from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from typing import List, Optional
from datetime import datetime

from server import crud, models, schemas
from server.database import get_db

router = APIRouter()

def generate_ctr_xml(report_id: UUID, customer: models.Customer, amount: float, tx_type: str) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<CTRReport xmlns="http://fiuind.gov.in/CTR">
    <Header>
        <ReportID>{report_id}</ReportID>
        <ReportType>CTR</ReportType>
        <CreatedDate>{datetime.utcnow().isoformat()}</CreatedDate>
    </Header>
    <CustomerDetails>
        <CustomerID>{customer.id}</CustomerID>
        <FirstName>{customer.first_name}</FirstName>
        <LastName>{customer.last_name}</LastName>
        <Email>{customer.email}</Email>
        <Phone>{customer.phone}</Phone>
    </CustomerDetails>
    <TransactionDetails>
        <Amount>{amount}</Amount>
        <TransactionType>{tx_type}</TransactionType>
        <Currency>INR</Currency>
    </TransactionDetails>
</CTRReport>"""

def generate_str_xml(report_id: UUID, customer: models.Customer, amount: float, tx_type: str, reason: str) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<STRReport xmlns="http://fiuind.gov.in/STR">
    <Header>
        <ReportID>{report_id}</ReportID>
        <ReportType>STR</ReportType>
        <CreatedDate>{datetime.utcnow().isoformat()}</CreatedDate>
    </Header>
    <CustomerDetails>
        <CustomerID>{customer.id}</CustomerID>
        <FirstName>{customer.first_name}</FirstName>
        <LastName>{customer.last_name}</LastName>
        <Email>{customer.email}</Email>
        <Phone>{customer.phone}</Phone>
        <RiskScore>{customer.risk_score}</RiskScore>
        <Status>{customer.status}</Status>
    </CustomerDetails>
    <TransactionDetails>
        <Amount>{amount}</Amount>
        <TransactionType>{tx_type}</TransactionType>
        <Currency>INR</Currency>
    </TransactionDetails>
    <SuspicionDetails>
        <Reason>{reason}</Reason>
    </SuspicionDetails>
</STRReport>"""

@router.post("/transactions", response_model=schemas.TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(payload: schemas.TransactionCreate, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db, payload.customerId)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Validate transaction type
    if payload.transactionType not in ["DEPOSIT", "WITHDRAWAL", "TRANSFER"]:
        raise HTTPException(status_code=422, detail="Invalid transaction type")

    # Create transaction
    tx = crud.create_transaction(
        db,
        customer_id=payload.customerId,
        amount=payload.amount,
        transaction_type=payload.transactionType,
        destination_account=payload.destinationAccount
    )

    alert_triggered = False

    # Rule 1: High-value transaction (amount > 1,000,000 INR)
    if payload.amount > 1000000:
        alert_triggered = True
        rule = "HIGH_VALUE_TRANSACTION"
        severity = "HIGH"
        notes = f"Transaction amount {payload.amount} exceeds threshold of 1,000,000 INR."
        
        # Create Alert
        crud.create_alert(db, customer.id, rule, payload.amount, severity, notes=notes)
        crud.create_audit_log(db, customer.id, "ALERT_TRIGGERED", "system", f"AML Alert triggered: {rule} ({severity})")

        # Auto-generate CTR or STR
        report_id = uuid4()
        if payload.transactionType in ["DEPOSIT", "WITHDRAWAL"]:
            xml_content = generate_ctr_xml(report_id, customer, payload.amount, payload.transactionType)
            crud.create_report(db, customer.id, "CTR", xml_content)
            crud.create_audit_log(db, customer.id, "REPORT_GENERATED", "system", f"CTR report auto-generated for high-value cash transaction.")
        else:
            xml_content = generate_str_xml(report_id, customer, payload.amount, payload.transactionType, notes)
            crud.create_report(db, customer.id, "STR", xml_content)
            crud.create_audit_log(db, customer.id, "REPORT_GENERATED", "system", f"STR report auto-generated for high-value transfer.")

    # Rule 2: Suspicious transaction from FLAGGED or REVIEW customer
    elif customer.status in ["FLAGGED", "REVIEW"] and payload.amount > 50000:
        alert_triggered = True
        rule = "SUSPICIOUS_CUSTOMER_ACTIVITY"
        severity = "MEDIUM" if customer.status == "REVIEW" else "HIGH"
        notes = f"Transaction of {payload.amount} by customer with status {customer.status}."

        # Create Alert
        crud.create_alert(db, customer.id, rule, payload.amount, severity, notes=notes)
        crud.create_audit_log(db, customer.id, "ALERT_TRIGGERED", "system", f"AML Alert triggered: {rule} ({severity})")

        # Auto-generate STR
        report_id = uuid4()
        xml_content = generate_str_xml(report_id, customer, payload.amount, payload.transactionType, notes)
        crud.create_report(db, customer.id, "STR", xml_content)
        crud.create_audit_log(db, customer.id, "REPORT_GENERATED", "system", f"STR report auto-generated for suspicious customer activity.")

    return {
        "id": tx.id,
        "customerId": tx.customer_id,
        "amount": tx.amount,
        "transactionType": tx.transaction_type,
        "status": tx.status,
        "alertTriggered": alert_triggered,
        "createdAt": tx.created_at
    }

@router.get("/alerts", response_model=List[schemas.AlertResponse])
def list_alerts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None, regex="^(OPEN|UNDER_REVIEW|RESOLVED_FALSE_POSITIVE|RESOLVED_SUSPICIOUS)$"),
    db: Session = Depends(get_db)
):
    alerts = crud.get_alerts(db, skip=skip, limit=limit, status=status)
    response = []
    for a in alerts:
        customer = crud.get_customer_by_id(db, a.customer_id)
        customer_name = f"{customer.first_name} {customer.last_name}" if customer else "Unknown"
        response.append({
            "id": a.id,
            "customerId": a.customer_id,
            "customerName": customer_name,
            "triggeredRule": a.triggered_rule,
            "totalAmount": a.total_amount,
            "severity": a.severity,
            "status": a.status,
            "createdAt": a.created_at
        })
    return response
