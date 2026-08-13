import uuid
from typing import List, Dict, Set, Tuple, Optional
from sqlalchemy.orm import Session
from server import models, crud
from server.services.tiebreak_calculator import recalculate_standings


def generate_pairings_for_round(tournament_id: uuid.UUID, db: Session) -> models.Round:
    tournament = crud.get_tournament(db, tournament_id)
    if not tournament:
        raise ValueError("Tournament not found")

    # Check if existing round is still pending matches
    existing_rounds = (
        db.query(models.Round)
        .filter(models.Round.tournament_id == tournament_id)
        .order_by(models.Round.round_number.desc())
        .all()
    )

    if existing_rounds:
        latest_round = existing_rounds[0]
        # Check if any matches in latest round are pending
        pending_matches = (
            db.query(models.Match)
            .filter(
                models.Match.round_id == latest_round.id,
                models.Match.result == "PENDING",
            )
            .count()
        )
        if pending_matches > 0:
            raise ValueError(
                f"Cannot generate next round: Round {latest_round.round_number} has pending match results"
            )

    next_round_number = tournament.current_round + 1
    if next_round_number > tournament.total_rounds:
        raise ValueError("Tournament has reached maximum total rounds")

    # Ensure standings are up to date
    recalculate_standings(tournament_id, db)

    # Fetch active players and their current standings
    players = crud.get_tournament_players(db, tournament_id)
    if len(players) < 2:
        raise ValueError("At least 2 players are required for pairings")

    standings = crud.get_standings(db, tournament_id)
    standings_map = {s.player_id: s for s in standings}

    # Sort players by standing (total_points DESC, rating DESC, player_id)
    players_sorted = sorted(
        players,
        key=lambda p: (
            standings_map[p.id].total_points if p.id in standings_map else 0.0,
            p.rating if p.rating is not None else 1200,
            str(p.id),
        ),
        reverse=True,
    )

    # Collect past matchups and color histories
    past_matches = (
        db.query(models.Match)
        .join(models.Round)
        .filter(models.Round.tournament_id == tournament_id)
        .all()
    )

    played_pairs: Set[Tuple[uuid.UUID, uuid.UUID]] = set()
    bye_history: Set[uuid.UUID] = set()
    color_history: Dict[uuid.UUID, List[str]] = {p.id: [] for p in players}

    for m in past_matches:
        if m.is_bye and m.white_player_id:
            bye_history.add(m.white_player_id)
            continue

        if m.white_player_id and m.black_player_id:
            w, b = m.white_player_id, m.black_player_id
            played_pairs.add((w, b))
            played_pairs.add((b, w))
            if w in color_history:
                color_history[w].append("W")
            if b in color_history:
                color_history[b].append("B")

    pairing_pool = list(players_sorted)
    bye_match_player: Optional[models.Player] = None

    # Handle odd number of players
    if len(pairing_pool) % 2 != 0:
        # Find lowest-ranked eligible player who hasn't had a bye
        eligible_for_bye = [
            p for p in reversed(pairing_pool) if p.id not in bye_history
        ]
        if eligible_for_bye:
            bye_match_player = eligible_for_bye[0]
        else:
            # Fallback to lowest ranked player
            bye_match_player = pairing_pool[-1]

        pairing_pool.remove(bye_match_player)

    # Swiss Pairing matching algorithm
    paired_matches: List[Tuple[models.Player, models.Player]] = []

    def solve_pairings(
        pool: List[models.Player],
    ) -> Optional[List[Tuple[models.Player, models.Player]]]:
        if not pool:
            return []

        p1 = pool[0]
        rest = pool[1:]

        for i, p2 in enumerate(rest):
            if (p1.id, p2.id) not in played_pairs:
                remaining = rest[:i] + rest[i + 1 :]
                sub_res = solve_pairings(remaining)
                if sub_res is not None:
                    return [(p1, p2)] + sub_res
        return None

    solved = solve_pairings(pairing_pool)

    # Fallback if strict Swiss non-repeating failed (e.g. late rounds in small pool)
    if solved is None:
        solved = []
        temp_pool = list(pairing_pool)
        while len(temp_pool) >= 2:
            p1 = temp_pool.pop(0)
            # Find best match (prefer unplayed, then closest in score)
            best_idx = 0
            for idx, cand in enumerate(temp_pool):
                if (p1.id, cand.id) not in played_pairs:
                    best_idx = idx
                    break
            p2 = temp_pool.pop(best_idx)
            solved.append((p1, p2))

    paired_matches = solved

    # Create Round record
    new_round = models.Round(
        tournament_id=tournament_id,
        round_number=next_round_number,
        is_closed=False,
    )
    db.add(new_round)
    db.flush()

    board_num = 1
    # Create Match records
    for p1, p2 in paired_matches:
        # Determine colors based on color history
        w_count1 = color_history.get(p1.id, []).count("W")
        w_count2 = color_history.get(p2.id, []).count("W")

        # Give white to the one with fewer white games, or alternate
        if w_count1 < w_count2:
            white_p, black_p = p1, p2
        elif w_count2 < w_count1:
            white_p, black_p = p2, p1
        else:
            # Check last played color
            last_c1 = (
                color_history.get(p1.id, [])[-1] if color_history.get(p1.id) else None
            )
            if last_c1 == "W":
                white_p, black_p = p2, p1
            else:
                white_p, black_p = p1, p2

        match = models.Match(
            round_id=new_round.id,
            board_number=board_num,
            white_player_id=white_p.id,
            black_player_id=black_p.id,
            result="PENDING",
            is_bye=False,
        )
        db.add(match)
        board_num += 1

    # Create Bye match if odd players
    if bye_match_player:
        bye_match = models.Match(
            round_id=new_round.id,
            board_number=board_num,
            white_player_id=bye_match_player.id,
            black_player_id=None,
            result="BYE",
            is_bye=True,
        )
        db.add(bye_match)

    tournament.current_round = next_round_number
    tournament.status = "ACTIVE"
    db.commit()
    db.refresh(new_round)

    # Immediately recalculate standings so Bye awards 1.0 point
    recalculate_standings(tournament_id, db)

    return new_round
