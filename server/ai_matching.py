import difflib
from sqlalchemy.orm import Session
from server.models import Item


def calculate_similarity(item1: Item, item2: Item) -> float:
    # If they are of the same type (e.g. both lost or both found), they cannot match
    if item1.type == item2.type:
        return 0.0

    score = 0.0

    # 1. Category Match (30 points)
    if item1.category.lower().strip() == item2.category.lower().strip():
        score += 30.0
    else:
        # Partial category match
        ratio = difflib.SequenceMatcher(
            None, item1.category.lower(), item2.category.lower()
        ).ratio()
        score += ratio * 15.0

    # 2. Location Match (20 points)
    if item1.location.lower().strip() == item2.location.lower().strip():
        score += 20.0
    else:
        ratio = difflib.SequenceMatcher(
            None, item1.location.lower(), item2.location.lower()
        ).ratio()
        score += ratio * 10.0

    # 3. Name Match (15 points)
    ratio_name = difflib.SequenceMatcher(
        None, item1.name.lower(), item2.name.lower()
    ).ratio()
    score += ratio_name * 15.0

    # 4. Description Match (25 points)
    ratio_desc = difflib.SequenceMatcher(
        None, item1.description.lower(), item2.description.lower()
    ).ratio()
    score += ratio_desc * 25.0

    # 5. Date Proximity (10 points)
    try:
        diff = abs((item1.date_incident - item2.date_incident).days)
        if diff <= 3:
            score += 10.0
        elif diff <= 7:
            score += 7.0
        elif diff <= 14:
            score += 5.0
        elif diff <= 30:
            score += 2.0
    except Exception:
        pass

    # Ensure score is capped at 100.0 and rounded to 2 decimal places
    return round(min(score, 100.0), 2)


def get_matches_for_item(db: Session, item: Item, threshold: float = 60.0):
    # If item is lost, we search for found items. If item is found, we search for lost items.
    target_type = "found" if item.type == "lost" else "lost"

    # Fetch all active items of the target type
    candidates = (
        db.query(Item).filter(Item.type == target_type, Item.status != "reunited").all()
    )

    matches = []
    for candidate in candidates:
        score = calculate_similarity(item, candidate)
        if score >= threshold:
            matches.append({"matched_item": candidate, "similarity_score": score})

    # Sort matches by similarity score descending
    matches.sort(key=lambda x: x["similarity_score"], reverse=True)
    return matches
