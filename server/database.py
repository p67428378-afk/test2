import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from server.models import (
    Base,
    User,
    Category,
    Box,
    Curation,
    Review,
    generate_uuid,
)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# Handle SQLite vs PostgreSQL arguments
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables in the database."""
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    """Seed initial data idempotently."""
    from server.auth import get_password_hash

    # 1. Seed Test Users
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    if not test_user:
        test_user = User(
            id=generate_uuid(),
            email="test@example.com",
            full_name="Standard Test User",
            hashed_password=get_password_hash("testpassword"),
            role="user",
            is_active=True,
            is_verified=True,
        )
        db.add(test_user)
        try:
            db.commit()
            db.refresh(test_user)
        except Exception:
            db.rollback()
            test_user = db.query(User).filter(User.email == "test@example.com").first()

    admin_user = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin_user:
        admin_user = User(
            id=generate_uuid(),
            email="admin@example.com",
            full_name="Administrator",
            hashed_password=get_password_hash("adminpassword"),
            role="admin",
            is_active=True,
            is_verified=True,
        )
        db.add(admin_user)
        try:
            db.commit()
            db.refresh(admin_user)
        except Exception:
            db.rollback()
            admin_user = (
                db.query(User).filter(User.email == "admin@example.com").first()
            )

    # 2. Seed Categories
    categories_data = [
        {
            "name": "Beauty & Wellness",
            "slug": "beauty-wellness",
            "description": "Premium skincare, makeup, and self-care curations.",
        },
        {
            "name": "Gourmet Food & Snacks",
            "slug": "gourmet-food",
            "description": "Artisan treats, international delicacies, and gourmet pantry items.",
        },
        {
            "name": "Books & Literature",
            "slug": "books-literature",
            "description": "Bestselling novels, bookish goodies, and author collectibles.",
        },
        {
            "name": "Tech & Gaming",
            "slug": "tech-gaming",
            "description": "Geek apparel, gadgets, gaming accessories, and retro gear.",
        },
        {
            "name": "Home & Lifestyle",
            "slug": "home-lifestyle",
            "description": "Curated decor, eco-friendly essentials, and cozy living items.",
        },
    ]

    cat_map = {}
    for cat_item in categories_data:
        existing_cat = (
            db.query(Category).filter(Category.slug == cat_item["slug"]).first()
        )
        if not existing_cat:
            new_cat = Category(
                id=generate_uuid(),
                name=cat_item["name"],
                slug=cat_item["slug"],
                description=cat_item["description"],
            )
            db.add(new_cat)
            try:
                db.commit()
                db.refresh(new_cat)
                cat_map[cat_item["slug"]] = new_cat
            except Exception:
                db.rollback()
                existing_cat = (
                    db.query(Category).filter(Category.slug == cat_item["slug"]).first()
                )
                if existing_cat:
                    cat_map[cat_item["slug"]] = existing_cat
        else:
            cat_map[cat_item["slug"]] = existing_cat

    # 3. Seed Boxes & Curations
    boxes_data = [
        {
            "title": "Beauty Deluxe Box",
            "slug": "beauty-deluxe-box",
            "category_slug": "beauty-wellness",
            "description": "Indulge in award-winning skincare, clean beauty essentials, and restorative facial treatments delivered monthly.",
            "price": 29.99,
            "billing_frequency": "Monthly",
            "image_url": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
            "average_rating": 4.8,
            "total_reviews": 128,
            "curations": [
                {
                    "month_year": "October 2026",
                    "theme_title": "Autumn Glow Essentials",
                    "highlights": "Formulated to protect and hydrate your skin against cooler weather with deep botanical essences and peptides.",
                    "item_list": [
                        {
                            "id": "item-1",
                            "name": "Hydrate & Glow Toner",
                            "description": "Refreshing botanical facial mist infused with rosewater and chamomile",
                            "value": "$24",
                        },
                        {
                            "id": "item-2",
                            "name": "Silk Peptide Night Serum",
                            "description": "Restorative anti-aging serum for overnight cellular recovery",
                            "value": "$45",
                        },
                        {
                            "id": "item-3",
                            "name": "Velvet Lip Treatment",
                            "description": "Nourishing lip balm with organic shea butter and honey",
                            "value": "$16",
                        },
                        {
                            "id": "item-4",
                            "name": "Gentle Exfoliating Cleanser",
                            "description": "Enzyme-based micro-cleanser for soft daily radiance",
                            "value": "$22",
                        },
                        {
                            "id": "item-5",
                            "name": "Bamboo Facial Cleansing Cloth",
                            "description": "Ultra-soft antimicrobial reusable cleansing towel",
                            "value": "$12",
                        },
                    ],
                    "available_replacements": [
                        {
                            "id": "rep-1",
                            "name": "Charcoal Detox Clay Mask",
                            "description": "Deep purifying volcanic clay mask for pores",
                            "value": "$28",
                            "in_stock": True,
                            "for_item_id": "item-1",
                        },
                        {
                            "id": "rep-2",
                            "name": "Vitamin C Brightening Drops",
                            "description": "Targeted antioxidant dark spot treatment",
                            "value": "$38",
                            "in_stock": True,
                            "for_item_id": "item-2",
                        },
                        {
                            "id": "rep-3",
                            "name": "Rose Quartz Facial Roller",
                            "description": "Cooling crystal lymphatic drainage massage tool",
                            "value": "$20",
                            "in_stock": True,
                            "for_item_id": "item-3",
                        },
                    ],
                }
            ],
        },
        {
            "title": "Gourmet Artisan Pantry",
            "slug": "gourmet-artisan-pantry",
            "category_slug": "gourmet-food",
            "description": "Discover small-batch spices, artisanal snacks, cold-pressed oils, and farm-to-table gourmet treats from around the globe.",
            "price": 44.99,
            "billing_frequency": "Monthly",
            "image_url": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
            "average_rating": 4.9,
            "total_reviews": 94,
            "curations": [
                {
                    "month_year": "October 2026",
                    "theme_title": "Mediterranean Harvest Curation",
                    "highlights": "Handpicked culinary selections celebrating the vibrant flavors of the Aegean coast.",
                    "item_list": [
                        {
                            "id": "food-1",
                            "name": "Black Truffle Infused Olive Oil",
                            "description": "Cold-pressed extra virgin olive oil with real black truffle shavings",
                            "value": "$26",
                        },
                        {
                            "id": "food-2",
                            "name": "Artisan Rosemary Flatbread Crisps",
                            "description": "Oven-baked sourdough crisps with wild mountain rosemary",
                            "value": "$9",
                        },
                        {
                            "id": "food-3",
                            "name": "Sun-Dried Tomato & Basil Tapenade",
                            "description": "Savory Mediterranean spread perfect for charcuterie boards",
                            "value": "$14",
                        },
                        {
                            "id": "food-4",
                            "name": "Greek Thyme Raw Honey",
                            "description": "Unpasteurized aromatic floral honey from Crete",
                            "value": "$18",
                        },
                    ],
                    "available_replacements": [
                        {
                            "id": "food-rep-1",
                            "name": "Aged Fig Balsamic Glaze",
                            "description": "Slow-aged Modena balsamic reduction with ripe figs",
                            "value": "$22",
                            "in_stock": True,
                            "for_item_id": "food-1",
                        },
                        {
                            "id": "food-rep-2",
                            "name": "Smoked Spanish Paprika Almonds",
                            "description": "Crunchy roasted almonds dusted with sweet Pimentón",
                            "value": "$11",
                            "in_stock": True,
                            "for_item_id": "food-2",
                        },
                    ],
                }
            ],
        },
        {
            "title": "Bibliophile Fiction Crate",
            "slug": "bibliophile-fiction-crate",
            "category_slug": "books-literature",
            "description": "Monthly curated hardcover new releases paired with tea blends, custom bookmarks, and book lover collectibles.",
            "price": 34.99,
            "billing_frequency": "Monthly",
            "image_url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
            "average_rating": 4.7,
            "total_reviews": 62,
            "curations": [
                {
                    "month_year": "October 2026",
                    "theme_title": "Mysteries & Midnight Tales",
                    "highlights": "Chilling gothic mysteries, atmospheric bookish teas, and embossed leather accessories.",
                    "item_list": [
                        {
                            "id": "book-1",
                            "name": "Exclusive Signed Hardcover Novel",
                            "description": "First edition mystery fiction with author note",
                            "value": "$30",
                        },
                        {
                            "id": "book-2",
                            "name": "Earl Grey & Lavender Tea Tin",
                            "description": "Loose leaf aromatic tea blend for late-night reading",
                            "value": "$14",
                        },
                        {
                            "id": "book-3",
                            "name": "Brass Literary Bookmark",
                            "description": "Laser-engraved botanical book accessory",
                            "value": "$12",
                        },
                    ],
                    "available_replacements": [
                        {
                            "id": "book-rep-1",
                            "name": "Soy Wax Reading Candle",
                            "description": "Cedarwood and old paper scented candle in amber glass",
                            "value": "$16",
                            "in_stock": True,
                            "for_item_id": "book-2",
                        },
                    ],
                }
            ],
        },
        {
            "title": "Zen Mind & Yoga Box",
            "slug": "zen-mind-yoga-box",
            "category_slug": "beauty-wellness",
            "description": "Mindfulness rituals, essential oil roll-ons, organic herbal teas, and meditative lifestyle items.",
            "price": 39.99,
            "billing_frequency": "Monthly",
            "image_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
            "average_rating": 4.6,
            "total_reviews": 45,
            "curations": [
                {
                    "month_year": "October 2026",
                    "theme_title": "Inner Sanctuary & Stillness",
                    "highlights": "Grounding tools designed to bring peace to your daily routine.",
                    "item_list": [
                        {
                            "id": "zen-1",
                            "name": "Lavender & Frankincense Mist",
                            "description": "Calming pillow spray with pure essential oils",
                            "value": "$22",
                        },
                        {
                            "id": "zen-2",
                            "name": "Handmade Brass Singing Bowl",
                            "description": "Traditional Tibetan singing bowl for meditation",
                            "value": "$35",
                        },
                        {
                            "id": "zen-3",
                            "name": "Organic Chamomile Loose Tea",
                            "description": "Whole Egyptian chamomile flowers for restful sleep",
                            "value": "$12",
                        },
                    ],
                    "available_replacements": [
                        {
                            "id": "zen-rep-1",
                            "name": "Eucalyptus Shower Steamer Pack",
                            "description": "Aromatherapy steam tablets for revitalizing baths",
                            "value": "$18",
                            "in_stock": True,
                            "for_item_id": "zen-1",
                        },
                    ],
                }
            ],
        },
    ]

    for bdata in boxes_data:
        cat = cat_map.get(bdata["category_slug"])
        if not cat:
            continue
        box = db.query(Box).filter(Box.slug == bdata["slug"]).first()
        if not box:
            box = Box(
                id=generate_uuid(),
                category_id=cat.id,
                title=bdata["title"],
                slug=bdata["slug"],
                description=bdata["description"],
                price=bdata["price"],
                billing_frequency=bdata["billing_frequency"],
                image_url=bdata["image_url"],
                average_rating=bdata["average_rating"],
                total_reviews=bdata["total_reviews"],
                is_active=True,
            )
            db.add(box)
            try:
                db.commit()
                db.refresh(box)
            except Exception:
                db.rollback()
                box = db.query(Box).filter(Box.slug == bdata["slug"]).first()

        if box:
            for cur_data in bdata["curations"]:
                existing_cur = (
                    db.query(Curation)
                    .filter(
                        Curation.box_id == box.id,
                        Curation.month_year == cur_data["month_year"],
                    )
                    .first()
                )
                if not existing_cur:
                    new_cur = Curation(
                        id=generate_uuid(),
                        box_id=box.id,
                        month_year=cur_data["month_year"],
                        theme_title=cur_data["theme_title"],
                        highlights=cur_data["highlights"],
                        item_list=cur_data["item_list"],
                        available_replacements=cur_data["available_replacements"],
                    )
                    db.add(new_cur)
                    try:
                        db.commit()
                    except Exception:
                        db.rollback()

            # Seed a review for this box from test_user
            if test_user:
                existing_rev = (
                    db.query(Review)
                    .filter(Review.box_id == box.id, Review.user_id == test_user.id)
                    .first()
                )
                if not existing_rev:
                    rev = Review(
                        id=generate_uuid(),
                        box_id=box.id,
                        user_id=test_user.id,
                        rating=5,
                        comment="Loved the curation this month! High quality items and great value.",
                    )
                    db.add(rev)
                    try:
                        db.commit()
                    except Exception:
                        db.rollback()
