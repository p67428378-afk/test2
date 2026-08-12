from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from server import models, schemas
from server.core.security import get_password_hash
from datetime import datetime, timedelta, time
import uuid


# Helper to convert string to UUID if needed
def _to_uuid(val):
    if isinstance(val, str):
        return uuid.UUID(val)
    return val


# Existing Password Reset CRUD
def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(
        user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at
    )
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
    db_password_history = models.PasswordHistory(
        user_id=user_id, hashed_password=hashed_password
    )
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history


def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user


# User CRUD
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id):
    return db.query(models.User).filter(models.User.id == _to_uuid(user_id)).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, db_user: models.User, user_update: schemas.UserUpdate):
    update_data = user_update.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    for key, value in update_data.items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user


# Book CRUD
def get_book_by_id(db: Session, book_id):
    return db.query(models.Book).filter(models.Book.id == _to_uuid(book_id)).first()


def get_book_by_isbn(db: Session, isbn: str):
    return db.query(models.Book).filter(models.Book.isbn == isbn).first()


def get_books(
    db: Session, search: str = None, genre: str = None, skip: int = 0, limit: int = 100
):
    query = db.query(models.Book)
    if search:
        query = query.filter(
            or_(
                models.Book.title.ilike(f"%{search}%"),
                models.Book.author.ilike(f"%{search}%"),
                models.Book.isbn.ilike(f"%{search}%"),
            )
        )
    if genre:
        query = query.filter(models.Book.genre.ilike(f"%{genre}%"))
    return query.offset(skip).limit(limit).all()


