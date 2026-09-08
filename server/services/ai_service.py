import os
import json
import logging
from typing import List, Dict, Any, Tuple
import httpx

logger = logging.getLogger("travel_ai_service")


class AIService:
    """Service for orchestrating AI-driven travel recommendations with robust fallback."""

    @classmethod
    async def generate_recommendations(
        cls, destination: str, budget: float, currency: str, interests: List[str]
    ) -> Tuple[List[Dict[str, Any]], bool]:
        """
        Generate recommendations.
        Returns: (list_of_items, is_fallback)
        """
        api_key = (
            os.getenv("AI_PROVIDER_API_KEY")
            or os.getenv("GEMINI_API_KEY")
            or os.getenv("OPENAI_API_KEY")
        )

        if api_key and not os.getenv("TESTING"):
            try:
                items = await cls._call_external_llm(
                    destination=destination,
                    budget=budget,
                    currency=currency,
                    interests=interests,
                    api_key=api_key,
                )
                if items:
                    return items, False
            except Exception as e:
                logger.warning(
                    f"External AI generation failed ({e}). Using curated fallback recommendations."
                )

        # Fallback generation
        fallback_items = cls._generate_curated_fallback(
            destination, budget, currency, interests
        )
        return fallback_items, True

    @classmethod
    async def _call_external_llm(
        cls,
        destination: str,
        budget: float,
        currency: str,
        interests: List[str],
        api_key: str,
    ) -> List[Dict[str, Any]]:
        """Call external LLM API (OpenAI / Gemini format) with timeout."""
        prompt = (
            f"You are an expert travel planner. Recommend suitable places, activities, and dining for a traveler.\n"
            f"Destination: {destination}\n"
            f"Daily Budget: {budget} {currency}\n"
            f"Interests: {', '.join(interests)}\n\n"
            f"Return ONLY valid JSON containing a list of recommendations adhering to this structure:\n"
            f"[\n"
            f"  {{\n"
            f'    "title": "Name of attraction or dining",\n'
            f'    "category": "Category matching interest (e.g. Temples & Culture, Food & Dining, Anime & Pop Culture, Outdoor & Nature)",\n'
            f'    "estimated_cost": 0.0,\n'
            f'    "location": "Neighborhood, City",\n'
            f'    "duration": "Estimated time (e.g. 2 hours)",\n'
            f'    "description": "Brief engaging summary"\n'
            f"  }}\n"
            f"]\n"
            f"Ensure total estimated costs do not exceed the daily budget of {budget} {currency}."
        )

        async with httpx.AsyncClient(timeout=8.0) as client:
            # Try OpenAI compatible endpoint if standard format
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": os.getenv("AI_MODEL_NAME", "gpt-3.5-turbo"),
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a travel recommendation engine that outputs strictly JSON.",
                    },
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.7,
            }
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload,
            )
            if response.status_code == 200:
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                parsed = json.loads(content)
                if isinstance(parsed, dict) and "recommendations" in parsed:
                    parsed = parsed["recommendations"]
                if isinstance(parsed, list):
                    return parsed

        return []

    @classmethod
    def _generate_curated_fallback(
        cls, destination: str, budget: float, currency: str, interests: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Intelligent rule-based curated fallback generator tailored to the destination, budget, and interests.
        Ensures diverse activity options within budget limits.
        """
        dest_lower = destination.lower()
        items = []

        # Knowledge base of templates per interest
        interest_templates = {
            "culture": [
                {
                    "title": lambda d: "Historic Old Town & Heritage Walk",
                    "category": "Culture & Heritage",
                    "cost_factor": 0.0,
                    "duration": "2.5 hours",
                    "description": lambda d: f"Explore the rich architectural history and local cultural monuments of {d}.",
                },
                {
                    "title": lambda d: "National Museum & Art Gallery",
                    "category": "Culture & Heritage",
                    "cost_factor": 0.15,
                    "duration": "3 hours",
                    "description": lambda d: f"Discover curated historic exhibits and masterworks of local artisans in {d}.",
                },
            ],
            "food": [
                {
                    "title": lambda d: "Local Street Food & Market Tour",
                    "category": "Food & Dining",
                    "cost_factor": 0.20,
                    "duration": "1.5 hours",
                    "description": lambda d: f"Savor authentic regional delicacies and fresh specialties at the most popular food market in {d}.",
                },
                {
                    "title": lambda d: "Traditional Bistro & Evening Tasting",
                    "category": "Food & Dining",
                    "cost_factor": 0.30,
                    "duration": "2 hours",
                    "description": lambda d: f"Enjoy local seasonal dishes and beverages at a highly-rated family-run eatery in {d}.",
                },
            ],
            "outdoor": [
                {
                    "title": lambda d: "Scenic Botanical Gardens & Park",
                    "category": "Outdoor & Nature",
                    "cost_factor": 0.05,
                    "duration": "2 hours",
                    "description": lambda d: f"Relax amidst lush native greenery, walking trails, and scenic vistas in {d}.",
                },
                {
                    "title": lambda d: "Panoramic Riverfront & Skyline Trail",
                    "category": "Outdoor & Nature",
                    "cost_factor": 0.0,
                    "duration": "2 hours",
                    "description": lambda d: f"A scenic walk offering spectacular photo spots and panoramic views of {d}.",
                },
            ],
            "anime": [
                {
                    "title": lambda d: "Pop Culture Hub & Entertainment Alley",
                    "category": "Anime & Pop Culture",
                    "cost_factor": 0.15,
                    "duration": "2.5 hours",
                    "description": lambda d: "Immerse yourself in specialized hobby shops, retro gaming arcades, and themed cafes.",
                }
            ],
            "relaxation": [
                {
                    "title": lambda d: "Thermal Spa & Wellness Experience",
                    "category": "Relaxation & Wellness",
                    "cost_factor": 0.25,
                    "duration": "2 hours",
                    "description": lambda d: f"Unwind and rejuvenate with soothing thermal baths and wellness treatments in {d}.",
                }
            ],
            "shopping": [
                {
                    "title": lambda d: "Artisan Crafts & Boutique Arcade",
                    "category": "Shopping & Local Crafts",
                    "cost_factor": 0.15,
                    "duration": "2 hours",
                    "description": lambda d: f"Browse unique souvenirs, handcrafted goods, and local fashion boutiques in {d}.",
                }
            ],
        }

        # Destination-specific highlights
        if "tokyo" in dest_lower:
            items.append(
                {
                    "title": "Senso-ji Temple",
                    "category": "Temples & Culture",
                    "estimated_cost": 0.0,
                    "location": "Asakusa, Tokyo",
                    "duration": "2 hours",
                    "description": "Tokyo's oldest Buddhist temple featuring vibrant Nakamise Street market stalls.",
                }
            )
            items.append(
                {
                    "title": "Omoide Yokocho Dining",
                    "category": "Food & Dining",
                    "estimated_cost": min(25.0, round(budget * 0.25, 2)),
                    "location": "Shinjuku, Tokyo",
                    "duration": "1.5 hours",
                    "description": "Atmospheric alleyway offering budget-friendly Yakitori skewers and authentic local izakayas.",
                }
            )
            items.append(
                {
                    "title": "Akihabara Electric Town",
                    "category": "Anime & Pop Culture",
                    "estimated_cost": min(15.0, round(budget * 0.15, 2)),
                    "location": "Akihabara, Tokyo",
                    "duration": "3 hours",
                    "description": "Hub for manga, retro gaming arcades, and multi-floor specialty hobby shops.",
                }
            )
            items.append(
                {
                    "title": "Shinjuku Gyoen National Garden",
                    "category": "Outdoor & Nature",
                    "estimated_cost": min(5.0, round(budget * 0.05, 2)),
                    "location": "Shinjuku, Tokyo",
                    "duration": "2 hours",
                    "description": "Expansive traditional Japanese garden offering peaceful walking trails and cherry blossoms.",
                }
            )
        elif "paris" in dest_lower:
            items.append(
                {
                    "title": "Montmartre & Sacré-Cœur Basilica",
                    "category": "Culture & Heritage",
                    "estimated_cost": 0.0,
                    "location": "Montmartre, Paris",
                    "duration": "2.5 hours",
                    "description": "Historic bohemian hilltop neighborhood with breathtaking panoramic views over Paris.",
                }
            )
            items.append(
                {
                    "title": "Latin Quarter Bistro & Bakery",
                    "category": "Food & Dining",
                    "estimated_cost": min(25.0, round(budget * 0.3, 2)),
                    "location": "5th Arrondissement, Paris",
                    "duration": "1.5 hours",
                    "description": "Fresh artisan croissants, baguettes, and classic French bistro lunch in a historic quarter.",
                }
            )
            items.append(
                {
                    "title": "Luxembourg Gardens Stroll",
                    "category": "Outdoor & Nature",
                    "estimated_cost": 0.0,
                    "location": "6th Arrondissement, Paris",
                    "duration": "2 hours",
                    "description": "Tree-lined promenades, elegant fountains, and relaxing green spaces in central Paris.",
                }
            )
        else:
            # Generic matching based on user's selected interests
            allocated_budget = 0.0
            for interest in interests:
                matched_key = None
                int_lower = interest.lower()
                for key in interest_templates:
                    if key in int_lower or int_lower in key:
                        matched_key = key
                        break
                if not matched_key:
                    matched_key = "culture"

                template_list = interest_templates.get(
                    matched_key, interest_templates["culture"]
                )
                for tmpl in template_list:
                    cost = round(budget * tmpl["cost_factor"], 2)
                    if allocated_budget + cost <= budget or len(items) == 0:
                        items.append(
                            {
                                "title": tmpl["title"](destination),
                                "category": tmpl["category"],
                                "estimated_cost": cost,
                                "location": f"Central {destination}",
                                "duration": tmpl["duration"],
                                "description": tmpl["description"](destination),
                            }
                        )
                        allocated_budget += cost

        # Ensure at least 2 items
        if len(items) < 2:
            items.append(
                {
                    "title": f"Iconic Landmarks of {destination}",
                    "category": "Sightseeing & Exploration",
                    "estimated_cost": 0.0,
                    "location": f"Downtown {destination}",
                    "duration": "2 hours",
                    "description": f"Self-guided walking tour of prominent landmarks and city vistas in {destination}.",
                }
            )

        return items
