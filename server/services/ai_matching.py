import re
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from server.models import Item


def clean_text(text: str) -> List[str]:
    if not text:
        return []
    # Lowercase and split into words, removing punctuation
    words = re.findall(r"\w+", text.lower())
    # Filter out common stop words
    stop_words = {
        "a",
        "an",
        "the",
        "and",
        "or",
        "but",
        "is",
        "if",
        "then",
        "with",
        "at",
        "by",
        "from",
        "for",
        "in",
        "on",
        "of",
        "to",
    }
    return [w for words_list in words for w in [words_list] if w not in stop_words]


def calculate_match_score(item1: Item, item2: Item) -> float:
    score = 0.0

    # 1. Category Match (Max 0.3)
    if item1.category.lower() == item2.category.lower():
        score += 0.3

    # 2. Location Match (Max 0.3)
    loc1 = item1.location.lower()
    loc2 = item2.location.lower()
    if loc1 == loc2:
        score += 0.3
    elif loc1 in loc2 or loc2 in loc1:
        score += 0.15

    # 3. Description Keyword Match (Max 0.4)
    words1 = set(clean_text(item1.description))
    words2 = set(clean_text(item2.description))
    if words1 and words2:
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        jaccard = len(intersection) / len(union)
        score += min(0.4, jaccard * 0.4)

    return round(score, 2)


def find_potential_matches(db: Session, item: Item) -> List[Dict[str, Any]]:
    # Find items with the opposite status
    opposite_status = "found" if item.status == "lost" else "lost"
    candidates = db.query(Item).filter(Item.status == opposite_status).all()

    matches = []
    for candidate in candidates:
        score = calculate_match_score(item, candidate)
        if score > 0.0:
            matches.append({"item": candidate, "score": score})

    # Sort by score descending
    matches.sort(key=lambda x: x["score"], reverse=True)
    return matches