def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(
        title=book.title,
        author=book.author,
        isbn=book.isbn,
        genre=book.genre,
        publication_year=book.publication_year,
        total_copies=book.total_copies,
        available_copies=book.total_copies,
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def update_book(db: Session, db_book: models.Book, book_update: schemas.BookUpdate):
    update_data = book_update.dict(exclude_unset=True)

    if "total_copies" in update_data:
        diff = update_data["total_copies"] - db_book.total_copies
        db_book.available_copies = max(0, db_book.available_copies + diff)

    for key, value in update_data.items():
        setattr(db_book, key, value)
    db.commit()
    db.refresh(db_book)
    return db_book


def delete_book(db: Session, db_book: models.Book):
    db.delete(db_book)
    db.commit()


# Loan CRUD
def get_loan_by_id(db: Session, loan_id):
    return db.query(models.Loan).filter(models.Loan.id == _to_uuid(loan_id)).first()


def get_loans(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Loan).offset(skip).limit(limit).all()


def get_member_loans(db: Session, member_id, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Loan)
        .filter(models.Loan.member_id == _to_uuid(member_id))
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_loan(db: Session, loan: schemas.LoanCreate):
    due_date = datetime.utcnow() + timedelta(days=14)
    db_loan = models.Loan(
        book_id=_to_uuid(loan.book_id),
        member_id=_to_uuid(loan.member_id),
        due_date=due_date,
    )
    db.add(db_loan)

    db_book = get_book_by_id(db, loan.book_id)
    if db_book:
        db_book.available_copies = max(0, db_book.available_copies - 1)

    db.commit()
    db.refresh(db_loan)
    return db_loan


def return_loan(db: Session, db_loan: models.Loan):
    db_loan.return_date = datetime.utcnow()

    db_book = get_book_by_id(db, db_loan.book_id)
    if db_book:
        db_book.available_copies = min(
            db_book.total_copies, db_book.available_copies + 1
        )

    db.commit()
    db.refresh(db_loan)
    return db_loan


# Fine CRUD
def get_fines(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Fine).offset(skip).limit(limit).all()


def create_fine(db: Session, loan_id, amount: float):
    db_fine = models.Fine(
        loan_id=_to_uuid(loan_id), amount=amount, status="outstanding"
    )
    db.add(db_fine)
    db.commit()
    db.refresh(db_fine)
    return db_fine


def pay_fine(db: Session, db_fine: models.Fine):
    db_fine.status = "paid"
    db.commit()
    db.refresh(db_fine)
    return db_fine


# Inventory Item CRUD
def get_inventory_item_by_id(db: Session, item_id):
    return (
        db.query(models.InventoryItem)
        .filter(models.InventoryItem.item_id == _to_uuid(item_id))
        .first()
    )


def get_inventory_items(
    db: Session,
    search: str = None,
    category: str = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(models.InventoryItem)
    if search:
        query = query.filter(
            or_(
                models.InventoryItem.name.ilike(f"%{search}%"),
                models.InventoryItem.supplier.ilike(f"%{search}%"),
                models.InventoryItem.category.ilike(f"%{search}%"),
            )
        )
    if category:
        query = query.filter(models.InventoryItem.category.ilike(f"%{category}%"))
    return query.offset(skip).limit(limit).all()


def create_inventory_item(db: Session, item: schemas.InventoryItemCreate):
    db_item = models.InventoryItem(
        name=item.name,
        description=item.description,
        quantity=item.quantity,
        unit=item.unit,
        supplier=item.supplier,
        category=item.category,
        low_stock_threshold=item.low_stock_threshold,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_inventory_item(
    db: Session,
    db_item: models.InventoryItem,
    item_update: schemas.InventoryItemUpdate,
):
    update_data = item_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item


def delete_inventory_item(db: Session, db_item: models.InventoryItem):
    db.delete(db_item)
    db.commit()


# Screen Time Monitoring Application CRUD


def get_screentime_sessions(
    db: Session,
    user_id,
    skip: int = 0,
    limit: int = 100,
    app_name: str = None,
    category: str = None,
    start_date: datetime = None,
    end_date: datetime = None,
):
    query = db.query(models.ScreentimeSession).filter(
        models.ScreentimeSession.user_id == _to_uuid(user_id)
    )
    if app_name:
        query = query.filter(models.ScreentimeSession.app_name.ilike(f"%{app_name}%"))
    if category:
        query = query.filter(models.ScreentimeSession.category.ilike(f"%{category}%"))
    if start_date:
        query = query.filter(models.ScreentimeSession.start_time >= start_date)
    if end_date:
        query = query.filter(models.ScreentimeSession.start_time <= end_date)

    return (
        query.order_by(models.ScreentimeSession.start_time.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def count_screentime_sessions(db: Session, user_id):
    return (
        db.query(models.ScreentimeSession)
        .filter(models.ScreentimeSession.user_id == _to_uuid(user_id))
        .count()
    )


def create_screentime_session(
    db: Session, user_id, session_data: schemas.SessionCreate, duration_seconds: int
):
    db_session = models.ScreentimeSession(
        user_id=_to_uuid(user_id),
        app_name=session_data.app_name,
        category=session_data.category or "Uncategorized",
        start_time=session_data.start_time,
        end_time=session_data.end_time,
        duration_seconds=duration_seconds,
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


def delete_screentime_session(db: Session, session_id, user_id):
    db_session = (
        db.query(models.ScreentimeSession)
        .filter(
            models.ScreentimeSession.id == _to_uuid(session_id),
            models.ScreentimeSession.user_id == _to_uuid(user_id),
        )
        .first()
    )
    if db_session:
        db.delete(db_session)
        db.commit()
        return True
    return False


def clear_user_screentime_sessions(db: Session, user_id):
    db.query(models.ScreentimeSession).filter(
        models.ScreentimeSession.user_id == _to_uuid(user_id)
    ).delete(synchronize_session=False)
    db.commit()


def get_todays_usage_for_target(db: Session, user_id, target_name: str) -> int:
    """Calculate cumulative duration in seconds for today (UTC) matching app_name or category."""
    now = datetime.utcnow()
    today_start = datetime.combine(now.date(), time.min)
    today_end = datetime.combine(now.date(), time.max)

    total_seconds = (
        db.query(func.coalesce(func.sum(models.ScreentimeSession.duration_seconds), 0))
        .filter(
            models.ScreentimeSession.user_id == _to_uuid(user_id),
            models.ScreentimeSession.start_time >= today_start,
            models.ScreentimeSession.start_time <= today_end,
            or_(
                models.ScreentimeSession.app_name.ilike(target_name),
                models.ScreentimeSession.category.ilike(target_name),
            ),
        )
        .scalar()
    )
    return int(total_seconds or 0)


def get_usage_limits(db: Session, user_id):
    return (
        db.query(models.UsageLimit)
        .filter(models.UsageLimit.user_id == _to_uuid(user_id))
        .order_by(models.UsageLimit.created_at.desc())
        .all()
    )


def get_usage_limit_by_id(db: Session, limit_id, user_id):
    return (
        db.query(models.UsageLimit)
        .filter(
            models.UsageLimit.id == _to_uuid(limit_id),
            models.UsageLimit.user_id == _to_uuid(user_id),
        )
        .first()
    )


def create_or_update_usage_limit(db: Session, user_id, limit_data: schemas.LimitCreate):
    target = limit_data.category_or_app.strip()
    db_limit = (
        db.query(models.UsageLimit)
        .filter(
            models.UsageLimit.user_id == _to_uuid(user_id),
            func.lower(models.UsageLimit.category_or_app) == target.lower(),
        )
        .first()
    )

    if db_limit:
        db_limit.daily_limit_seconds = limit_data.daily_limit_seconds
        db_limit.updated_at = datetime.utcnow()
    else:
        db_limit = models.UsageLimit(
            user_id=_to_uuid(user_id),
            category_or_app=target,
            daily_limit_seconds=limit_data.daily_limit_seconds,
        )
        db.add(db_limit)

    db.commit()
    db.refresh(db_limit)
    return db_limit


def delete_usage_limit(db: Session, limit_id, user_id):
    db_limit = get_usage_limit_by_id(db, limit_id, user_id)
    if db_limit:
        db.delete(db_limit)
        db.commit()
        return True
    return False


def get_user_limits(db: Session, user_id):
    limits = get_usage_limits(db, user_id)
    result = []
    for item_lim in limits:
        current_usage = get_todays_usage_for_target(
            db, user_id, item_lim.category_or_app
        )
        pct = (
            round((current_usage / item_lim.daily_limit_seconds) * 100, 2)
            if item_lim.daily_limit_seconds > 0
            else 0.0
        )

        res_item = schemas.LimitResponse(
            id=item_lim.id,
            user_id=item_lim.user_id,
            category_or_app=item_lim.category_or_app,
            daily_limit_seconds=item_lim.daily_limit_seconds,
            current_usage_seconds=current_usage,
            percentage_used=pct,
            created_at=item_lim.created_at,
            updated_at=item_lim.updated_at,
        )
        result.append(res_item)
    return result


def create_or_update_limit(db: Session, user_id, limit_in: schemas.LimitCreate):
    db_limit = create_or_update_usage_limit(db, user_id, limit_in)
    current_usage = get_todays_usage_for_target(db, user_id, db_limit.category_or_app)
    pct = (
        round((current_usage / db_limit.daily_limit_seconds) * 100, 2)
        if db_limit.daily_limit_seconds > 0
        else 0.0
    )

    return schemas.LimitResponse(
        id=db_limit.id,
        user_id=db_limit.user_id,
        category_or_app=db_limit.category_or_app,
        daily_limit_seconds=db_limit.daily_limit_seconds,
        current_usage_seconds=current_usage,
        percentage_used=pct,
        created_at=db_limit.created_at,
        updated_at=db_limit.updated_at,
    )


def get_screentime_analytics(
    db: Session,
    user_id,
    period: str = "daily",
    start_date: str = None,
    end_date: str = None,
):
    query = db.query(models.ScreentimeSession).filter(
        models.ScreentimeSession.user_id == _to_uuid(user_id)
    )

    if start_date:
        try:
            sd = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
            query = query.filter(models.ScreentimeSession.start_time >= sd)
        except Exception:
            pass
    if end_date:
        try:
            ed = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
            query = query.filter(models.ScreentimeSession.end_time <= ed)
        except Exception:
            pass

    sessions = query.all()

    total_seconds = sum(s.duration_seconds for s in sessions)

    app_durations = {}
    for s in sessions:
        app_durations[s.app_name] = (
            app_durations.get(s.app_name, 0) + s.duration_seconds
        )

    top_applications = []
    for app_name, dur in sorted(
        app_durations.items(), key=lambda x: x[1], reverse=True
    ):
        pct = round((dur / total_seconds) * 100, 2) if total_seconds > 0 else 0.0
        top_applications.append(
            schemas.AnalyticsTopApp(
                app_name=app_name, duration_seconds=dur, percentage=pct
            )
        )

    cat_durations = {}
    for s in sessions:
        cat_durations[s.category] = (
            cat_durations.get(s.category, 0) + s.duration_seconds
        )

    category_breakdown = []
    for cat_name, dur in sorted(
        cat_durations.items(), key=lambda x: x[1], reverse=True
    ):
        pct = round((dur / total_seconds) * 100, 2) if total_seconds > 0 else 0.0
        category_breakdown.append(
            schemas.AnalyticsCategoryBreakdown(
                category=cat_name, duration_seconds=dur, percentage=pct
            )
        )

    start_date_str = (
        start_date if start_date else (datetime.utcnow().strftime("%Y-%m-%d"))
    )
    end_date_str = end_date if end_date else (datetime.utcnow().strftime("%Y-%m-%d"))

    return schemas.AnalyticsResponse(
        period=period,
        start_date=start_date_str,
        end_date=end_date_str,
        total_screen_time_seconds=total_seconds,
        top_applications=top_applications,
        category_breakdown=category_breakdown,
    )


def get_screentime_export(db: Session, user_id):
    total_count = count_screentime_sessions(db, user_id)

    if total_count > 10000:
        return schemas.ExportResponse(
            export_type="asynchronous",
            total_records=total_count,
            status="processing",
            message="Export dataset exceeds 10,000 logs. Background compilation initiated.",
            task_id=f"exp-{uuid.uuid4().hex[:12]}",
            user_id=str(user_id),
            generated_at=datetime.utcnow().isoformat() + "Z",
        )
    else:
        sessions = get_screentime_sessions(db, user_id, limit=10000)
        limits = get_usage_limits(db, user_id)

        sessions_data = [
            {
                "id": str(s.id),
                "app_name": s.app_name,
                "category": s.category,
                "start_time": s.start_time.isoformat() if s.start_time else None,
                "end_time": s.end_time.isoformat() if s.end_time else None,
                "duration_seconds": s.duration_seconds,
                "created_at": s.created_at.isoformat() if s.created_at else None,
            }
            for s in sessions
        ]

        limits_data = [
            {
                "id": str(lim_item.id),
                "category_or_app": lim_item.category_or_app,
                "daily_limit_seconds": lim_item.daily_limit_seconds,
                "created_at": lim_item.created_at.isoformat()
                if lim_item.created_at
                else None,
            }
            for lim_item in limits
        ]

        return schemas.ExportResponse(
            export_type="synchronous",
            total_records=total_count,
            user_id=str(user_id),
            generated_at=datetime.utcnow().isoformat() + "Z",
            sessions=sessions_data,
            limits=limits_data,
        )
