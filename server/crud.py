"""CRUD and business logic operations for Aura Photography Studio Management System."""

from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session as DBSession

from server.models import (
    AddOn,
    Availability,
    ExtendedFeature,
    Package,
    Payment,
    Photographer,
    PhotoshootRecord,
    Session,
    SessionAddOn,
    User,
)
from server.schemas import (
    AvailabilityCreate,
    FeatureCreate,
    FeatureUpdate,
    PackageCreate,
    PackageUpdate,
    PaymentCreate,
    PhotoshootRecordCreate,
    SessionCreate,
    UserCreate,
)


# ----------------- User CRUD -----------------
def get_user_by_email(db: DBSession, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: DBSession, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: DBSession, user_in: UserCreate, hashed_password: str) -> User:
    user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        role=user_in.role,
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ----------------- Photographer CRUD -----------------
def get_photographers(db: DBSession, active_only: bool = True) -> List[Dict[str, Any]]:
    query = db.query(Photographer, User).join(User, Photographer.user_id == User.id)
    if active_only:
        query = query.filter(Photographer.is_active == True)  # noqa: E712
    results = query.all()
    out = []
    for photog, user in results:
        out.append(
            {
                "id": str(photog.id),
                "user_id": str(photog.user_id),
                "full_name": str(user.full_name),
                "email": str(user.email),
                "bio": photog.bio,
                "specialization": photog.specialization,
                "is_active": bool(photog.is_active),
                "created_at": photog.created_at,
                "updated_at": photog.updated_at,
            }
        )
    return out


def get_photographer_by_id(
    db: DBSession, photographer_id: str
) -> Optional[Dict[str, Any]]:
    res = (
        db.query(Photographer, User)
        .join(User, Photographer.user_id == User.id)
        .filter(Photographer.id == photographer_id)
        .first()
    )
    if not res:
        return None
    photog, user = res
    return {
        "id": str(photog.id),
        "user_id": str(photog.user_id),
        "full_name": str(user.full_name),
        "email": str(user.email),
        "bio": photog.bio,
        "specialization": photog.specialization,
        "is_active": bool(photog.is_active),
        "created_at": photog.created_at,
        "updated_at": photog.updated_at,
    }


def set_photographer_availability(
    db: DBSession, photographer_id: str, avail_in: AvailabilityCreate
) -> Dict[str, Any]:
    photog = db.query(Photographer).filter(Photographer.id == photographer_id).first()
    if not photog:
        raise HTTPException(status_code=404, detail="Photographer not found")

    warning: Optional[str] = None
    conflicting_sessions: List[Dict[str, Any]] = []

    # Check for conflicts if blocking a date
    if avail_in.is_blocked or avail_in.blocked_date:
        date_str = avail_in.blocked_date
        if date_str:
            # Check for existing confirmed or in_progress sessions on that date
            sessions_on_date = (
                db.query(Session, User)
                .join(User, Session.customer_id == User.id)
                .filter(
                    Session.photographer_id == photographer_id,
                    Session.status.in_(["Confirmed", "in_progress", "Pending Payment"]),
                )
                .all()
            )

            for s, u in sessions_on_date:
                s_date = s.start_time.strftime("%Y-%m-%d")
                if s_date == date_str:
                    conflicting_sessions.append(
                        {
                            "id": str(s.id),
                            "customer_name": str(u.full_name),
                            "time": s.start_time.strftime("%H:%M"),
                            "status": str(s.status),
                        }
                    )

            if conflicting_sessions:
                warning = f"⚠️ Conflict Alert: {date_str} has {len(conflicting_sessions)} booking session(s). Blocking this date requires rescheduling or admin override."

    new_avail = Availability(
        photographer_id=photographer_id,
        day_of_week=avail_in.day_of_week,
        start_time=avail_in.start_time,
        end_time=avail_in.end_time,
        blocked_date=avail_in.blocked_date,
        block_reason=avail_in.reason,
        is_blocked=avail_in.is_blocked,
    )
    db.add(new_avail)
    db.commit()
    db.refresh(new_avail)

    return {
        "id": str(new_avail.id),
        "photographer_id": str(new_avail.photographer_id),
        "day_of_week": new_avail.day_of_week,
        "start_time": new_avail.start_time,
        "end_time": new_avail.end_time,
        "blocked_date": new_avail.blocked_date,
        "block_reason": new_avail.block_reason,
        "is_blocked": bool(new_avail.is_blocked),
        "created_at": new_avail.created_at,
        "warning": warning,
        "conflicting_sessions": conflicting_sessions,
    }


