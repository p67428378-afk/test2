import difflib
from datetime import date
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from server.models import Item


def calculate_text_similarity(text1: str, text2: str) -> float:
    if not text1 or not text2:
        return 0.0
    text1 = text1.lower().strip()
    text2 = text2.lower().strip()
    return difflib.SequenceMatcher(None, text1, text2).ratio()


def calculate_date_similarity(date1: date, date2: date) -> float:
    # Calculate difference in days
    delta = abs((date1 - date2).days)
    # If within 30 days, scale score from 1.0 down to 0.0
    if delta >= 30:
        return 0.0
    return 1.0 - (delta / 30.0)


def calculate_location_similarity(
    loc1: str,
    loc2: str,
    lat1: float = None,
    lon1: float = None,
    lat2: float = None,
    lon2: float = None,
) -> float:
    # If coordinates are available, we can use a simple distance calculation
    if lat1 is not None and lon1 is not None and lat2 is not None and lon2 is not None:
        # Simple Euclidean distance for small distances (or Manhattan)
        dist = ((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2) ** 0.5
        # Scale distance: if within 1 degree (~111km), scale score
        if dist >= 1.0:
            coord_score = 0.0
        else:
            coord_score = 1.0 - dist
    else:
        coord_score = None

    # Text similarity of location
    text_score = calculate_text_similarity(loc1, loc2)

    if coord_score is not None:
        return 0.6 * coord_score + 0.4 * text_score
    return text_score


def find_matches_for_lost_item(lost_item: Item, db: Session) -> List[Dict[str, Any]]:
    # Find all found items
    found_items = db.query(Item).filter(Item.status == "reported_found").all()

    matches = []
    for found in found_items:
        # 1. Category match (strict or fuzzy)
        category_score = (
            1.0 if lost_item.category.lower() == found.category.lower() else 0.0
        )

        # 2. Name similarity
        name_score = calculate_text_similarity(lost_item.name, found.name)

        # 3. Description similarity
        desc_score = calculate_text_similarity(
            lost_item.description or "", found.description or ""
        )

        # 4. Location similarity
        loc_score = calculate_location_similarity(
            lost_item.location_text,
            found.location_text,
            float(lost_item.lat) if lost_item.lat is not None else None,
            float(lost_item.lon) if lost_item.lon is not None else None,
            float(found.lat) if found.lat is not None else None,
            float(found.lon) if found.lon is not None else None,
        )

        # 5. Date similarity
        date_score = calculate_date_similarity(lost_item.item_date, found.item_date)

        # Weighted average score
        # Category is a strong filter, but we still allow matches if other fields are very similar
        total_score = (
            0.3 * category_score
            + 0.25 * name_score
            + 0.15 * desc_score
            + 0.15 * loc_score
            + 0.15 * date_score
        )

        # Only include matches with a score above a threshold (e.g., 0.3)
        if total_score >= 0.3:
            matches.append({"item": found, "score": round(total_score, 2)})

    # Sort matches by score descending
    matches.sort(key=lambda x: x["score"], reverse=True)
    return matches
