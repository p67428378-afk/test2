from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from server.models import GameSession, Player, ScoreEntry
from server.schemas import (
    GameSessionCreate,
    GameSessionUpdate,
    PlayerCreate,
    ScoreEntryCreate,
    LeaderboardResponse,
    RankedPlayer,
    Winner,
)


# --- Game Session CRUD ---
def create_session(db: Session, session_in: GameSessionCreate) -> GameSession:
    db_session = GameSession(game_name=session_in.game_name, status="active")
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


def get_session(db: Session, session_id: str) -> Optional[GameSession]:
    return db.query(GameSession).filter(GameSession.id == session_id).first()


def list_sessions(db: Session, skip: int = 0, limit: int = 50) -> List[GameSession]:
    return (
        db.query(GameSession)
        .order_by(GameSession.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_session(
    db: Session, session_id: str, session_update: GameSessionUpdate
) -> Optional[GameSession]:
    db_session = get_session(db, session_id)
    if not db_session:
        return None

    if session_update.game_name is not None:
        db_session.game_name = session_update.game_name
    if session_update.status is not None:
        db_session.status = session_update.status

    db.commit()
    db.refresh(db_session)
    return db_session


def delete_session(db: Session, session_id: str) -> bool:
    db_session = get_session(db, session_id)
    if not db_session:
        return False
    db.delete(db_session)
    db.commit()
    return True


# --- Player CRUD ---
def create_player(db: Session, session_id: str, player_in: PlayerCreate) -> Player:
    db_player = Player(session_id=session_id, name=player_in.name)
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player


def get_player(db: Session, player_id: str) -> Optional[Player]:
    return db.query(Player).filter(Player.id == player_id).first()


def list_players_by_session(db: Session, session_id: str) -> List[Player]:
    return (
        db.query(Player)
        .filter(Player.session_id == session_id)
        .order_by(Player.created_at.asc())
        .all()
    )


def delete_player(db: Session, player_id: str) -> bool:
    db_player = get_player(db, player_id)
    if not db_player:
        return False
    db.delete(db_player)
    db.commit()
    return True


# --- Score Entry CRUD ---
def create_score_entry(
    db: Session, session_id: str, score_in: ScoreEntryCreate
) -> ScoreEntry:
    db_score = ScoreEntry(
        session_id=session_id,
        player_id=score_in.player_id,
        round_or_category=score_in.round_or_category or "Round 1",
        points=score_in.points,
    )
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score


def list_score_entries_by_session(db: Session, session_id: str) -> List[ScoreEntry]:
    return (
        db.query(ScoreEntry)
        .filter(ScoreEntry.session_id == session_id)
        .order_by(ScoreEntry.created_at.asc())
        .all()
    )


def delete_score_entry(db: Session, score_id: str) -> bool:
    db_score = db.query(ScoreEntry).filter(ScoreEntry.id == score_id).first()
    if not db_score:
        return False
    db.delete(db_score)
    db.commit()
    return True


# --- Leaderboard Calculation ---
def calculate_leaderboard(
    db: Session, session_id: str
) -> Optional[LeaderboardResponse]:
    session = get_session(db, session_id)
    if not session:
        return None

    players = list_players_by_session(db, session_id)
    score_entries = list_score_entries_by_session(db, session_id)

    # Aggregate scores per player
    totals_by_player: Dict[str, float] = {p.id: 0.0 for p in players}
    for entry in score_entries:
        if entry.player_id in totals_by_player:
            totals_by_player[entry.player_id] += float(entry.points)

    # Build player score mapping
    player_map = {p.id: p for p in players}

    # Sort players by total score descending, then by creation date ascending
    sorted_player_ids = sorted(
        players,
        key=lambda p: (
            totals_by_player[p.id],
            -p.created_at.timestamp() if p.created_at else 0,
        ),
        reverse=True,
    )

    if not sorted_player_ids:
        return LeaderboardResponse(
            session_id=session.id,
            game_name=session.game_name,
            status=session.status,
            ranked_players=[],
            winners=[],
        )

    max_score = max(totals_by_player.values()) if totals_by_player else 0.0

    ranked_players: List[RankedPlayer] = []
    current_rank = 1
    for idx, p in enumerate(sorted_player_ids):
        score = totals_by_player[p.id]
        if idx > 0:
            prev_p = sorted_player_ids[idx - 1]
            prev_score = totals_by_player[prev_p.id]
            if score < prev_score:
                current_rank = idx + 1  # Standard competition rank (1224)

        # A player is a winner if their score equals the maximum score
        is_winner = (score == max_score) and (len(players) > 0)
        ranked_players.append(
            RankedPlayer(
                player_id=p.id,
                name=p.name,
                total_score=score,
                rank=current_rank,
                is_winner=is_winner,
            )
        )

    winners = [
        Winner(player_id=rp.player_id, name=rp.name, total_score=rp.total_score)
        for rp in ranked_players
        if rp.is_winner
    ]

    return LeaderboardResponse(
        session_id=session.id,
        game_name=session.game_name,
        status=session.status,
        ranked_players=ranked_players,
        winners=winners,
    )