def get_photographer_slots(
    db: DBSession, photographer_id: str, date_str: str
) -> List[Dict[str, Any]]:
    # Standard time slots
    standard_slots = [
        ("09:00", "10:00"),
        ("11:00", "12:00"),
        ("14:00", "15:00"),
        ("16:00", "17:00"),
    ]

    # Check if photographer blocked the entire date
    blocked = (
        db.query(Availability)
        .filter(
            Availability.photographer_id == photographer_id,
            Availability.blocked_date == date_str,
            Availability.is_blocked == True,  # noqa: E712
        )
        .first()
    )

    # Check existing sessions on date for this photographer
    now = datetime.utcnow()
    existing_sessions = (
        db.query(Session)
        .filter(
            Session.photographer_id == photographer_id,
            Session.status.in_(
                ["Confirmed", "in_progress", "completed", "Pending Payment"]
            ),
        )
        .all()
    )

    booked_times = set()
    for s in existing_sessions:
        # If Pending Payment, only counts if hold_expires_at is still in future
        if (
            s.status == "Pending Payment"
            and s.hold_expires_at
            and s.hold_expires_at < now
        ):
            continue  # Hold expired, slot is free
        if s.start_time.strftime("%Y-%m-%d") == date_str:
            booked_times.add(s.start_time.strftime("%H:%M"))

    slots_out = []
    for start, end in standard_slots:
        is_booked = start in booked_times
        is_blocked = blocked is not None
        is_available = not is_booked and not is_blocked

        reason = None
        if is_blocked and blocked:
            reason = blocked.block_reason or "Date Blocked"
        elif is_booked:
            reason = "Booked"

        slots_out.append(
            {
                "start_time": start,
                "end_time": end,
                "is_available": is_available,
                "is_blocked": is_blocked,
                "reason": reason,
            }
        )
    return slots_out


# ----------------- Package & Addon CRUD -----------------
def get_packages(db: DBSession) -> List[Package]:
    return db.query(Package).all()


def get_package_by_id(db: DBSession, package_id: str) -> Optional[Package]:
    return db.query(Package).filter(Package.id == package_id).first()


def create_package(db: DBSession, pkg_in: PackageCreate) -> Package:
    pkg = Package(**pkg_in.model_dump())
    db.add(pkg)
    db.commit()
    db.refresh(pkg)
    return pkg


def update_package(
    db: DBSession, package_id: str, pkg_in: PackageUpdate
) -> Optional[Package]:
    pkg = db.query(Package).filter(Package.id == package_id).first()
    if not pkg:
        return None
    for field, val in pkg_in.model_dump(exclude_unset=True).items():
        setattr(pkg, field, val)
    db.commit()
    db.refresh(pkg)
    return pkg


def delete_package(db: DBSession, package_id: str) -> bool:
    pkg = db.query(Package).filter(Package.id == package_id).first()
    if not pkg:
        return False
    db.delete(pkg)
    db.commit()
    return True


def get_addons(db: DBSession) -> List[AddOn]:
    return db.query(AddOn).all()


