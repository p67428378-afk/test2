import os
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import IntegrityError

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/mbbs_learning.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from server.models import Base

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models import (
        User,
        Module,
        ImageLayer,
        Hotspot,
        AnimationCheckpoint,
        StudentProgress,
    )
    from server.auth import get_password_hash

    # 1. Seed Users
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    if not test_user:
        test_user = User(
            email="test@example.com",
            hashed_password=get_password_hash("testpassword"),
            full_name="1st Year MBBS Student",
            role="student",
            is_active=True,
            is_verified=True,
            created_at=datetime.now(timezone.utc),
        )
        try:
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
        except IntegrityError:
            db.rollback()
            test_user = db.query(User).filter(User.email == "test@example.com").first()

    admin_user = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin_user:
        admin_user = User(
            email="admin@example.com",
            hashed_password=get_password_hash("adminpassword"),
            full_name="Medical Faculty Administrator",
            role="admin",
            is_active=True,
            is_verified=True,
            created_at=datetime.now(timezone.utc),
        )
        try:
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
        except IntegrityError:
            db.rollback()
            admin_user = (
                db.query(User).filter(User.email == "admin@example.com").first()
            )

    # 2. Seed Modules
    mod_anatomy = (
        db.query(Module)
        .filter(Module.title == "Brachial Plexus Anatomy & Innervation")
        .first()
    )
    if not mod_anatomy:
        mod_anatomy = Module(
            title="Brachial Plexus Anatomy & Innervation",
            subject="anatomy",
            description="Comprehensive multi-layer anatomical dissection of the human brachial plexus (Roots, Trunks, Divisions, Cords, and Terminal Branches) for 1st-year MBBS curriculum.",
            thumbnail_url="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800",
            animation_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            created_at=datetime.now(timezone.utc),
        )
        db.add(mod_anatomy)
        db.commit()
        db.refresh(mod_anatomy)

        # Layers for Anatomy
        layers = [
            ImageLayer(
                module_id=mod_anatomy.id,
                layer_name="Skeletal Framework",
                layer_order=1,
                image_url="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1200",
            ),
            ImageLayer(
                module_id=mod_anatomy.id,
                layer_name="Muscular Layer",
                layer_order=2,
                image_url="https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200",
            ),
            ImageLayer(
                module_id=mod_anatomy.id,
                layer_name="Vascular Network",
                layer_order=3,
                image_url="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200",
            ),
            ImageLayer(
                module_id=mod_anatomy.id,
                layer_name="Neural Plexus",
                layer_order=4,
                image_url="https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200",
            ),
        ]
        db.add_all(layers)
        db.commit()
        for layer in layers:
            db.refresh(layer)

        # Hotspots
        neural_layer = layers[3]
        vascular_layer = layers[2]
        hotspots = [
            Hotspot(
                layer_id=neural_layer.id,
                x_percent=32.5,
                y_percent=45.0,
                title="Musculocutaneous Nerve",
                clinical_notes="Arises from lateral cord (C5-C7). Pierces coracobrachialis and innervates anterior arm muscles (Biceps, Brachialis).",
                clinical_significance="Lesions cause marked loss of forearm flexion and weakened supination (biceps brachii).",
            ),
            Hotspot(
                layer_id=neural_layer.id,
                x_percent=55.0,
                y_percent=52.0,
                title="Radial Nerve",
                clinical_notes="Largest branch of the posterior cord (C5-T1). Descends in radial groove alongside deep brachial artery.",
                clinical_significance="Vulnerable in mid-shaft humeral fractures; injury manifests as 'wrist drop' and dorsal sensory loss.",
            ),
            Hotspot(
                layer_id=neural_layer.id,
                x_percent=42.0,
                y_percent=68.0,
                title="Median Nerve",
                clinical_notes="Formed by union of lateral and medial roots. Passes beneath flexor retinaculum into carpal tunnel.",
                clinical_significance="Compression in Carpal Tunnel Syndrome causes thenar muscle atrophy ('ape hand') and radial 3.5 digit numbness.",
            ),
            Hotspot(
                layer_id=neural_layer.id,
                x_percent=68.0,
                y_percent=64.0,
                title="Ulnar Nerve",
                clinical_notes="Originates from medial cord (C8-T1). Courses behind medial epicondyle ('funny bone').",
                clinical_significance="Injury causes 'claw hand' (Klumpke's palsy component) and loss of hypothenar function.",
            ),
            Hotspot(
                layer_id=vascular_layer.id,
                x_percent=48.0,
                y_percent=38.0,
                title="Axillary Artery",
                clinical_notes="Continuation of subclavian artery at outer border of 1st rib, closely embraced by the cords of the plexus.",
                clinical_significance="Key vascular landmark during axillary brachial plexus block and surgical dissections.",
            ),
        ]
        db.add_all(hotspots)
        db.commit()

    mod_physio = (
        db.query(Module)
        .filter(Module.title == "Cardiac Cycle Mechanics & Wiggers Diagram")
        .first()
    )
    if not mod_physio:
        mod_physio = Module(
            title="Cardiac Cycle Mechanics & Wiggers Diagram",
            subject="physiology",
            description="Dynamic simulation of ventricular systole, diastole, ECG correlation, intracardiac pressure-volume loops, and valve mechanics for 1st-year cardiovascular physiology.",
            thumbnail_url="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800",
            animation_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            created_at=datetime.now(timezone.utc),
        )
        db.add(mod_physio)
        db.commit()
        db.refresh(mod_physio)

        checkpoints = [
            AnimationCheckpoint(
                module_id=mod_physio.id,
                timestamp_seconds=75.0,
                question_text="What clinical and physiological event marks the exact onset of ventricular systole?",
                options=[
                    "Closure of atrioventricular (AV) valves (First Heart Sound, S1)",
                    "Opening of the aortic semilunar valve",
                    "Closure of aortic and pulmonary valves (Second Heart Sound, S2)",
                    "Isovolumetric ventricular relaxation",
                ],
                correct_option=0,
            ),
            AnimationCheckpoint(
                module_id=mod_physio.id,
                timestamp_seconds=120.0,
                question_text="During which phase of the cardiac cycle are all four cardiac valves closed while ventricular pressure rises steeply?",
                options=[
                    "Ventricular diastasis",
                    "Isovolumetric contraction phase",
                    "Rapid ventricular ejection phase",
                    "Reduced ventricular ejection phase",
                ],
                correct_option=1,
            ),
            AnimationCheckpoint(
                module_id=mod_physio.id,
                timestamp_seconds=165.0,
                question_text="On the Wiggers diagram, what mechanical event corresponds to the incisura (dicrotic notch) on the aortic pressure curve?",
                options=[
                    "Rapid ventricular ejection peak",
                    "Closure of the aortic valve producing retrograde blood rebound",
                    "Opening of the mitral valve",
                    "Atrial systole adding atrial kick",
                ],
                correct_option=1,
            ),
        ]
        db.add_all(checkpoints)
        db.commit()

    mod_biochem = (
        db.query(Module)
        .filter(Module.title == "Glycolysis & Cellular Respiration Pathway")
        .first()
    )
    if not mod_biochem:
        mod_biochem = Module(
            title="Glycolysis & Cellular Respiration Pathway",
            subject="biochemistry",
            description="Interactive molecular pathway tracing glucose breakdown, rate-limiting enzymatic regulation (PFK-1), allosteric modulators, and net ATP energetic yields.",
            thumbnail_url="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800",
            animation_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            created_at=datetime.now(timezone.utc),
        )
        db.add(mod_biochem)
        db.commit()
        db.refresh(mod_biochem)

        b_layer = ImageLayer(
            module_id=mod_biochem.id,
            layer_name="Enzymatic Cascade Layer",
            layer_order=1,
            image_url="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200",
        )
        db.add(b_layer)
        db.commit()
        db.refresh(b_layer)

        b_hotspot = Hotspot(
            layer_id=b_layer.id,
            x_percent=50.0,
            y_percent=42.0,
            title="Phosphofructokinase-1 (PFK-1) Rate Limiter",
            clinical_notes="Catalyzes Fructose-6-P -> Fructose-1,6-bisP. Allosterically inhibited by ATP/Citrate, activated by AMP and F-2,6-BP.",
            clinical_significance="Key metabolic switch deregulated in metabolic acidosis and target of insulin signaling.",
        )
        db.add(b_hotspot)

        b_checkpoints = [
            AnimationCheckpoint(
                module_id=mod_biochem.id,
                timestamp_seconds=60.0,
                question_text="Which enzyme catalyzes the primary rate-limiting, committed step of glycolysis in human cells?",
                options=[
                    "Hexokinase",
                    "Phosphofructokinase-1 (PFK-1)",
                    "Pyruvate Kinase",
                    "Phosphoglucomutase",
                ],
                correct_option=1,
            ),
            AnimationCheckpoint(
                module_id=mod_biochem.id,
                timestamp_seconds=110.0,
                question_text="What is the net gain of ATP molecules synthesized per molecule of glucose oxidized via anaerobic glycolysis?",
                options=["2 ATP", "4 ATP", "30 ATP", "32 ATP"],
                correct_option=0,
            ),
        ]
        db.add_all(b_checkpoints)
        db.commit()

    # Seed initial progress for test_user
    if test_user and mod_anatomy:
        prog = (
            db.query(StudentProgress)
            .filter(
                StudentProgress.user_id == test_user.id,
                StudentProgress.module_id == mod_anatomy.id,
            )
            .first()
        )
        if not prog:
            prog = StudentProgress(
                user_id=test_user.id,
                module_id=mod_anatomy.id,
                score=90,
                completed_checkpoints=["chk_bp_1", "chk_bp_2"],
                is_completed=True,
                completed_at=datetime.now(timezone.utc),
            )
            db.add(prog)
            db.commit()
