from fastapi import HTTPException
from sqlalchemy.orm import Session

from server.models import Recommendation, RecommendationItem, TravelRequest
from server.schemas import RecommendationResponse, TravelRequestCreate
from server.services.ai_service import ai_service


class RecommendationService:
    async def create_recommendations(
        self, db: Session, payload: TravelRequestCreate
    ) -> RecommendationResponse:
        # Create and persist travel request
        travel_req = TravelRequest(
            destination=payload.destination.strip(),
            budget=payload.budget,
            currency=payload.currency.strip().upper(),
            interests=payload.interests,
        )
        db.add(travel_req)
        db.flush()

        # Call AI service
        ai_result = await ai_service.generate_recommendations(
            destination=payload.destination,
            budget=payload.budget,
            currency=payload.currency,
            interests=payload.interests,
        )

        # Create recommendation record
        rec = Recommendation(
            request_id=travel_req.id,
            is_fallback=ai_result.get("is_fallback", False),
        )
        db.add(rec)
        db.flush()

        # Create recommendation items
        total_cost = 0.0
        for item_data in ai_result.get("items", []):
            cost = float(item_data.get("estimated_cost", 0.0))
            total_cost += cost
            rec_item = RecommendationItem(
                recommendation_id=rec.id,
                title=item_data.get("title", "Attraction"),
                category=item_data.get("category", "General"),
                estimated_cost=cost,
                location=item_data.get("location"),
                duration=item_data.get("duration"),
                description=item_data.get("description"),
            )
            db.add(rec_item)

        db.commit()
        db.refresh(rec)
        db.refresh(travel_req)

        res = RecommendationResponse.model_validate(rec)
        res.total_estimated_cost = round(total_cost, 2)
        return res

    def get_recommendation_by_id(
        self, db: Session, recommendation_id: str
    ) -> RecommendationResponse:
        rec = (
            db.query(Recommendation)
            .filter(Recommendation.id == recommendation_id)
            .first()
        )
        if not rec:
            raise HTTPException(status_code=404, detail="Recommendation not found")

        total_cost = sum(item.estimated_cost for item in rec.items)
        res = RecommendationResponse.model_validate(rec)
        res.total_estimated_cost = round(total_cost, 2)
        return res


recommendation_service = RecommendationService()
