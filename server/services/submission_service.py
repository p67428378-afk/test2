
from sqlalchemy.orm import Session
from server.models.submission import FormSubmission, AuditLog
from server.schemas.submission import SubmissionCreate
from server.services.validation_service import validation_service
from server.services.storage_service import storage_service
from server.services.core_banking_client import core_banking_client
from datetime import date

class SubmissionService:

    def create_submission_record(self, db: Session, submission: SubmissionCreate, form_type: str) -> FormSubmission:
        db_submission = FormSubmission(
            customer_pan=submission.customer_pan,
            financial_year=submission.financial_year,
            declared_income=submission.declared_income,
            form_type=form_type,
            status='PENDING'
        )
        db.add(db_submission)
        db.commit()
        db.refresh(db_submission)
        self.add_audit_log(db, db_submission.submission_id, 'CREATED', 'Initial submission created.')
        return db_submission

    def update_submission_status(self, db: Session, submission_id: str, status: str, reason: str = None):
        db_submission = db.query(FormSubmission).filter(FormSubmission.submission_id == submission_id).first()
        if db_submission:
            db_submission.status = status
            if reason:
                db_submission.rejection_reason = reason
            db.commit()
            self.add_audit_log(db, submission_id, 'STATUS_UPDATE', f'Status changed to {status}. Reason: {reason or "N/A"}')

    def add_audit_log(self, db: Session, submission_id: str, event_type: str, details: str):
        audit_log = AuditLog(
            submission_id=submission_id,
            event_type=event_type,
            event_details={'message': details},
            actor='SYSTEM'
        )
        db.add(audit_log)
        db.commit()

    async def process_submission(self, db: Session, submission: SubmissionCreate) -> FormSubmission:
        is_eligible, form_type, reason = await validation_service.validate_eligibility(
            submission.customer_pan, submission.declared_income
        )

        db_submission = self.create_submission_record(db, submission, form_type or 'N/A')

        if not is_eligible:
            self.update_submission_status(db, db_submission.submission_id, 'REJECTED', reason)
            return db_submission

        storage_ref, checksum = await storage_service.upload_form(
            submission.digitally_signed_form_base64, str(db_submission.submission_id)
        )

        if not storage_ref:
            self.update_submission_status(db, db_submission.submission_id, 'REJECTED', 'Failed to store digital form.')
            return db_submission

        db_submission.digital_form_storage_ref = storage_ref
        db_submission.digital_form_checksum = checksum
        self.add_audit_log(db, db_submission.submission_id, 'STORAGE', f'Form stored at {storage_ref}')

        link_success = await core_banking_client.link_exemption_to_fds(
            submission.customer_pan, str(db_submission.submission_id)
        )

        if not link_success:
            self.update_submission_status(db, db_submission.submission_id, 'REJECTED', 'Failed to link exemption to FD accounts.')
            return db_submission

        # Set validity period (assuming financial year start/end)
        year = int(submission.financial_year.split('-')[0])
        db_submission.validity_period_start = date(year, 4, 1)
        db_submission.validity_period_end = date(year + 1, 3, 31)
        db_submission.estimated_tds_saving = 5000.00 # Mock value
        
        self.update_submission_status(db, db_submission.submission_id, 'SUBMITTED')
        db.commit()
        db.refresh(db_submission)
        return db_submission

submission_service = SubmissionService()
