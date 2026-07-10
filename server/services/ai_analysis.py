import asyncio
from typing import List, Dict, Any


class AIAnalysisService:
    async def analyze_images(self, image_urls: List[str]) -> Dict[str, Any]:
        # Simulate asynchronous AI processing delay
        await asyncio.sleep(0.1)

        # Simple mock logic: if no images or invalid, we could fail, but let's return a successful mock estimate
        if not image_urls:
            return {"status": "FAILED", "reason": "No images provided for analysis."}

        # Return a mock estimate breakdown
        return {
            "status": "READY",
            "estimate": {
                "total_cost": 1250.00,
                "currency": "USD",
                "breakdown": [
                    {"part": "Front Bumper", "cost": 700.00},
                    {"part": "Right Headlight", "cost": 550.00},
                ],
            },
        }


ai_analysis_service = AIAnalysisService()
