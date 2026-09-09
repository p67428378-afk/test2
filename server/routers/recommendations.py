"""Recommendation generation and session history endpoints."""

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy import desc
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import (
    Product,
    Recommendation,
    RecommendationFeedback,
    UserPreference,
)
from server.schemas import (
    HistoryItem,
    HistoryListResponse,
    HistorySession,
    RecommendationGenerateRequest,
    RecommendationGenerateResponse,
    RecommendationItemProduct,
    RecommendationItemResponse,
)
from server.services.recommendation_engine import generate_recommendations

router = APIRouter()


@router.post("/generate", response_model=RecommendationGenerateResponse)
def generate_user_recommendations(
    payload: RecommendationGenerateRequest,
    db: Session = Depends(get_db),
):
    """
    Generate AI content-based product recommendations with optional min_rating threshold
    and dynamic sorting (match_score, price, rating).
    """
    user_pref = (
        db.query(UserPreference)
        .filter(UserPreference.user_id == payload.user_id)
        .first()
    )
    products = db.query(Product).all()

    scored_items = generate_recommendations(
        products=products,
        user_preference=user_pref,
        limit=payload.limit,
        min_rating=payload.min_rating,
        sort_by=payload.sort_by or "match_score",
        sort_order=payload.sort_order or "desc",
    )

    session_id = f"sess-{uuid.uuid4().hex[:8]}"
    response_items: list[RecommendationItemResponse] = []

    for item in scored_items:
        p: Product = item["product"]
        rec = Recommendation(
            user_id=payload.user_id,
            product_id=p.id,
            match_score=item["match_score"],
            recommendation_type=item["recommendation_type"],
            session_id=session_id,
        )
        db.add(rec)
        db.flush()  # populate rec.id

        response_items.append(
            RecommendationItemResponse(
                recommendation_id=rec.id,
                product=RecommendationItemProduct(
                    id=p.id,
                    name=p.name,
                    category=p.category,
                    price=p.price,
                    rating=p.rating or 0.0,
                    description=p.description,
                    tags=p.tags or [],
                ),
                match_score=rec.match_score,
                recommendation_type=rec.recommendation_type,
            )
        )

    db.commit()

    return RecommendationGenerateResponse(
        user_id=payload.user_id,
        session_id=session_id,
        recommendations=response_items,
    )


@router.get("/history", response_model=HistoryListResponse)
def get_recommendation_history(
    user_id: str | None = None,
    skip: int | None = 0,
    limit: int | None = 20,
    db: Session = Depends(get_db),
):
    """
    Retrieve historic recommendation sessions and interaction telemetry logs.
    """
    if skip is None or skip < 0:
        skip = 0
    if limit is None or limit <= 0:
        limit = 20

    query = db.query(Recommendation)
    if user_id and user_id.strip():
        query = query.filter(Recommendation.user_id == user_id.strip())

    # Order all recommendations by creation time descending
    recs = query.order_by(desc(Recommendation.created_at)).all()

    # Group by session_id (preserve order)
    sessions_dict: dict[str, list[Recommendation]] = {}
    for r in recs:
        sid = r.session_id or f"sess-{r.id[:8]}"
        if sid not in sessions_dict:
            sessions_dict[sid] = []
        sessions_dict[sid].append(r)

    all_session_keys = list(sessions_dict.keys())
    total_sessions = len(all_session_keys)
    paginated_sids = all_session_keys[skip : skip + limit]

    sessions_result: list[HistorySession] = []
    for sid in paginated_sids:
        session_recs = sessions_dict[sid]
        first_rec = session_recs[0]

        items: list[HistoryItem] = []
        for r in session_recs:
            prod_name = r.product.name if r.product else "Unknown Product"
            # check feedback
            fb = (
                db.query(RecommendationFeedback)
                .filter(RecommendationFeedback.recommendation_id == r.id)
                .first()
            )
            feedback_val = fb.feedback if fb else None

            items.append(
                HistoryItem(
                    recommendation_id=r.id,
                    product_name=prod_name,
                    match_score=r.match_score,
                    feedback=feedback_val,
                )
            )

        sessions_result.append(
            HistorySession(
                session_id=sid,
                timestamp=first_rec.created_at,
                total_recommendations=len(items),
                items=items,
            )
        )

    return HistoryListResponse(
        sessions=sessions_result,
        total=total_sessions,
        skip=skip,
        limit=limit,
    )
