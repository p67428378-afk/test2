import os
import uuid
from datetime import datetime, date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from server.models import (
    Base,
    User,
    ExcavationSite,
    ExcavationTeam,
    TeamMember,
    DiscoveredArtifact,
    Publication,
    LabAnalysis,
    MediaAsset,
    artifact_publications,
)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/archaeology.db")

connect_args = {}
engine_kwargs = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False
    if ":memory:" in DATABASE_URL or DATABASE_URL == "sqlite://":
        engine_kwargs["poolclass"] = StaticPool

engine = create_engine(DATABASE_URL, connect_args=connect_args, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(target_engine=None):
    """Initialize database tables idempotently."""
    Base.metadata.create_all(bind=target_engine or engine)


def seed_data(db: Session):
    """Seed ready-to-use accounts and sample excavation records idempotently."""
    try:
        # Seed Regular Test User
        user = db.query(User).filter(User.email == "test@example.com").first()
        if not user:
            user = User(
                id=str(uuid.uuid4()),
                email="test@example.com",
                full_name="Archaeology Field Lead",
                role="user",
                is_active=True,
                is_verified=True,
            )
            db.add(user)

        # Seed Admin User
        admin = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin:
            admin = User(
                id=str(uuid.uuid4()),
                email="admin@example.com",
                full_name="Director of Antiquities",
                role="admin",
                is_active=True,
                is_verified=True,
            )
            db.add(admin)

        db.commit()

        # Seed Sample Excavation Site
        site_alpha = db.query(ExcavationSite).filter(ExcavationSite.site_code == "SITE-ALPHA").first()
        if not site_alpha:
            site_alpha = ExcavationSite(
                id=str(uuid.uuid4()),
                name="Alpha Trench",
                site_code="SITE-ALPHA",
                region="Mediterranean Basin",
                historical_period="Late Bronze Age (1550 - 1200 BCE)",
                latitude=34.0522,
                longitude=-118.2437,
                altitude_meters=120.0,
                description="Coastal settlement mound featuring fortified palatial structures and subterranean storage pithoi.",
            )
            db.add(site_alpha)
            db.commit()
            db.refresh(site_alpha)

        site_beta = db.query(ExcavationSite).filter(ExcavationSite.site_code == "SITE-BETA").first()
        if not site_beta:
            site_beta = ExcavationSite(
                id=str(uuid.uuid4()),
                name="Valley of the Sun Necropolis",
                site_code="SITE-BETA",
                region="Near East",
                historical_period="Hellenistic Period (323 - 31 BCE)",
                latitude=31.7683,
                longitude=35.2137,
                altitude_meters=750.0,
                description="Rock-cut monumental tombs with inscribed funerary stelae and ceremonial offerings.",
            )
            db.add(site_beta)
            db.commit()
            db.refresh(site_beta)

        # Seed Sample Excavation Team & Members
        team = db.query(ExcavationTeam).filter(ExcavationTeam.team_name == "Excavation Unit 1").first()
        if not team:
            team = ExcavationTeam(
                id=str(uuid.uuid4()),
                team_name="Excavation Unit 1",
                site_id=site_alpha.id,
            )
            db.add(team)
            db.commit()
            db.refresh(team)

            member_director = TeamMember(
                id=str(uuid.uuid4()),
                team_id=team.id,
                full_name="Dr. John Smith",
                role="Director",
                email="john.smith@archeo.org",
                phone="+1-555-0199",
            )
            member_arch = TeamMember(
                id=str(uuid.uuid4()),
                team_id=team.id,
                full_name="Dr. Jane Doe",
                role="Archaeologist",
                email="jane.doe@archeo.org",
                phone="+1-555-0188",
            )
            member_lab = TeamMember(
                id=str(uuid.uuid4()),
                team_id=team.id,
                full_name="Marcus Vance",
                role="Lab Specialist",
                email="marcus.vance@archeo.org",
                phone="+1-555-0177",
            )
            db.add_all([member_director, member_arch, member_lab])
            db.commit()
            db.refresh(member_arch)

        # Seed Sample Artifact
        artifact = db.query(DiscoveredArtifact).filter(DiscoveredArtifact.artifact_code == "ART-2026-001").first()
        if not artifact:
            jane_member = db.query(TeamMember).filter(TeamMember.email == "jane.doe@archeo.org").first()
            artifact = DiscoveredArtifact(
                id=str(uuid.uuid4()),
                site_id=site_alpha.id,
                artifact_code="ART-2026-001",
                material="Ceramic",
                context_layer="Stratum III (Trench 4A)",
                depth_meters=2.5,
                excavation_date=date(2026, 3, 15),
                finder_member_id=jane_member.id if jane_member else None,
                description="Intact painted terracotta amphora featuring geometric wave motifs and double handles.",
            )
            db.add(artifact)
            db.commit()
            db.refresh(artifact)

        # Seed Sample Lab Analysis
        lab_test = db.query(LabAnalysis).filter(LabAnalysis.artifact_id == artifact.id).first()
        if not lab_test:
            lab_test = LabAnalysis(
                id=str(uuid.uuid4()),
                artifact_id=artifact.id,
                test_type="Radiocarbon C-14",
                lab_name="Beta Analytic Radiocarbon Dating Laboratory",
                status="Completed",
                request_date=date(2026, 3, 20),
                completion_date=date(2026, 4, 5),
                result_summary="Calibrated calendar age 1260 BCE - 1190 BCE (2 Sigma, 95.4% probability).",
            )
            db.add(lab_test)
            db.commit()
            db.refresh(lab_test)

        # Seed Sample Publication
        pub = db.query(Publication).filter(Publication.doi == "10.1016/j.jas.2026.1001").first()
        if not pub:
            pub = Publication(
                id=str(uuid.uuid4()),
                title="Bronze Age Pottery of Alpha Trench: Chronology and Petrographic Signatures",
                authors="Smith, J., Doe, J., and Vance, M.",
                journal_publisher="Journal of Archaeological Science",
                publication_date=date(2026, 5, 10),
                doi="10.1016/j.jas.2026.1001",
            )
            pub.artifacts.append(artifact)
            db.add(pub)
            db.commit()

        # Seed Sample Media Asset
        media = db.query(MediaAsset).filter(MediaAsset.file_name == "alpha_amphora_profile.jpg").first()
        if not media:
            media = MediaAsset(
                id=str(uuid.uuid4()),
                site_id=site_alpha.id,
                artifact_id=artifact.id,
                lab_analysis_id=lab_test.id,
                file_name="alpha_amphora_profile.jpg",
                file_url="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
                media_type="image/jpeg",
                file_size_bytes=4194304,
                caption="High-resolution orthographic profile of amphora ART-2026-001 with centimeter scale bar.",
                camera_metadata={"camera": "Canon EOS R5", "lens": "100mm Macro f/2.8", "iso": 100, "focal_length": "100mm"},
            )
            db.add(media)
            db.commit()

    except Exception as e:
        db.rollback()
        # Seed errors should not block app startup
        pass