# ----------------- Session CRUD -----------------
def create_session(
    db: DBSession, session_in: SessionCreate, customer_id: str
) -> Session:
    now = datetime.utcnow()

    # Validate package
    pkg = db.query(Package).filter(Package.id == session_in.package_id).first()
    if not pkg:
        pkg = db.query(Package).first()
        if not pkg:
            raise HTTPException(status_code=404, detail="No packages available")

    # Validate photographer
    photog = (
        db.query(Photographer)
        .filter(Photographer.id == session_in.photographer_id)
        .first()
    )
    if not photog:
        photog = db.query(Photographer).first()
        if not photog:
            raise HTTPException(status_code=404, detail="No photographers available")

    # Double Booking Prevention Check
    start_time = session_in.start_time
    conflicting = (
        db.query(Session)
        .filter(
            Session.photographer_id == photog.id,
            Session.start_time == start_time,
            Session.status.in_(
                ["Confirmed", "in_progress", "completed", "Pending Payment"]
            ),
        )
        .all()
    )

    for s in conflicting:
        if (
            s.status == "Pending Payment"
            and s.hold_expires_at
            and s.hold_expires_at < now
        ):
            continue  # Expired hold, ignore
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Requested photographer time slot is no longer available or already reserved.",
        )

    # Calculate total price with add-ons
    addons_total: float = 0.0
    selected_addons: List[AddOn] = []
    if session_in.add_on_ids:
        for addon_id in session_in.add_on_ids:
            addon = db.query(AddOn).filter(AddOn.id == addon_id).first()
            if addon:
                addons_total += float(addon.price)  # type: ignore[arg-type]
                selected_addons.append(addon)

    base_price = float(pkg.price)  # type: ignore[arg-type]
    total_price = base_price + addons_total
    deposit_amount = round(total_price * 0.5, 2)
    duration = int(pkg.duration_minutes) if pkg.duration_minutes else 60  # type: ignore[arg-type]
    end_time = start_time + timedelta(minutes=duration)
    hold_expires_at = now + timedelta(minutes=15)

    session_obj = Session(
        customer_id=customer_id,
        photographer_id=photog.id,
        package_id=pkg.id,
        start_time=start_time,
        end_time=end_time,
        event_notes=session_in.event_notes,
        total_price=total_price,
        deposit_amount=deposit_amount,
        status="Pending Payment",
        hold_expires_at=hold_expires_at,
    )
    db.add(session_obj)
    db.flush()

    for add in selected_addons:
        db.add(
            SessionAddOn(
                session_id=session_obj.id,
                addon_id=add.id,
                price_at_booking=float(add.price),  # type: ignore[arg-type]
            )
        )

    db.commit()
    db.refresh(session_obj)
    return session_obj


def format_session_out(s: Session) -> Dict[str, Any]:
    total_paid = sum(
        float(p.amount) for p in s.payments if p.payment_status in ["Paid", "Partial"]
    )  # type: ignore[arg-type]
    remaining = max(0.0, round(float(s.total_price) - total_paid, 2))  # type: ignore[arg-type]

    customer_name = s.customer.full_name if s.customer else "Studio Client"
    package_name = s.package.name if s.package else "Custom Package"
    photographer_name = (
        s.photographer.user.full_name
        if (s.photographer and s.photographer.user)
        else "Photographer"
    )

    photoshoot_dict = None
    if s.photoshoot_record:
        photoshoot_dict = {
            "id": str(s.photoshoot_record.id),
            "session_id": str(s.photoshoot_record.session_id),
            "gallery_url": s.photoshoot_record.gallery_url,
            "notes": s.photoshoot_record.notes,
            "is_completed": bool(s.photoshoot_record.is_completed),
            "unpaid_balance_warning": bool(s.photoshoot_record.unpaid_balance_warning),
            "created_at": s.photoshoot_record.created_at,
            "updated_at": s.photoshoot_record.updated_at,
        }

    return {
        "id": str(s.id),
        "customer_id": str(s.customer_id),
        "photographer_id": str(s.photographer_id),
        "package_id": str(s.package_id),
        "start_time": s.start_time,
        "end_time": s.end_time,
        "event_notes": s.event_notes,
        "total_price": float(s.total_price),  # type: ignore[arg-type]
        "deposit_amount": float(s.deposit_amount),  # type: ignore[arg-type]
        "status": str(s.status),
        "hold_expires_at": s.hold_expires_at,
        "created_at": s.created_at,
        "updated_at": s.updated_at,
        "customer_name": customer_name,
        "package_name": package_name,
        "photographer_name": photographer_name,
        "remaining_balance": remaining,
        "photoshoot_record": photoshoot_dict,
    }


