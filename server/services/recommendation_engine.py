import uuid
from typing import Any

from sqlalchemy.orm import Session

from server.models import (
    Product,
    Recommendation,
    RecommendationFeedback,
    UserPreference,
)


def calculate_recommendations(
    db: Session,
    user_id: str,
    limit: int = 5,
) -> list[dict[str, Any]]:
    # 1. Fetch user preferences
    pref = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()

    # 2. Fetch user feedback history
    past_feedbacks = (
        db.query(RecommendationFeedback, Recommendation, Product)
        .join(
            Recommendation,
            RecommendationFeedback.recommendation_id == Recommendation.id,
        )
        .join(Product, Recommendation.product_id == Product.id)
        .filter(RecommendationFeedback.user_id == user_id)
        .all()
    )

    liked_categories = set()
    disliked_categories = set()
    liked_tags = set()
    disliked_tags = set()

    for fb, rec, prod in past_feedbacks:
        if fb.feedback == "like":
            liked_categories.add(prod.category.lower())
            for t in prod.tags or []:
                liked_tags.add(t.lower())
        elif fb.feedback == "dislike":
            disliked_categories.add(prod.category.lower())
            for t in prod.tags or []:
                disliked_tags.add(t.lower())

    # 3. Query in-stock candidate products
    candidate_products = db.query(Product).filter(Product.in_stock == True).all()
    if not candidate_products:
        return []

    scored_candidates = []

    if pref:
        cat_prefs = [c.lower() for c in (pref.category_preferences or [])]
        tag_prefs = [t.lower() for t in (pref.preferred_tags or [])]
        min_p = pref.min_price
        max_p = pref.max_price

        for prod in candidate_products:
            prod_cat = prod.category.lower()
            prod_tags = [t.lower() for t in (prod.tags or [])]

            # Category score (40%)
            s_cat = 40.0 if (prod_cat in cat_prefs or not cat_prefs) else 0.0

            # Price score (30%)
            if min_p <= prod.price <= max_p:
                s_price = 30.0
            elif max_p > 0 and prod.price <= max_p * 1.25:
                s_price = 15.0
            else:
                s_price = 0.0

            # Tag score (30%)
            if tag_prefs:
                overlap = len(set(prod_tags) & set(tag_prefs))
                s_tag = min(30.0, (overlap / len(tag_prefs)) * 30.0)
            else:
                s_tag = 30.0 if s_cat > 0 else 10.0

            # Feedback adjustment
            s_feedback = 0.0
            if prod_cat in liked_categories:
                s_feedback += 5.0
            if prod_cat in disliked_categories:
                s_feedback -= 15.0

            for t in prod_tags:
                if t in liked_tags:
                    s_feedback += 2.0
                if t in disliked_tags:
                    s_feedback -= 5.0

            total_score = min(100.0, max(0.0, s_cat + s_price + s_tag + s_feedback))

            if total_score > 0:
                scored_candidates.append((prod, total_score, "ai_vector"))

        # Sort by total_score desc, rating desc
        scored_candidates.sort(key=lambda x: (x[1], x[0].rating or 0.0), reverse=True)

    # 4. Fallback if no preferences or no matches found
    if not scored_candidates:
        # Fallback to top-selling / highest rated products
        sorted_popular = sorted(
            candidate_products,
            key=lambda p: (p.rating or 0.0, -p.price),
            reverse=True,
        )
        for prod in sorted_popular[:limit]:
            simulated_score = round(
                min(100.0, max(60.0, (prod.rating or 4.0) * 20.0)), 2
            )
            scored_candidates.append((prod, simulated_score, "fallback_popular"))

    selected = scored_candidates[:limit]
    results = []

    # 5. Persist recommendations to DB
    for prod, score, rec_type in selected:
        rec_id = str(uuid.uuid4())
        db_rec = Recommendation(
            id=rec_id,
            user_id=user_id,
            product_id=prod.id,
            match_score=round(score, 2),
            recommendation_type=rec_type,
        )
        db.add(db_rec)
        results.append(
            {
                "recommendation_id": rec_id,
                "product": prod,
                "match_score": round(score, 2),
                "recommendation_type": rec_type,
            }
        )

    try:
        db.commit()
    except Exception:
        db.rollback()

    return results
