import uuid
from typing import Dict, List, Tuple
from sqlalchemy.orm import Session
from server import models, crud


def recalculate_standings(
    tournament_id: uuid.UUID, db: Session
) -> List[models.Standing]:
    # Get all active players in tournament
    players = crud.get_tournament_players(db, tournament_id)
    if not players:
        return []

    player_ids = {p.id for p in players}

    # Fetch all matches in this tournament
    matches = (
        db.query(models.Match)
        .join(models.Round)
        .filter(models.Round.tournament_id == tournament_id)
        .all()
    )

    # Initialize score maps
    points: Dict[uuid.UUID, float] = {pid: 0.0 for pid in player_ids}
    opponents_map: Dict[uuid.UUID, List[Tuple[uuid.UUID, str]]] = {
        pid: [] for pid in player_ids
    }

    # First pass: Calculate total points for all players
    for m in matches:
        if m.is_bye or m.result == "BYE":
            if m.white_player_id in points:
                points[m.white_player_id] += 1.0
            continue

        if m.result == "PENDING":
            continue

        w_id = m.white_player_id
        b_id = m.black_player_id

        if not w_id or not b_id:
            continue

        if m.result == "1-0":
            if w_id in points:
                points[w_id] += 1.0
            if w_id in opponents_map and b_id in player_ids:
                opponents_map[w_id].append((b_id, "WIN"))
            if b_id in opponents_map and w_id in player_ids:
                opponents_map[b_id].append((w_id, "LOSS"))

        elif m.result == "0-1":
            if b_id in points:
                points[b_id] += 1.0
            if b_id in opponents_map and w_id in player_ids:
                opponents_map[b_id].append((w_id, "WIN"))
            if w_id in opponents_map and b_id in player_ids:
                opponents_map[w_id].append((b_id, "LOSS"))

        elif m.result == "0.5-0.5":
            if w_id in points:
                points[w_id] += 0.5
            if b_id in points:
                points[b_id] += 0.5

            if w_id in opponents_map and b_id in player_ids:
                opponents_map[w_id].append((b_id, "DRAW"))
            if b_id in opponents_map and w_id in player_ids:
                opponents_map[b_id].append((w_id, "DRAW"))

    # Second pass: Calculate Buchholz & Sonneborn-Berger
    buchholz_map: Dict[uuid.UUID, float] = {pid: 0.0 for pid in player_ids}
    sb_map: Dict[uuid.UUID, float] = {pid: 0.0 for pid in player_ids}

    for pid in player_ids:
        opp_list = opponents_map[pid]
        b_score = 0.0
        sb_score = 0.0

        for opp_id, outcome in opp_list:
            opp_points = points.get(opp_id, 0.0)
            b_score += opp_points

            if outcome == "WIN":
                sb_score += opp_points
            elif outcome == "DRAW":
                sb_score += 0.5 * opp_points

        buchholz_map[pid] = round(b_score, 2)
        sb_map[pid] = round(sb_score, 2)

    # Fetch or create Standing objects
    standings_objs: Dict[uuid.UUID, models.Standing] = {}
    existing_standings = (
        db.query(models.Standing)
        .filter(models.Standing.tournament_id == tournament_id)
        .all()
    )

    for st in existing_standings:
        standings_objs[st.player_id] = st

    players_map = {p.id: p for p in players}

    for pid in player_ids:
        if pid not in standings_objs:
            st = models.Standing(
                tournament_id=tournament_id,
                player_id=pid,
                total_points=points[pid],
                buchholz=buchholz_map[pid],
                sonneborn_berger=sb_map[pid],
            )
            db.add(st)
            standings_objs[pid] = st
        else:
            st = standings_objs[pid]
            st.total_points = points[pid]
            st.buchholz = buchholz_map[pid]
            st.sonneborn_berger = sb_map[pid]

    # Sort standings: total_points DESC, buchholz DESC, sonneborn_berger DESC, rating DESC
    sorted_standings = sorted(
        standings_objs.values(),
        key=lambda s: (
            s.total_points,
            s.buchholz,
            s.sonneborn_berger,
            players_map[s.player_id].rating
            if s.player_id in players_map
            and players_map[s.player_id].rating is not None
            else 1200,
        ),
        reverse=True,
    )

    # Assign ranks (handling ties)
    current_rank = 1
    for i, s in enumerate(sorted_standings):
        if i > 0:
            prev = sorted_standings[i - 1]
            if (
                s.total_points == prev.total_points
                and s.buchholz == prev.buchholz
                and s.sonneborn_berger == prev.sonneborn_berger
            ):
                s.rank = prev.rank
            else:
                s.rank = i + 1
        else:
            s.rank = 1

    db.commit()
    return sorted_standings
