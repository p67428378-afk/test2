import os
import uuid
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./archaeology.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool if ":memory:" in DATABASE_URL else None,
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(target_engine=None):
    from server.models import (
        site,
        artifact,
        team,
        media,
        lab,
        publication,
        stratigraphy,
        custody,
        ml,
        sync,
    )

    eng = target_engine or engine
    Base.metadata.create_all(bind=eng)


def seed_data(db: Session):
    from server.models.site import ExcavationSite
    from server.models.team import ExcavationTeam, TeamMember
    from server.models.artifact import DiscoveredArtifact
    from server.models.stratigraphy import StratigraphicLayer
    from server.models.custody import StorageContainer, CustodyTransfer
    from server.models.ml import MLClassificationResult
    from server.models.media import MediaAsset

    # Check if default site exists
    existing_site = db.query(ExcavationSite).filter_by(site_code="SITE-ALP-01").first()
    if not existing_site:
        site_id = str(uuid.uuid4())
        new_site = ExcavationSite(
            id=site_id,
            name="Alpha Trench",
            site_code="SITE-ALP-01",
            region="Mediterranean",
            historical_period="Bronze Age",
            latitude=34.0522,
            longitude=-118.2437,
            altitude_meters=120.0,
            description="Primary stratified Bronze Age excavation trench with intact structural sequences.",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(new_site)
        db.flush()
    else:
        site_id = existing_site.id

    # Check or create team
    existing_team = db.query(ExcavationTeam).filter_by(unit_code="UNIT-01").first()
    if not existing_team:
        team_id = str(uuid.uuid4())
        new_team = ExcavationTeam(
            id=team_id,
            name="Excavation Unit 1",
            unit_code="UNIT-01",
            site_id=site_id,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(new_team)
        db.flush()
    else:
        team_id = existing_team.id

    # Check or create team members
    lead = db.query(TeamMember).filter_by(email="admin@example.com").first()
    if not lead:
        lead_id = str(uuid.uuid4())
        lead = TeamMember(
            id=lead_id,
            team_id=team_id,
            full_name="Dr. John Smith",
            role="Director",
            email="admin@example.com",
            phone="+1-555-0101",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(lead)
        db.flush()

    archaeologist = db.query(TeamMember).filter_by(email="test@example.com").first()
    if not archaeologist:
        arch_id = str(uuid.uuid4())
        archaeologist = TeamMember(
            id=arch_id,
            team_id=team_id,
            full_name="Dr. Jane Doe",
            role="Archaeologist",
            email="test@example.com",
            phone="+1-555-0102",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(archaeologist)
        db.flush()

    # Seed stratigraphic layers
    existing_layer = db.query(StratigraphicLayer).filter_by(site_id=site_id, layer_code="Stratum III-B").first()
    if not existing_layer:
        layers = [
            StratigraphicLayer(
                id=str(uuid.uuid4()),
                site_id=site_id,
                layer_code="Stratum I",
                historical_period="Modern Topsoil",
                depth_top_meters=0.0,
                depth_bottom_meters=0.8,
                color_hex="#A0522D",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
            StratigraphicLayer(
                id=str(uuid.uuid4()),
                site_id=site_id,
                layer_code="Stratum II",
                historical_period="Hellenistic",
                depth_top_meters=0.8,
                depth_bottom_meters=1.8,
                color_hex="#CD853F",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
            StratigraphicLayer(
                id=str(uuid.uuid4()),
                site_id=site_id,
                layer_code="Stratum III-B",
                historical_period="Late Bronze Age",
                depth_top_meters=1.8,
                depth_bottom_meters=3.5,
                color_hex="#8B4513",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
        ]
        db.add_all(layers)
        db.flush()

    # Seed storage container
    existing_container = db.query(StorageContainer).filter_by(container_code="CRATE-2026-04").first()
    if not existing_container:
        container_id = str(uuid.uuid4())
        new_container = StorageContainer(
            id=container_id,
            container_code="CRATE-2026-04",
            room_name="Storage Room 4",
            rack_number="R-02",
            bin_number="B-12",
            description="Climate controlled bin for Bronze Age ceramics.",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(new_container)
        db.flush()
    else:
        container_id = existing_container.id

    # Seed artifact
    existing_artifact = db.query(DiscoveredArtifact).filter_by(artifact_code="ART-2026-001").first()
    if not existing_artifact:
        artifact_id = str(uuid.uuid4())
        new_art = DiscoveredArtifact(
            id=artifact_id,
            site_id=site_id,
            artifact_code="ART-2026-001",
            material="Ceramic",
            context_layer="Stratum III-B",
            depth_meters=2.5,
            excavation_date="2026-05-18",
            finder_member_id=archaeologist.id,
            description="Ceramic Amphora with stamped rim and twin handles.",
            x_offset_meters=1.200,
            y_offset_meters=0.800,
            z_depth_meters=-2.500,
            qr_code_identifier="QR-ART-2026-001",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(new_art)
        db.flush()

        # Seed custody transfer
        transfer = CustodyTransfer(
            id=str(uuid.uuid4()),
            artifact_id=artifact_id,
            container_id=container_id,
            releasing_custodian_id=archaeologist.id,
            receiving_custodian_id=lead.id,
            transfer_timestamp=datetime.now(timezone.utc),
            notes="Field intake to secure repository storage.",
            created_at=datetime.now(timezone.utc),
        )
        db.add(transfer)

        # Seed media & ML result
        media_id = str(uuid.uuid4())
        media_rec = MediaAsset(
            id=media_id,
            entity_type="artifact",
            entity_id=artifact_id,
            title="Amphora Rim Photograph",
            file_url="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
            file_type="image/jpeg",
            caption="High resolution macro image of upper rim section.",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(media_rec)

        ml_rec = MLClassificationResult(
            id=str(uuid.uuid4()),
            artifact_id=artifact_id,
            media_id=media_id,
            predicted_material="Ceramic",
            confidence_score=0.942,
            anomalies_detected=[
                {"type": "micro_fracture", "severity": "medium", "description": "Micro-fracture on rim surface"}
            ],
            requires_manual_override=False,
            created_at=datetime.now(timezone.utc),
        )
        db.add(ml_rec)

    try:
        db.commit()
    except Exception:
        db.rollback()
