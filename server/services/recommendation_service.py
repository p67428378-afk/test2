import logging
from typing import Optional
from sqlalchemy.orm import Session

from server.models import TravelRequest, Recommendation, RecommendationItem
from server.schemas import (
    TravelRequestCreate,
    RecommendationResponse,
    RecommendationItemSchema,
)
from server.services.ai_service import AIService

logger = logging.getLogger("recommendation_service")


class RecommendationService:
    @staticmethod
    async def create_recommendation(
        db: Session, req_in: TravelRequestCreate
    ) -> RecommendationResponse:
        """Create a travel request, trigger AI recommendation, save to DB, and return formatted response."""
        # 1. Create TravelRequest record
        travel_request = TravelRequest(
            destination=req_in.destination,
            budget=req_in.budget,
            currency=req_in.currency,
            interests=req_in.interests,
        )
        db.add(travel_request)
        db.flush()

        # 2. Generate recommendations via AI or fallback
        try:
            items_data, is_fallback = await AIService.generate_recommendations(
                destination=req_in.destination,
                budget=req_in.budget,
                currency=req_in.currency,
                interests=req_in.interests,
            )
        except Exception as e:
            logger.error(f"Error during recommendation generation: {e}")
            items_data = AIService._generate_curated_fallback(
                destination=req_in.destination,
                budget=req_in.budget,
                currency=req_in.currency,
                interests=req_in.interests,
            )
            is_fallback = True

        # 3. Create Recommendation record
        recommendation = Recommendation(
            request_id=travel_request.id,
            raw_ai_response={"items_count": len(items_data), "fallback": is_fallback},
            is_fallback=is_fallback,
        )
        db.add(recommendation)
        db.flush()

        # 4. Create RecommendationItem records
        created_items = []
        for item_dict in items_data:
            item = RecommendationItem(
                recommendation_id=recommendation.id,
                title=item_dict.get("title", "Untitled Activity"),
                category=item_dict.get("category", "General"),
                estimated_cost=float(item_dict.get("estimated_cost", 0.0)),
                location=item_dict.get("location"),
                duration=item_dict.get("duration"),
                description=item_dict.get("description"),
            )
            db.add(item)
            created_items.append(item)

        db.commit()
        db.refresh(recommendation)
        db.refresh(travel_request)

        # 5. Format response
        return RecommendationResponse(
            request_id=travel_request.id,
            recommendation_id=recommendation.id,
            destination=travel_request.destination,
            budget=travel_request.budget,
            currency=travel_request.currency,
            interests=travel_request.interests
            if isinstance(travel_request.interests, list)
            else [],
            is_fallback=recommendation.is_fallback,
            created_at=recommendation.created_at,
            items=[
                RecommendationItemSchema(
                    id=it.id,
                    title=it.title,
                    category=it.category,
                    estimated_cost=it.estimated_cost,
                    location=it.location,
                    duration=it.duration,
                    description=it.description,
                )
                for it in created_items
            ],
        )

    @staticmethod
    def get_recommendation_by_id(
        db: Session, recommendation_id: str
    ) -> Optional[RecommendationResponse]:
        """Fetch a recommendation and its parent request and items by recommendation ID."""
        recommendation = (
            db.query(Recommendation)
            .filter(Recommendation.id == recommendation_id)
            .first()
        )
        if not recommendation:
            return None

        travel_request = recommendation.travel_request
        if not travel_request:
            travel_request = (
                db.query(TravelRequest)
                .filter(TravelRequest.id == recommendation.request_id)
                .first()
            )

        items = (
            db.query(RecommendationItem)
            .filter(RecommendationItem.recommendation_id == recommendation.id)
            .all()
        )

        return RecommendationResponse(
            request_id=recommendation.request_id,
            recommendation_id=recommendation.id,
            destination=travel_request.destination if travel_request else "Unknown",
            budget=travel_request.budget if travel_request else 0.0,
            currency=travel_request.currency if travel_request else "USD",
            interests=travel_request.interests
            if travel_request and isinstance(travel_request.interests, list)
            else [],
            is_fallback=recommendation.is_fallback,
            created_at=recommendation.created_at,
            items=[
                RecommendationItemSchema(
                    id=it.id,
                    title=it.title,
                    category=it.category,
                    estimated_cost=it.estimated_cost,
                    location=it.location,
                    duration=it.duration,
                    description=it.description,
                )
                for it in items
            ],
        )
