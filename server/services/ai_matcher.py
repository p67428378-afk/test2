from sqlalchemy.orm import Session
from server.models import Item, MatchSuggestion


def calculate_match_score(item1: Item, item2: Item) -> float:
    # 1. Category match (30 points)
    category_score = 0.0
    if item1.category.lower() == item2.category.lower():
        category_score = 30.0

    # 2. Location match (20 points)
    location_score = 0.0
    if item1.location and item2.location:
        loc1 = item1.location.lower()
        loc2 = item2.location.lower()
        if loc1 == loc2:
            location_score = 20.0
        elif loc1 in loc2 or loc2 in loc1:
            location_score = 10.0

    # 3. Date proximity (20 points)
    date_score = 0.0
    if item1.item_timestamp and item2.item_timestamp:
        diff = abs((item1.item_timestamp - item2.item_timestamp).days)
        if diff <= 1:
            date_score = 20.0
        elif diff <= 3:
            date_score = 15.0
        elif diff <= 7:
            date_score = 10.0
        elif diff <= 14:
            date_score = 5.0

    # 4. Description similarity (30 points)
    desc_score = 0.0
    words1 = set(item1.description.lower().split())
    words2 = set(item2.description.lower().split())
    # Remove common stop words
    stop_words = {
        "a",
        "an",
        "the",
        "and",
        "or",
        "but",
        "is",
        "with",
        "at",
        "on",
        "in",
        "of",
        "for",
    }
    words1 = words1 - stop_words
    words2 = words2 - stop_words

    if words1 and words2:
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        jaccard = len(intersection) / len(union)
        desc_score = jaccard * 30.0

    total_score = category_score + location_score + date_score + desc_score
    # Ensure score is between 0 and 100
    return min(max(total_score, 0.0), 100.0)


def generate_match_suggestions(db: Session, new_item: Item):
    # We only match lost items with found items
    if new_item.type == "lost":
        potential_matches = (
            db.query(Item)
            .filter(Item.type == "found", Item.status == "AVAILABLE_FOUND")
            .all()
        )
    else:
        potential_matches = (
            db.query(Item)
            .filter(Item.type == "lost", Item.status == "REPORTED_LOST")
            .all()
        )

    for match in potential_matches:
        score = calculate_match_score(new_item, match)
        if score >= 50.0:
            # Check if suggestion already exists
            lost_id = new_item.id if new_item.type == "lost" else match.id
            found_id = match.id if new_item.type == "lost" else new_item.id

            existing = (
                db.query(MatchSuggestion)
                .filter(
                    MatchSuggestion.lost_item_id == lost_id,
                    MatchSuggestion.found_item_id == found_id,
                )
                .first()
            )

            if not existing:
                suggestion = MatchSuggestion(
                    lost_item_id=lost_id,
                    found_item_id=found_id,
                    confidence_score=score,
                    status="suggested",
                )
                db.add(suggestion)
    db.commit()
