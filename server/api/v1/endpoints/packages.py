from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from server import schemas, crud, models
from server.database import get_db

router = APIRouter()


def seed_packages_if_empty(db: Session):
    if db.query(models.Package).count() == 0:
        packages_data = [
            {
                "name": "Hawaiian Paradise Getaway",
                "description": "A pristine, wide-angle shot of a breathtaking Hawaiian beach at sunset. Crystal clear turquoise waters gently lap against white sands, framed by lush green tropical palms.",
                "price": 1499.00,
                "destination": "Hawaii",
                "duration_days": 7,
                "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDdCPrhKl8qqhlJoFKTW7iowWUOrIVbv7slZ-oQOssEDhWY_1MgZM83nNlvgj7xpzIR3gBmEiBblhYjH6mBJgMsn9mrixbF2rGk2fg1cG2bUsK9IwjXWxfH4NTe1W-mDsewbz9MnWwzBygQphgBWZuutqXV3ink8zcL70fQFL10CoiEm1ZNr_5GmEp9WB_A4e9Ci9CKVsrG3tR0JheoDOnYRAzw7vrfAVzD4_nqr0LHeBJSA19C2r7SOQGn1DK9pMbp3e4ZJodRZPc",
                "rating": 4.8,
                "inclusions": [
                    "Flights",
                    "Luxury Hotel",
                    "Snorkeling Tour",
                    "Daily Breakfast",
                ],
                "itinerary": [
                    {
                        "day": 1,
                        "title": "Arrival & Welcome",
                        "description": "Arrive in Honolulu, traditional lei greeting, and transfer to your luxury resort.",
                    },
                    {
                        "day": 2,
                        "title": "Waikiki Beach & Snorkeling",
                        "description": "Spend the day relaxing on Waikiki Beach and enjoy a guided snorkeling tour.",
                    },
                    {
                        "day": 3,
                        "title": "Pearl Harbor Tour",
                        "description": "Visit the historic Pearl Harbor National Memorial and USS Arizona.",
                    },
                    {
                        "day": 4,
                        "title": "North Shore Adventure",
                        "description": "Explore the famous North Shore, watch surfers, and taste local shrimp trucks.",
                    },
                    {
                        "day": 5,
                        "title": "Volcano National Park",
                        "description": "Day trip to the Big Island to see active volcanoes and lava fields.",
                    },
                    {
                        "day": 6,
                        "title": "Sunset Dinner Cruise",
                        "description": "Enjoy a beautiful sunset dinner cruise with live Hawaiian music.",
                    },
                    {
                        "day": 7,
                        "title": "Departure",
                        "description": "Leisurely morning and transfer to the airport for your flight home.",
                    },
                ],
            },
            {
                "name": "Swiss Alps Adventure",
                "description": "A majestic view of the Swiss Alps in winter. Snow-capped peaks rise sharply against a clear, crisp blue sky. In the foreground, a modern, cozy alpine lodge sits softly illuminated.",
                "price": 1899.00,
                "destination": "Switzerland",
                "duration_days": 6,
                "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDMQB1L4eNpNfpFQyTlM2oHEst6wLrWfpMZ6rkmTGaDUpEsltggYwCLLQZ6KmdemEBxnVVI4EcvSPal1oxsPq4EaPzkQeaj8_Ua98g2g7cABFKeorSUrXNsgs6GmNV2KyYQ88KqIjlTawVrTSnJ94S2GMlCrfZy6qQlvLoJJP4OrTYd4JeaKSwAl0HchmUXRgm0MpUln6zQnXn_css4OG-hsnK749dvkB0m8pF0irsTbxAUHWbwtk2qdwiIy5skhtUfaylgcG42HAE",
                "rating": 4.9,
                "inclusions": ["Flights", "Alpine Lodge", "Ski Pass", "Guided Hiking"],
                "itinerary": [
                    {
                        "day": 1,
                        "title": "Arrival in Zurich",
                        "description": "Arrive in Zurich and take a scenic train ride to Zermatt.",
                    },
                    {
                        "day": 2,
                        "title": "Matterhorn Skiing",
                        "description": "Hit the slopes with your included ski pass and enjoy views of the Matterhorn.",
                    },
                    {
                        "day": 3,
                        "title": "Glacier Express",
                        "description": "Ride the famous Glacier Express train through breathtaking mountain passes.",
                    },
                    {
                        "day": 4,
                        "title": "Guided Alpine Hike",
                        "description": "Enjoy a guided snowshoe hike followed by a traditional Swiss fondue dinner.",
                    },
                    {
                        "day": 5,
                        "title": "Spa & Relaxation",
                        "description": "Relax in the thermal baths and outdoor heated pools of a luxury alpine spa.",
                    },
                    {
                        "day": 6,
                        "title": "Departure",
                        "description": "Transfer back to Zurich for your departure flight.",
                    },
                ],
            },
            {
                "name": "Tokyo Cultural Explorer",
                "description": "A vibrant, bustling street scene in Tokyo at twilight. Neon signs softly glow, illuminating sleek modern architecture alongside traditional elements like subtle lanterns.",
                "price": 1650.00,
                "destination": "Japan",
                "duration_days": 8,
                "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAU9Zs8Hw96pZuWUiTInkXjPc9j4nwsg4whlAsen1um2KHPBq4n3BLexBQRva0xP1rBLbFFhChNCiMM6aC0bNqL8IpQH53cUhch9eBZiYU0lipR206SjksyvaNWAREm9r-uhZsepUf7grYLCh1BqlkpOX-hScI4KmF4bQ5VcDDqHxnLPOCqap9exqr-8yojxML4jIMTAxNUG8d_KohzcesV-_JS9ZZ3Nytld6kTLcJgn1jNy2sgogghkbSkY0iXwKvgpTAoFiubaHU",
                "rating": 4.7,
                "inclusions": [
                    "Flights",
                    "Boutique Hotel",
                    "Guided City Tour",
                    "Bullet Train Ticket",
                ],
                "itinerary": [
                    {
                        "day": 1,
                        "title": "Arrival in Tokyo",
                        "description": "Arrive in Tokyo, transfer to your hotel in Shinjuku, and enjoy a welcome dinner.",
                    },
                    {
                        "day": 2,
                        "title": "Historic Tokyo Tour",
                        "description": "Visit Senso-ji Temple in Asakusa, Meiji Shrine, and stroll through Harajuku.",
                    },
                    {
                        "day": 3,
                        "title": "Modern Tokyo & Shibuya",
                        "description": "Explore teamLab Planets digital art museum and cross the famous Shibuya Crossing.",
                    },
                    {
                        "day": 4,
                        "title": "Mount Fuji Day Trip",
                        "description": "Take a scenic tour to Mount Fuji and Lake Ashi, including a cable car ride.",
                    },
                    {
                        "day": 5,
                        "title": "Kyoto Bullet Train",
                        "description": "Ride the Shinkansen bullet train to Kyoto and visit Fushimi Inari Shrine.",
                    },
                    {
                        "day": 6,
                        "title": "Temples & Bamboo Forest",
                        "description": "Explore Kinkaku-ji (Golden Pavilion) and walk through Arashiyama Bamboo Grove.",
                    },
                    {
                        "day": 7,
                        "title": "Tea Ceremony & Gisha District",
                        "description": "Participate in a traditional tea ceremony and walk through the historic Gion district.",
                    },
                    {
                        "day": 8,
                        "title": "Departure",
                        "description": "Return to Tokyo by bullet train and transfer to the airport for your flight.",
                    },
                ],
            },
        ]
        for pkg in packages_data:
            db_pkg = crud.create_package(db, pkg)
            crud.create_review(
                db,
                db_pkg.id,
                "John Doe",
                5,
                "Absolutely amazing experience! Highly recommend.",
            )
            crud.create_review(
                db,
                db_pkg.id,
                "Jane Smith",
                4,
                "Great itinerary, but the flights were long.",
            )