def get_sessions(
    db: DBSession, status_filter: Optional[str] = None
) -> List[Dict[str, Any]]:
    query = db.query(Session)
    if status_filter:
        query = query.filter(Session.status == status_filter)
    sessions = query.order_by(Session.created_at.desc()).all()
    return [format_session_out(s) for s in sessions]


def get_session_by_id(db: DBSession, session_id: str) -> Optional[Dict[str, Any]]:
    s = db.query(Session).filter(Session.id == session_id).first()
    if not s:
        return None
    return format_session_out(s)


def update_session_status(
    db: DBSession, session_id: str, new_status: str
) -> Optional[Dict[str, Any]]:
    s = db.query(Session).filter(Session.id == session_id).first()
    if not s:
        return None
    setattr(s, "status", new_status)
    db.commit()
    db.refresh(s)
    return format_session_out(s)


# ----------------- Payment CRUD -----------------
def process_payment(db: DBSession, pmt_in: PaymentCreate) -> Dict[str, Any]:
    session_obj = db.query(Session).filter(Session.id == pmt_in.session_id).first()
    if not session_obj:
        raise HTTPException(status_code=404, detail="Session not found for payment")

    # Calculate previous total paid
    prev_paid = sum(
        float(p.amount)
        for p in session_obj.payments
        if p.payment_status in ["Paid", "Partial"]
    )  # type: ignore[arg-type]
    new_total_paid = prev_paid + float(pmt_in.amount)
    remaining = max(0.0, round(float(session_obj.total_price) - new_total_paid, 2))  # type: ignore[arg-type]

    # Payment status calculation
    if new_total_paid >= float(session_obj.total_price):  # type: ignore[arg-type]
        pmt_status = "Paid"
        setattr(session_obj, "status", "Confirmed")
    elif new_total_paid >= float(session_obj.deposit_amount):  # type: ignore[arg-type]
        pmt_status = "Partial"
        setattr(session_obj, "status", "Confirmed")
    else:
        pmt_status = "Partial"
        setattr(session_obj, "status", "Pending Payment")

    payment = Payment(
        session_id=session_obj.id,
        amount=pmt_in.amount,
        payment_method=pmt_in.payment_method,
        payment_status=pmt_status,
        transaction_reference=pmt_in.transaction_reference
        or f"TXN-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    return {
        "id": str(payment.id),
        "session_id": str(payment.session_id),
        "amount": float(payment.amount),  # type: ignore[arg-type]
        "payment_method": str(payment.payment_method),
        "payment_status": str(payment.payment_status),
        "transaction_reference": payment.transaction_reference,
        "session_status": str(session_obj.status),
        "remaining_balance": remaining,
        "created_at": payment.created_at,
        "updated_at": payment.updated_at,
    }


def get_payments(
    db: DBSession, session_id: Optional[str] = None
) -> List[Dict[str, Any]]:
    query = db.query(Payment)
    if session_id:
        query = query.filter(Payment.session_id == session_id)
    payments = query.order_by(Payment.created_at.desc()).all()
    out = []
    for p in payments:
        out.append(
            {
                "id": str(p.id),
                "session_id": str(p.session_id),
                "amount": float(p.amount),  # type: ignore[arg-type]
                "payment_method": str(p.payment_method),
                "payment_status": str(p.payment_status),
                "transaction_reference": p.transaction_reference,
                "session_status": str(p.session.status) if p.session else None,
                "remaining_balance": None,
                "created_at": p.created_at,
                "updated_at": p.updated_at,
            }
        )
    return out


