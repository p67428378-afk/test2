import os
import uuid
from datetime import datetime, timezone
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8")[:72], salt).decode("utf-8")


def init_db():
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models import User, Category, Box, Curation, Review

    # 1. Seed Users (idempotent)
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    if not test_user:
        test_user = User(
            id=str(uuid.uuid4()),
            email="test@example.com",
            full_name="Test Subscriber",
            hashed_password=get_password_hash("testpassword"),
            role="user",
            is_active=True,
            is_verified=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)

    admin_user = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin_user:
        admin_user = User(
            id=str(uuid.uuid4()),
            email="admin@example.com",
            full_name="Admin Manager",
            hashed_password=get_password_hash("adminpassword"),
            role="admin",
            is_active=True,
            is_verified=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

    # 2. Seed Categories (idempotent)
    categories_data = [
        {
            "name": "Gourmet Food",
            "slug": "gourmet-food",
            "description": "Artisanal snacks, cheeses, coffees, and culinary delights from around the world.",
        },
        {
            "name": "Beauty Deluxe",
            "slug": "beauty-deluxe",
            "description": "Premium skincare, clean beauty cosmetics, and luxury wellness treats.",
        },
        {
            "name": "Tech & Gadgets",
            "slug": "tech-gadgets",
            "description": "Innovative smart home gear, EDC tools, and cutting-edge electronic accessories.",
        },
        {
            "name": "Book Lover",
            "slug": "book-lover",
            "description": "Bestselling hardcovers, author exclusives, bookish goodies, and tea pairings.",
        },
        {
            "name": "Fitness & Wellness",
            "slug": "fitness-wellness",
            "description": "High-performance supplements, recovery tools, and active lifestyle apparel.",
        },
    ]

    category_map = {}
    for cat in categories_data:
        existing_cat = db.query(Category).filter(Category.slug == cat["slug"]).first()
        if not existing_cat:
            new_cat = Category(
                id=str(uuid.uuid4()),
                name=cat["name"],
                slug=cat["slug"],
                description=cat["description"],
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(new_cat)
            db.commit()
            db.refresh(new_cat)
            category_map[cat["slug"]] = new_cat
        else:
            category_map[cat["slug"]] = existing_cat

    # 3. Seed Subscription Boxes (idempotent)
    boxes_data = [
        {
            "title": "Gourmet Foodies Club",
            "slug": "gourmet-foodies-club",
            "category_slug": "gourmet-food",
            "description": "Indulge in monthly selections of award-winning farmstead cheeses, single-origin dark chocolates, and handcrafted charcuterie accompaniments.",
            "price": 45.00,
            "billing_frequency": "Monthly",
            "image_url": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
            "curation": {
                "month_year": "September 2026",
                "theme_title": "Tuscan Harvest & Aged Truffles",
                "highlights": "Handpicked culinary selections from artisanal producers across northern Italy.",
                "item_list": [
                    {
                        "name": "Black Truffle Infused Olive Oil (250ml)",
                        "description": "Cold-pressed extra virgin olive oil with real Umbrian black truffles.",
                        "value": "$18.00",
                    },
                    {
                        "name": "24-Month Aged Parmigiano Reggiano (200g)",
                        "description": "Authentic DOP certified Italian hard cheese.",
                        "value": "$14.50",
                    },
                    {
                        "name": "Rosemary & Sea Salt Sourdough Flatbreads",
                        "description": "Slow-fermented crispbreads made with stoneground wheat.",
                        "value": "$7.00",
                    },
                    {
                        "name": "Wild Fig & Balsamic Glaze (150ml)",
                        "description": "Sweet and tangy balsamic reduction with ripe Mediterranean figs.",
                        "value": "$9.50",
                    },
                    {
                        "name": "Artisanal Cantucci Biscotti (120g)",
                        "description": "Double-baked almond cookies perfect for dipping.",
                        "value": "$6.00",
                    },
                ],
            },
        },
        {
            "title": "Artisan Coffee Explorer",
            "slug": "artisan-coffee-explorer",
            "category_slug": "gourmet-food",
            "description": "Discover exceptional micro-lot specialty coffees sourced directly from ethical smallholder farms across Ethiopia, Colombia, and Costa Rica.",
            "price": 32.00,
            "billing_frequency": "Monthly",
            "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
            "curation": {
                "month_year": "September 2026",
                "theme_title": "Highland Elevation Washed & Natural",
                "highlights": "Two 12oz bags of fresh whole-bean single origin roasts with brewing recipe cards.",
                "item_list": [
                    {
                        "name": "Yirgacheffe Floral Washed (12oz)",
                        "description": "Notes of jasmine, bergamot, and ripe peach.",
                        "value": "$19.00",
                    },
                    {
                        "name": "Huila Pink Bourbon Natural (12oz)",
                        "description": "Notes of wild strawberry, caramel, and cacao nibs.",
                        "value": "$21.00",
                    },
                    {
                        "name": "Precision Pour-Over Filter Pack (40ct)",
                        "description": "Unbleached oxygen-cleansed cone paper filters.",
                        "value": "$6.00",
                    },
                ],
            },
        },
        {
            "title": "Beauty Deluxe Box",
            "slug": "beauty-deluxe-box",
            "category_slug": "beauty-deluxe",
            "description": "Curated clean beauty, anti-aging serums, nourishing hair oils, and cruelty-free makeup essentials from boutique laboratories.",
            "price": 29.99,
            "billing_frequency": "Monthly",
            "image_url": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
            "curation": {
                "month_year": "September 2026",
                "theme_title": "Botanical Radiance & Hydration Revival",
                "highlights": "5 full-size and deluxe travel beauty essentials formulated with cold-pressed botanical extracts.",
                "item_list": [
                    {
                        "name": "Hyaluronic Cloud Hydrating Serum (30ml)",
                        "description": "Multi-molecular weight hyaluronic acid for deep hydration.",
                        "value": "$38.00",
                    },
                    {
                        "name": "Rosehip & Squalane Facial Oil (20ml)",
                        "description": "Rich in vitamins A & C to replenish moisture barriers.",
                        "value": "$28.00",
                    },
                    {
                        "name": "Velvet Peptide Lip Treatment (15ml)",
                        "description": "Plumping antioxidant lip balm with peptides.",
                        "value": "$16.00",
                    },
                    {
                        "name": "Bamboo Silk Exfoliating Polisher (50g)",
                        "description": "Ultra-fine physical and enzyme exfoliating scrub.",
                        "value": "$22.00",
                    },
                    {
                        "name": "Silk Satin Sleep Eye Mask",
                        "description": "100% mulberry silk cooling eye mask.",
                        "value": "$15.00",
                    },
                ],
            },
        },
        {
            "title": "Radiance Skincare Vault",
            "slug": "radiance-skincare-vault",
            "category_slug": "beauty-deluxe",
            "description": "Luxury quarterly skincare collection featuring dermatologist-backed peptides, retinol alternatives, and marine collagen concentrates.",
            "price": 55.00,
            "billing_frequency": "Quarterly",
            "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
            "curation": {
                "month_year": "Autumn 2026",
                "theme_title": "Cellular Renewal & Barrier Defense",
                "highlights": "Comprehensive clinical barrier restoration system for changing seasons.",
                "item_list": [
                    {
                        "name": "Marine Collagen Night Renewal Creme (50ml)",
                        "description": "Deeply restorative night cream with Antarctic peptides.",
                        "value": "$64.00",
                    },
                    {
                        "name": "Stabilized Vitamin C 20% Glow Drops (30ml)",
                        "description": "Brightens dull skin and shields against pollution.",
                        "value": "$48.00",
                    },
                    {
                        "name": "Ceramide Shield Daily Moisture Lotion (100ml)",
                        "description": "Triple-ceramide complex with colloidal oatmeal.",
                        "value": "$32.00",
                    },
                ],
            },
        },
        {
            "title": "Gadget Vault Monthly",
            "slug": "gadget-vault-monthly",
            "category_slug": "tech-gadgets",
            "description": "Handpicked tech innovations, smart desk accessories, multi-tools, audio gear, and compact EDC gadgets for modern enthusiasts.",
            "price": 65.00,
            "billing_frequency": "Monthly",
            "image_url": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
            "curation": {
                "month_year": "September 2026",
                "theme_title": "Minimalist Desktop & Smart EDC",
                "highlights": "Elevate your workspace efficiency with sleek aluminum accessories and modular power.",
                "item_list": [
                    {
                        "name": "65W GaN Ultra-Compact Fast Charger",
                        "description": "Dual USB-C and USB-A high efficiency wall adapter.",
                        "value": "$39.00",
                    },
                    {
                        "name": "Magnetic Aluminum Cable Management Hub",
                        "description": "Weighted desk organizer with 4 magnetic wire collars.",
                        "value": "$24.00",
                    },
                    {
                        "name": "Precision Titanium EDC Pocket Screwdriver Set",
                        "description": "12 interchangeable hardened steel magnetic bits.",
                        "value": "$28.00",
                    },
                    {
                        "name": "Braided Kevlar USB-C 240W Cable (2m)",
                        "description": "High-durability fast-charging and 40Gbps data sync cable.",
                        "value": "$22.00",
                    },
                ],
            },
        },
        {
            "title": "Bookworm Page Turner",
            "slug": "bookworm-page-turner",
            "category_slug": "book-lover",
            "description": "A monthly literary journey featuring brand-new fiction releases, author signed bookplates, custom bookmarks, and thematic loose-leaf teas.",
            "price": 24.99,
            "billing_frequency": "Monthly",
            "image_url": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80",
            "curation": {
                "month_year": "September 2026",
                "theme_title": "Mysteries in Fog & Secret Libraries",
                "highlights": "Hardcover psychological thriller release accompanied by warm spiced Earl Grey tea.",
                "item_list": [
                    {
                        "name": "The Clockmaker's Secret (Hardcover Debut)",
                        "description": "First edition novel with exclusive foil-stamped dust jacket.",
                        "value": "$28.00",
                    },
                    {
                        "name": "Vintage Brass Filigree Bookmark",
                        "description": "Engraved metal tassel bookmark.",
                        "value": "$12.00",
                    },
                    {
                        "name": "Bergamot & Cinnamon Black Loose-Leaf Tea (50g)",
                        "description": "Organic custom blend crafted for cozy reading sessions.",
                        "value": "$10.00",
                    },
                ],
            },
        },
    ]

    for bdata in boxes_data:
        box = db.query(Box).filter(Box.slug == bdata["slug"]).first()
        category = category_map[bdata["category_slug"]]
        if not box:
            box = Box(
                id=str(uuid.uuid4()),
                category_id=category.id,
                title=bdata["title"],
                slug=bdata["slug"],
                description=bdata["description"],
                price=bdata["price"],
                billing_frequency=bdata["billing_frequency"],
                image_url=bdata["image_url"],
                average_rating=0.0,
                total_reviews=0,
                is_active=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(box)
            db.commit()
            db.refresh(box)

            # Add curation
            cdata = bdata["curation"]
            curation = Curation(
                id=str(uuid.uuid4()),
                box_id=box.id,
                month_year=cdata["month_year"],
                theme_title=cdata["theme_title"],
                highlights=cdata["highlights"],
                item_list=cdata["item_list"],
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(curation)
            db.commit()

    # 4. Seed Reviews (idempotent)
    reviews_seed = [
        {
            "box_slug": "gourmet-foodies-club",
            "user_email": "test@example.com",
            "rating": 5,
            "comment": "The truffle oil and 24-month aged parmesan were restaurant quality! Best food subscription I have tried.",
        },
        {
            "box_slug": "gourmet-foodies-club",
            "user_email": "admin@example.com",
            "rating": 5,
            "comment": "Incredible packaging with temperature insulation. Every item felt premium and delicious.",
        },
        {
            "box_slug": "beauty-deluxe-box",
            "user_email": "test@example.com",
            "rating": 5,
            "comment": "The cloud hyaluronic serum transformed my skin overnight! The silk sleep mask is super soft.",
        },
        {
            "box_slug": "beauty-deluxe-box",
            "user_email": "admin@example.com",
            "rating": 4,
            "comment": "Great value for the retail price of the items. Looking forward to next month's box.",
        },
        {
            "box_slug": "gadget-vault-monthly",
            "user_email": "test@example.com",
            "rating": 5,
            "comment": "The GaN fast charger and magnetic cable holder are permanently on my work desk now.",
        },
        {
            "box_slug": "bookworm-page-turner",
            "user_email": "test@example.com",
            "rating": 5,
            "comment": "The book selection was captivating and the tea pairing was wonderful.",
        },
    ]

    for rdata in reviews_seed:
        box = db.query(Box).filter(Box.slug == rdata["box_slug"]).first()
        user = db.query(User).filter(User.email == rdata["user_email"]).first()
        if box and user:
            existing_review = (
                db.query(Review)
                .filter(Review.box_id == box.id, Review.user_id == user.id)
                .first()
            )
            if not existing_review:
                new_review = Review(
                    id=str(uuid.uuid4()),
                    box_id=box.id,
                    user_id=user.id,
                    rating=rdata["rating"],
                    comment=rdata["comment"],
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc),
                )
                db.add(new_review)
                db.commit()

    # Recalculate ratings for all boxes
    all_boxes = db.query(Box).all()
    for b in all_boxes:
        box_reviews = db.query(Review).filter(Review.box_id == b.id).all()
        if box_reviews:
            b.total_reviews = len(box_reviews)
            b.average_rating = round(
                sum(r.rating for r in box_reviews) / len(box_reviews), 2
            )
        else:
            b.total_reviews = 0
            b.average_rating = 0.0
    db.commit()
