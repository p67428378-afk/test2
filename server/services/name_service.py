import random
from collections import deque
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session

from server.models.genre import Genre
from server.models.name_component import NameComponent
from server.schemas.name_generator import NameGenerateRequest, NameGenerateResponse

# Canonical genre mapping
GENRE_MAP = {
    "fantasy": "fantasy",
    "scifi": "scifi",
    "sci-fi": "scifi",
    "sci_fi": "scifi",
    "cyberpunk": "cyberpunk",
    "mystery": "mystery",
    "historical": "historical",
    "general": "general",
}

VALID_DISPLAY_GENRES = "Fantasy, Sci-Fi, Cyberpunk, Mystery, Historical, General"

# In-memory recent generation history to avoid sequential duplicates
_recent_names_history: deque[str] = deque(maxlen=100)


class NameService:
    @staticmethod
    def normalize_genre(genre_raw: Optional[str]) -> str:
        if not genre_raw or not genre_raw.strip():
            return "general"
        
        cleaned = genre_raw.strip().lower()
        if cleaned in GENRE_MAP:
            return GENRE_MAP[cleaned]
        
        # Check if matching display_name (e.g. "Sci-Fi" -> "scifi")
        for code in ["fantasy", "scifi", "cyberpunk", "mystery", "historical", "general"]:
            if cleaned == code or cleaned.replace("-", "").replace(" ", "") == code:
                return code

        raise HTTPException(
            status_code=400,
            detail=f"Invalid genre selected. Allowed values: {VALID_DISPLAY_GENRES}",
        )

    @staticmethod
    def validate_quantity(quantity_raw: Optional[int]) -> int:
        if quantity_raw is None:
            return 5
        try:
            qty = int(quantity_raw)
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=400,
                detail="Quantity must be between 1 and 10.",
            )
        
        if qty < 1 or qty > 10:
            raise HTTPException(
                status_code=400,
                detail="Quantity must be between 1 and 10.",
            )
        return qty

    @classmethod
    def generate_names(
        cls, db: Session, request: NameGenerateRequest
    ) -> NameGenerateResponse:
        genre_code = cls.normalize_genre(request.genre)
        quantity = cls.validate_quantity(request.quantity)
        sub_tags = [t.lower().strip() for t in request.sub_tags] if request.sub_tags else None

        genre = db.query(Genre).filter(Genre.code == genre_code).first()
        if not genre:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid genre selected. Allowed values: {VALID_DISPLAY_GENRES}",
            )

        # Query components
        components = (
            db.query(NameComponent)
            .filter(NameComponent.genre_id == genre.id)
            .all()
        )

        prefixes = [c.value for c in components if c.component_type == "prefix"]
        descriptors = [c.value for c in components if c.component_type == "descriptor"]
        suffixes = [c.value for c in components if c.component_type == "suffix"]
        
        # Filter base names with sub_tags if specified
        if sub_tags:
            base_components = [
                c.value
                for c in components
                if c.component_type == "base"
                and (c.sub_tag is None or c.sub_tag in sub_tags or c.sub_tag == "neutral")
            ]
            if not base_components:
                base_components = [c.value for c in components if c.component_type == "base"]
        else:
            base_components = [c.value for c in components if c.component_type == "base"]

        if not base_components:
            base_components = ["Hero", "Vanguard", "Wanderer", "Nomad", "Cipher"]
        if not suffixes:
            suffixes = ["Prime", "Cross", "Vance", "Black", "Storm"]

        generated_names: List[str] = []
        recent_set = set(_recent_names_history)
        max_attempts = quantity * 50
        attempts = 0

        patterns = [
            "base_suffix",
            "prefix_base",
            "descriptor_base",
            "descriptor_base_suffix",
            "prefix_base_suffix",
        ]

        # Prioritize candidates not recently generated
        while len(generated_names) < quantity and attempts < max_attempts:
            attempts += 1
            pattern = random.choice(patterns)
            base = random.choice(base_components)
            prefix = random.choice(prefixes) if prefixes else "Master"
            descriptor = random.choice(descriptors) if descriptors else "Swift"
            suffix = random.choice(suffixes) if suffixes else "Cross"

            if pattern == "base_suffix":
                candidate = f"{base} {suffix}"
            elif pattern == "prefix_base":
                candidate = f"{prefix} {base}"
            elif pattern == "descriptor_base":
                candidate = f"{descriptor} {base}"
            elif pattern == "descriptor_base_suffix":
                candidate = f"{descriptor} {base} {suffix}"
            elif pattern == "prefix_base_suffix":
                candidate = f"{prefix} {base} {suffix}"
            else:
                candidate = f"{base} {suffix}"

            if candidate not in generated_names:
                # If we have attempts left, try to pick one not in recent history
                if candidate not in recent_set or attempts > quantity * 20:
                    generated_names.append(candidate)
                    _recent_names_history.append(candidate)

        # Fallback if strict uniqueness needed more names
        while len(generated_names) < quantity:
            fallback = f"{random.choice(base_components)} {random.choice(suffixes)} {len(generated_names) + 1}"
            if fallback not in generated_names:
                generated_names.append(fallback)

        return NameGenerateResponse(
            genre=genre.code,
            quantity=len(generated_names),
            names=generated_names,
            generated_at=datetime.now(timezone.utc),
        )