# ----------------- Photoshoot Record CRUD -----------------
def create_or_update_photoshoot_record(
    db: DBSession, session_id: str, record_in: PhotoshootRecordCreate
) -> Dict[str, Any]:
    session_obj = db.query(Session).filter(Session.id == session_id).first()
    if not session_obj:
        raise HTTPException(status_code=404, detail="Session not found")

    total_paid = sum(
        float(p.amount)
        for p in session_obj.payments
        if p.payment_status in ["Paid", "Partial"]
    )  # type: ignore[arg-type]
    remaining_balance = round(float(session_obj.total_price) - total_paid, 2)  # type: ignore[arg-type]
    has_unpaid_balance = remaining_balance > 0.0

    existing_record = (
        db.query(PhotoshootRecord)
        .filter(PhotoshootRecord.session_id == session_id)
        .first()
    )

    if existing_record:
        setattr(existing_record, "gallery_url", record_in.gallery_url)
        setattr(existing_record, "notes", record_in.notes)
        setattr(existing_record, "is_completed", record_in.is_completed)
        setattr(existing_record, "unpaid_balance_warning", has_unpaid_balance)
        record = existing_record
    else:
        record = PhotoshootRecord(
            session_id=session_id,
            gallery_url=record_in.gallery_url,
            notes=record_in.notes,
            is_completed=record_in.is_completed,
            unpaid_balance_warning=has_unpaid_balance,
        )
        db.add(record)

    if record_in.is_completed:
        setattr(session_obj, "status", "completed")

    db.commit()
    db.refresh(record)

    return {
        "id": str(record.id),
        "session_id": str(record.session_id),
        "gallery_url": record.gallery_url,
        "notes": record.notes,
        "is_completed": bool(record.is_completed),
        "unpaid_balance_warning": bool(record.unpaid_balance_warning),
        "created_at": record.created_at,
        "updated_at": record.updated_at,
    }


def get_photoshoot_record_by_session(
    db: DBSession, session_id: str
) -> Optional[Dict[str, Any]]:
    record = (
        db.query(PhotoshootRecord)
        .filter(PhotoshootRecord.session_id == session_id)
        .first()
    )
    if not record:
        return None
    return {
        "id": str(record.id),
        "session_id": str(record.session_id),
        "gallery_url": record.gallery_url,
        "notes": record.notes,
        "is_completed": bool(record.is_completed),
        "unpaid_balance_warning": bool(record.unpaid_balance_warning),
        "created_at": record.created_at,
        "updated_at": record.updated_at,
    }


def get_all_photoshoot_records(db: DBSession) -> List[Dict[str, Any]]:
    records = db.query(PhotoshootRecord).all()
    return [
        {
            "id": str(r.id),
            "session_id": str(r.session_id),
            "gallery_url": r.gallery_url,
            "notes": r.notes,
            "is_completed": bool(r.is_completed),
            "unpaid_balance_warning": bool(r.unpaid_balance_warning),
            "created_at": r.created_at,
            "updated_at": r.updated_at,
        }
        for r in records
    ]


# ----------------- Extended Features CRUD -----------------
def get_features(
    db: DBSession, skip: int = 0, limit: int = 20
) -> List[ExtendedFeature]:
    return db.query(ExtendedFeature).offset(skip).limit(limit).all()


def get_feature_by_id(db: DBSession, feature_id: str) -> Optional[ExtendedFeature]:
    return db.query(ExtendedFeature).filter(ExtendedFeature.id == feature_id).first()


def create_feature(db: DBSession, feat_in: FeatureCreate) -> ExtendedFeature:
    existing = (
        db.query(ExtendedFeature)
        .filter(ExtendedFeature.feature_name == feat_in.feature_name)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Feature with name '{feat_in.feature_name}' already exists.",
        )

    feat = ExtendedFeature(
        feature_name=feat_in.feature_name,
        configuration=str(feat_in.configuration),
        status=feat_in.status or "Active",
    )
    db.add(feat)
    db.commit()
    db.refresh(feat)
    return feat


def update_feature(
    db: DBSession, feature_id: str, feat_in: FeatureUpdate
) -> Optional[ExtendedFeature]:
    feat = db.query(ExtendedFeature).filter(ExtendedFeature.id == feature_id).first()
    if not feat:
        return None
    if feat_in.feature_name is not None:
        setattr(feat, "feature_name", feat_in.feature_name)
    if feat_in.configuration is not None:
        setattr(feat, "configuration", str(feat_in.configuration))
    if feat_in.status is not None:
        setattr(feat, "status", feat_in.status)
    db.commit()
    db.refresh(feat)
    return feat


def delete_feature(db: DBSession, feature_id: str) -> bool:
    feat = db.query(ExtendedFeature).filter(ExtendedFeature.id == feature_id).first()
    if not feat:
        return False
    db.delete(feat)
    db.commit()
    return True
