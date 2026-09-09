from typing import List, Callable
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import User
from server.auth import get_current_user

# Role Constants
ROLE_ADMIN = "Administrator"
ROLE_LEAD_INVESTIGATOR = "Lead Investigator"
ROLE_INVESTIGATOR = "Investigator"
ROLE_PROSECUTOR = "Prosecutor"
ROLE_AUDITOR = "External Auditor"
ROLE_OBSERVER = "Read-Only Observer"

ALL_ROLES = [
    ROLE_ADMIN,
    ROLE_LEAD_INVESTIGATOR,
    ROLE_INVESTIGATOR,
    ROLE_PROSECUTOR,
    ROLE_AUDITOR,
    ROLE_OBSERVER,
]

RBAC_CAPABILITIES_MATRIX = [
    {
        "role": ROLE_ADMIN,
        "upload_evidence": "Yes",
        "view_evidence_ledger": "Yes",
        "transfer_custody": "Yes",
        "assign_to_case": "Yes",
        "view_audit_logs": "Yes",
        "admin_user_mgmt": "Yes",
    },
    {
        "role": ROLE_LEAD_INVESTIGATOR,
        "upload_evidence": "Yes",
        "view_evidence_ledger": "Yes",
        "transfer_custody": "Yes",
        "assign_to_case": "Yes",
        "view_audit_logs": "Yes",
        "admin_user_mgmt": "No",
    },
    {
        "role": ROLE_INVESTIGATOR,
        "upload_evidence": "Yes",
        "view_evidence_ledger": "Assigned Cases",
        "transfer_custody": "Yes",
        "assign_to_case": "Assigned Cases",
        "view_audit_logs": "No",
        "admin_user_mgmt": "No",
    },
    {
        "role": ROLE_PROSECUTOR,
        "upload_evidence": "No",
        "view_evidence_ledger": "Assigned Cases",
        "transfer_custody": "Accept Only",
        "assign_to_case": "No",
        "view_audit_logs": "No",
        "admin_user_mgmt": "No",
    },
    {
        "role": ROLE_AUDITOR,
        "upload_evidence": "No",
        "view_evidence_ledger": "Read-Only",
        "transfer_custody": "No",
        "assign_to_case": "No",
        "view_audit_logs": "Yes",
        "admin_user_mgmt": "No",
    },
    {
        "role": ROLE_OBSERVER,
        "upload_evidence": "No",
        "view_evidence_ledger": "Read-Only",
        "transfer_custody": "No",
        "assign_to_case": "No",
        "view_audit_logs": "No",
        "admin_user_mgmt": "No",
    },
]


def require_roles(allowed_roles: List[str]) -> Callable:
    def role_checker(
        request: Request,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> User:
        if current_user.role not in allowed_roles:
            # Record audit log for 403 access denial
            from server.audit import log_audit_event

            client_ip = request.client.host if request.client else "127.0.0.1"
            log_audit_event(
                db=db,
                user_id=current_user.id,
                user_email=current_user.email,
                action="ACCESS_DENIED_403",
                resource=request.url.path,
                status_code=403,
                ip_address=client_ip,
                details={
                    "reason": f"Role '{current_user.role}' is not authorized. Allowed roles: {allowed_roles}",
                    "method": request.method,
                },
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: User role '{current_user.role}' does not have required permissions for this action.",
            )
        return current_user

    return role_checker
