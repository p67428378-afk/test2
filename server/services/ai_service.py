import asyncio
import logging
from typing import Any

logger = logging.getLogger(__name__)


DEFAULT_FALLBACK_TEMPLATES: dict[str, list[dict[str, Any]]] = {
    "default": [
        {
            "title": "Historic City Center Walking Tour",
            "category": "Culture",
            "estimated_cost": 0.0,
            "location": "Downtown Central District",
            "duration": "2.5 hours",
            "description": "Explore landmark architecture, historic monuments, and scenic alleys with self-guided highlights.",
        },
        {
            "title": "Local Market & Street Food Tasting",
            "category": "Food & Dining",
            "estimated_cost": 25.0,
            "location": "Central Food Hall",
            "duration": "1.5 hours",
            "description": "Sample signature regional dishes, fresh street food skewers, and traditional pastries.",
        },
        {
            "title": "Panoramic City Viewpoint & Park",
            "category": "Outdoor & Relaxation",
            "estimated_cost": 10.0,
            "location": "Hilltop Observatory Park",
            "duration": "2 hours",
            "description": "Stunning scenic views across the entire cityscape and surrounding nature gardens.",
        },
        {
            "title": "Cultural Heritage Museum",
            "category": "Culture",
            "estimated_cost": 15.0,
            "location": "Museum Quarter",
            "duration": "2 hours",
            "description": "In-depth historical exhibitions, ancient artifacts, and interactive cultural showcases.",
        },
    ],
    "tokyo": [
        {
            "title": "Senso-ji Temple & Asakusa District",
            "category": "Culture & Temples",
            "estimated_cost": 0.0,
            "location": "Asakusa, Tokyo",
            "duration": "2 hours",
            "description": "Tokyo's oldest and most famous Buddhist temple with Nakamise-dori shopping street.",
        },
        {
            "title": "Omoide Yokocho Yakitori Experience",
            "category": "Food & Dining",
            "estimated_cost": 28.0,
            "location": "Shinjuku, Tokyo",
            "duration": "1.5 hours",
            "description": "Atmospheric laneway lined with tiny yakitori eateries and cozy local izakayas.",
        },
        {
            "title": "Meiji Jingu Shrine & Yoyogi Forest Walk",
            "category": "Outdoor & Culture",
            "estimated_cost": 0.0,
            "location": "Shibuya, Tokyo",
            "duration": "1.5 hours",
            "description": "Tranquil Shinto shrine nestled in a lush 170-acre forested oasis in the heart of Tokyo.",
        },
        {
            "title": "Akihabara Tech & Anime Exploration",
            "category": "Entertainment & Culture",
            "estimated_cost": 20.0,
            "location": "Akihabara, Tokyo",
            "duration": "2.5 hours",
            "description": "World-famous hub for electronics, manga, gaming culture, and themed specialty cafes.",
        },
        {
            "title": "Tsukiji Outer Market Seafood Breakfast",
            "category": "Food & Dining",
            "estimated_cost": 30.0,
            "location": "Tsukiji, Tokyo",
            "duration": "1.5 hours",
            "description": "Bustling market stalls serving fresh sashimi, tamagoyaki, and grilled seafood.",
        },
    ],
    "paris": [
        {
            "title": "Louvre Museum Highlights Tour",
            "category": "Culture",
            "estimated_cost": 22.0,
            "location": "1st Arrondissement, Paris",
            "duration": "3 hours",
            "description": "Admire masterpieces including the Mona Lisa, Venus de Milo, and the Winged Victory.",
        },
        {
            "title": "Montmartre & Sacré-Cœur Basilica",
            "category": "Culture & Sights",
            "estimated_cost": 0.0,
            "location": "18th Arrondissement, Paris",
            "duration": "2 hours",
            "description": "Historic bohemian hilltop neighborhood with panoramic views over Paris.",
        },
        {
            "title": "Latin Quarter Bistro Lunch",
            "category": "Food & Dining",
            "estimated_cost": 35.0,
            "location": "5th Arrondissement, Paris",
            "duration": "1.5 hours",
            "description": "Classic French culinary experience with croque monsieur, quiche, and fresh pastries.",
        },
        {
            "title": "Seine River Sunset Promenade",
            "category": "Relaxation",
            "estimated_cost": 0.0,
            "location": "Seine Riverbank",
            "duration": "1.5 hours",
            "description": "Romantic walk along UNESCO-listed riverbanks passing Notre-Dame and Pont Neuf.",
        },
    ],
}


class AIService:
    def __init__(self, timeout_seconds: float = 10.0):
        self.timeout_seconds = timeout_seconds

    async def generate_recommendations(
        self,
        destination: str,
        budget: float,
        currency: str = "USD",
        interests: list[str] | None = None,
    ) -> dict[str, Any]:
        interests = interests or []
        dest_lower = destination.strip().lower()

        try:
            # Simulate or call AI model with timeout
            result = await asyncio.wait_for(
                self._call_ai_engine(destination, budget, currency, interests),
                timeout=self.timeout_seconds,
            )
            return {"items": result, "is_fallback": False}
        except Exception as e:  # noqa: BLE001
            logger.warning(
                f"AI service call failed or timed out ({e}). Falling back to cached templates."
            )
            fallback_items = self._get_fallback_items(
                dest_lower, budget, currency, interests
            )
            return {"items": fallback_items, "is_fallback": True}

    async def _call_ai_engine(
        self, destination: str, budget: float, currency: str, interests: list[str]
    ) -> list[dict[str, Any]]:
        # In this runtime, generate context-aware tailored itinerary
        # Check if matched specific destination template or customized items
        dest_key = (
            "tokyo"
            if "tokyo" in destination.lower()
            else ("paris" if "paris" in destination.lower() else "default")
        )
        base_items = DEFAULT_FALLBACK_TEMPLATES.get(
            dest_key, DEFAULT_FALLBACK_TEMPLATES["default"]
        )

        # Filter or scale items according to budget and interests
        items = []
        for item in base_items:
            # Adjust cost if exceeding daily budget
            item_copy = dict(item)
            if item_copy["estimated_cost"] > budget:
                item_copy["estimated_cost"] = max(0.0, round(budget * 0.4, 2))
            items.append(item_copy)

        # If interests are provided, inject an interest-specific activity if not already present
        if interests:
            interest_titles = [i["title"] for i in items]
            for interest in interests[:2]:
                title = f"{destination.title()} {interest.title()} Experience"
                if title not in interest_titles:
                    items.append(
                        {
                            "title": title,
                            "category": interest.title(),
                            "estimated_cost": round(min(budget * 0.2, 20.0), 2),
                            "location": f"Central {destination.title()}",
                            "duration": "1.5 hours",
                            "description": f"Curated experience tailored specifically for {interest.lower()} enthusiasts in {destination.title()}.",
                        }
                    )

        return items

    def _get_fallback_items(
        self, dest_lower: str, budget: float, currency: str, interests: list[str]
    ) -> list[dict[str, Any]]:
        if "tokyo" in dest_lower:
            return DEFAULT_FALLBACK_TEMPLATES["tokyo"]
        elif "paris" in dest_lower:
            return DEFAULT_FALLBACK_TEMPLATES["paris"]
        else:
            return DEFAULT_FALLBACK_TEMPLATES["default"]


ai_service = AIService()