@router.get("/packages", response_model=schemas.PackageListResponse)
def get_packages(
    destination: Optional[str] = Query(None, description="Filter by destination name"),
    start_date: Optional[date] = Query(
        None, description="Filter by packages available on or after this date"
    ),
    end_date: Optional[date] = Query(
        None, description="Filter by packages available on or before this date"
    ),
    travelers: Optional[int] = Query(
        None,
        description="Filter by packages that can accommodate this number of travelers",
    ),
    package_ids: Optional[str] = Query(
        None, description="Comma-separated list of package IDs to compare"
    ),
    skip: int = Query(0, ge=0, description="Number of records to skip for pagination"),
    limit: int = Query(20, ge=1, le=100, description="Max number of records to return"),
    db: Session = Depends(get_db),
):
    seed_packages_if_empty(db)

    ids_list = None
    if package_ids:
        ids_list = [pid.strip() for pid in package_ids.split(",") if pid.strip()]

    items, total = crud.get_packages(
        db,
        destination=destination,
        start_date=start_date,
        end_date=end_date,
        travelers=travelers,
        package_ids=ids_list,
        skip=skip,
        limit=limit,
    )
    return {"items": items, "total": total}


@router.get("/packages/{package_id}", response_model=schemas.PackageDetailResponse)
def get_package(package_id: str, db: Session = Depends(get_db)):
    seed_packages_if_empty(db)
    package = crud.get_package(db, package_id=package_id)
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Package not found"
        )
    return package
