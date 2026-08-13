import uuid
from typing import List, Optional
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
