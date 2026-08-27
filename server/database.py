import os
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./portfolio.db")

# SQLite specific connect args
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models import Project, ProjectTag

    # Check if projects already exist
    existing_count = db.query(Project).count()
    if existing_count > 0:
        return

    sample_projects = [
        {
            "id": str(uuid.uuid4()),
            "title": "E-Commerce Cloud Platform",
            "summary": "Full-stack online retail store with automated payment processing and real-time inventory management.",
            "full_description": "Comprehensive e-commerce platform built for high-traffic retail. Features automated inventory synchronization, Stripe payment integration, order tracking, and real-time sales analytics dashboard.",
            "thumbnail_url": "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
            "gallery_images": [
                "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&q=80",
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
            ],
            "live_demo_url": "https://ecommerce-demo.example.com",
            "github_url": "https://github.com/example/ecommerce-cloud",
            "client_context": "Built for a mid-sized retail brand serving 25,000 monthly active shoppers.",
            "tags": ["React", "FastAPI", "PostgreSQL", "Stripe", "Tailwind CSS"],
        },
        {
            "id": str(uuid.uuid4()),
            "title": "AI-Powered Analytics Dashboard",
            "summary": "Real-time SaaS dashboard delivering predictive metrics, custom charting, and automated executive reporting.",
            "full_description": "An intelligent business intelligence workspace integrating machine learning forecasts with interactive visual reporting. Includes role-based access control, exportable PDF reports, and webhook notifications.",
            "thumbnail_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
            "gallery_images": [
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
                "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
            ],
            "live_demo_url": "https://analytics-demo.example.com",
            "github_url": "https://github.com/example/ai-saas-dashboard",
            "client_context": "Engineered for a B2B enterprise fintech client seeking automated portfolio health insights.",
            "tags": ["FastAPI", "Python", "React", "Chart.js", "Docker"],
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Healthcare Telemedicine Portal",
            "summary": "HIPAA-compliant patient portal featuring secure video consultations, prescription refills, and medical records.",
            "full_description": "Modern digital health portal providing encrypted messaging between providers and patients, automated appointment scheduling, and integrated billing processing.",
            "thumbnail_url": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
            "gallery_images": [
                "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80"
            ],
            "live_demo_url": "https://telehealth-demo.example.com",
            "github_url": "https://github.com/example/telehealth-portal",
            "client_context": "Delivered for a regional clinic network to streamline remote patient appointments.",
            "tags": ["React", "WebRTC", "PostgreSQL", "FastAPI"],
        },
    ]

    for proj_data in sample_projects:
        tags_list = proj_data.pop("tags")
        project = Project(**proj_data)
        db.add(project)
        db.flush()
        for tag_name in tags_list:
            tag_entry = ProjectTag(project_id=project.id, tag=tag_name)
            db.add(tag_entry)

    try:
        db.commit()
    except Exception:
        db.rollback()
