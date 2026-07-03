from sqlalchemy.orm import Session
from server import models, schemas
from datetime import date, datetime
from uuid import UUID
from server.services.notifications import send_parent_notification


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        email=user.email,
        name=user.name,
        role=user.role,
        parent_email=user.parent_email,
        parent_phone=user.parent_phone,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_class(db: Session, name: str, grade: str, teacher_id: UUID):
    db_class = models.Class(name=name, grade=grade, teacher_id=teacher_id)
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class


def mark_attendance(
    db: Session, class_id: UUID, date_val: date, records: list, marked_by: UUID
):
    processed_count = 0
    for record in records:
        # Check if record already exists for this student, class, and date
        existing = (
            db.query(models.AttendanceRecord)
            .filter(
                models.AttendanceRecord.student_id == record.student_id,
                models.AttendanceRecord.class_id == class_id,
                models.AttendanceRecord.date == date_val,
            )
            .first()
        )

        if existing:
            existing.status = record.status
            existing.marked_by = marked_by
            existing.timestamp = datetime.utcnow()
            db_record = existing
            db.commit()
        else:
            db_record = models.AttendanceRecord(
                student_id=record.student_id,
                class_id=class_id,
                status=record.status,
                date=date_val,
                marked_by=marked_by,
            )
            db.add(db_record)
            db.commit()

        processed_count += 1

        # Trigger notification if Absent
        if record.status == "Absent":
            student = (
                db.query(models.User)
                .filter(models.User.id == record.student_id)
                .first()
            )
            if student:
                # Send Email if parent_email exists
                if student.parent_email:
                    status = send_parent_notification(
                        student.parent_email, student.name, "Absent", "Email"
                    )
                    notification = models.Notification(
                        attendance_record_id=db_record.id,
                        recipient=student.parent_email,
                        type="Email",
                        status=status,
                    )
                    db.add(notification)
                # Send SMS if parent_phone exists
                if student.parent_phone:
                    status = send_parent_notification(
                        student.parent_phone, student.name, "Absent", "SMS"
                    )
                    notification = models.Notification(
                        attendance_record_id=db_record.id,
                        recipient=student.parent_phone,
                        type="SMS",
                        status=status,
                    )
                    db.add(notification)
                db.commit()

    return processed_count


def get_attendance_records(db: Session, class_id: UUID = None, date_val: date = None):
    query = db.query(models.AttendanceRecord)
    if class_id:
        query = query.filter(models.AttendanceRecord.class_id == class_id)
    if date_val:
        query = query.filter(models.AttendanceRecord.date == date_val)

    records = query.all()
    results = []
    for r in records:
        # Find last notification status
        last_notif = (
            db.query(models.Notification)
            .filter(models.Notification.attendance_record_id == r.id)
            .order_by(models.Notification.sent_at.desc())
            .first()
        )

        last_notif_status = last_notif.status if last_notif else None

        results.append(
            {
                "id": r.id,
                "class_id": r.class_id,
                "student_id": r.student_id,
                "student_name": r.student.name if r.student else "Unknown",
                "status": r.status,
                "roll_no": str(r.student.email.split("@")[0]) if r.student else None,
                "timestamp": r.timestamp,
                "last_notification": last_notif_status,
            }
        )
    return results


def get_student_attendance_detail(db: Session, student_id: UUID):
    student = db.query(models.User).filter(models.User.id == student_id).first()
    if not student:
        return None

    records = (
        db.query(models.AttendanceRecord)
        .filter(models.AttendanceRecord.student_id == student_id)
        .all()
    )

    total_days = len(records)
    absences = sum(1 for r in records if r.status == "Absent")
    lates = sum(1 for r in records if r.status == "Late")
    presents = sum(1 for r in records if r.status == "Present")

    attendance_rate = (
        100.0 if total_days == 0 else ((presents + lates) / total_days) * 100.0
    )

    calendar = [{"date": r.date, "status": r.status} for r in records]

    # Get notifications
    notifications = []
    for r in records:
        notifs = (
            db.query(models.Notification)
            .filter(models.Notification.attendance_record_id == r.id)
            .all()
        )
        for n in notifs:
            notifications.append(
                {"id": n.id, "sent_at": n.sent_at, "status": n.status, "type": n.type}
            )

    return {
        "student_id": student.id,
        "student_name": student.name,
        "total_days": total_days,
        "absences": absences,
        "lates": lates,
        "attendance_rate": round(attendance_rate, 2),
        "calendar": calendar,
        "notifications": notifications,
    }
