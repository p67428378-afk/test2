import calendar
from datetime import date
import uuid
from typing import List, Optional
from sqlalchemy import func
from sqlalchemy.orm import Session
from server import models, schemas


# User CRUD
def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


# Tournament CRUD
def create_tournament(
    db: Session, tournament_in: schemas.TournamentCreate
) -> models.Tournament:
    tournament = models.Tournament(
        name=tournament_in.name,
        total_rounds=tournament_in.total_rounds,
        status="DRAFT",
        current_round=0,
    )
    db.add(tournament)
    db.commit()
    db.refresh(tournament)
    return tournament


def get_tournament(
    db: Session, tournament_id: uuid.UUID
) -> Optional[models.Tournament]:
    return (
        db.query(models.Tournament)
        .filter(models.Tournament.id == tournament_id)
        .first()
    )


def list_tournaments(
    db: Session, skip: int = 0, limit: int = 100
) -> List[models.Tournament]:
    return db.query(models.Tournament).offset(skip).limit(limit).all()


# Player & Registration CRUD
def register_player(
    db: Session, player_in: schemas.PlayerCreate, tournament_id: uuid.UUID
) -> models.Player:
    # Check if email is already registered in this tournament
    existing_reg = (
        db.query(models.Registration)
        .join(models.Player)
        .filter(
            models.Registration.tournament_id == tournament_id,
            models.Player.email == player_in.email,
        )
        .first()
    )
    if existing_reg:
        raise ValueError("Player email already registered in this tournament")

    # Check if player exists globally, else create
    player = (
        db.query(models.Player).filter(models.Player.email == player_in.email).first()
    )
    if not player:
        player = models.Player(
            full_name=player_in.full_name,
            email=player_in.email,
            rating=player_in.rating if player_in.rating is not None else 1200,
            fide_id=player_in.fide_id,
        )
        db.add(player)
        db.flush()

    # Create registration
    reg = models.Registration(
        tournament_id=tournament_id,
        player_id=player.id,
        status="ACTIVE",
    )
    db.add(reg)

    # Initialize standing entry
    existing_standing = (
        db.query(models.Standing)
        .filter(
            models.Standing.tournament_id == tournament_id,
            models.Standing.player_id == player.id,
        )
        .first()
    )
    if not existing_standing:
        standing = models.Standing(
            tournament_id=tournament_id,
            player_id=player.id,
            total_points=0.0,
            buchholz=0.0,
            sonneborn_berger=0.0,
        )
        db.add(standing)

    db.commit()
    db.refresh(player)
    return player


def get_tournament_players(
    db: Session, tournament_id: uuid.UUID
) -> List[models.Player]:
    return (
        db.query(models.Player)
        .join(models.Registration, models.Registration.player_id == models.Player.id)
        .filter(
            models.Registration.tournament_id == tournament_id,
            models.Registration.status == "ACTIVE",
        )
        .all()
    )


def get_player(db: Session, player_id: uuid.UUID) -> Optional[models.Player]:
    return db.query(models.Player).filter(models.Player.id == player_id).first()


# Round & Match CRUD
def get_round(db: Session, round_id: uuid.UUID) -> Optional[models.Round]:
    return db.query(models.Round).filter(models.Round.id == round_id).first()


def get_match(db: Session, match_id: uuid.UUID) -> Optional[models.Match]:
    return db.query(models.Match).filter(models.Match.id == match_id).first()


# Standing CRUD
def get_standings(db: Session, tournament_id: uuid.UUID) -> List[models.Standing]:
    return (
        db.query(models.Standing)
        .filter(models.Standing.tournament_id == tournament_id)
        .all()
    )


# Certificate CRUD
def get_certificate_by_uuid(
    db: Session, verification_uuid: uuid.UUID
) -> Optional[models.Certificate]:
    return (
        db.query(models.Certificate)
        .filter(models.Certificate.verification_uuid == verification_uuid)
        .first()
    )


# Expense CRUD
def create_expense(db: Session, expense_in: schemas.ExpenseCreate) -> models.Expense:
    expense = models.Expense(
        amount=expense_in.amount,
        category=expense_in.category,
        date=expense_in.date,
        description=expense_in.description,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


def get_expense(db: Session, expense_id: uuid.UUID) -> Optional[models.Expense]:
    return db.query(models.Expense).filter(models.Expense.id == expense_id).first()


def get_expenses(
    db: Session,
    month: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[models.Expense]:
    query = db.query(models.Expense)

    if month and month.strip() not in ("", "All", "All Months"):
        try:
            parts = month.strip().split("-")
            year = int(parts[0])
            m = int(parts[1])
            first_day = date(year, m, 1)
            last_day_num = calendar.monthrange(year, m)[1]
            last_day = date(year, m, last_day_num)
            query = query.filter(
                models.Expense.date >= first_day, models.Expense.date <= last_day
            )
        except Exception:
            pass
    elif start_date or end_date:
        if start_date:
            query = query.filter(models.Expense.date >= start_date)
        if end_date:
            query = query.filter(models.Expense.date <= end_date)

    return (
        query.order_by(models.Expense.date.desc(), models.Expense.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_expense(
    db: Session, expense_id: uuid.UUID, expense_in: schemas.ExpenseUpdate
) -> Optional[models.Expense]:
    expense = get_expense(db, expense_id)
    if not expense:
        return None

    update_data = expense_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)

    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


def delete_expense(db: Session, expense_id: uuid.UUID) -> bool:
    expense = get_expense(db, expense_id)
    if not expense:
        return False
    db.delete(expense)
    db.commit()
    return True


def get_dashboard_summary(
    db: Session, month: Optional[str] = None
) -> schemas.DashboardSummaryResponse:
    # 1. Total expenses across all time
    total_all = db.query(func.sum(models.Expense.amount)).scalar() or 0.0

    # 2. Monthly total
    filter_start = None
    filter_end = None
    active_month_str = (
        month.strip()
        if month and month.strip() not in ("", "All", "All Months")
        else "All Months"
    )

    if active_month_str != "All Months":
        try:
            parts = active_month_str.split("-")
            year = int(parts[0])
            m = int(parts[1])
            filter_start = date(year, m, 1)
            last_day_num = calendar.monthrange(year, m)[1]
            filter_end = date(year, m, last_day_num)
        except Exception:
            active_month_str = "All Months"

    if filter_start and filter_end:
        m_total = (
            db.query(func.sum(models.Expense.amount))
            .filter(
                models.Expense.date >= filter_start, models.Expense.date <= filter_end
            )
            .scalar()
            or 0.0
        )
    else:
        m_total = total_all

    # 3. Category breakdown
    cat_query = db.query(
        models.Expense.category,
        func.sum(models.Expense.amount).label("cat_total"),
    )
    if filter_start and filter_end:
        cat_query = cat_query.filter(
            models.Expense.date >= filter_start, models.Expense.date <= filter_end
        )
    cat_results = cat_query.group_by(models.Expense.category).all()

    effective_total = m_total if (filter_start and filter_end) else total_all

    category_breakdown = []
    for cat_name, cat_total in cat_results:
        cat_amount = float(cat_total or 0.0)
        percentage = (
            round((cat_amount / effective_total) * 100, 2)
            if effective_total > 0
            else 0.0
        )
        category_breakdown.append(
            schemas.CategoryBreakdownItem(
                category=cat_name,
                amount=round(cat_amount, 2),
                percentage=percentage,
            )
        )

    return schemas.DashboardSummaryResponse(
        active_month=active_month_str,
        monthly_total=round(float(m_total), 2),
        total_expenses=round(float(total_all), 2),
        category_breakdown=category_breakdown,
    )
