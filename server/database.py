import os
import uuid
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/yoga_app.db")

# For SQLite, handle same thread check
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    future=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create all database tables."""
    # Import models to ensure they are registered with Base.metadata
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session) -> None:
    """Seed initial yoga poses and default custom routine idempotently."""
    from server.models import Pose, Routine, RoutinePose

    # Check if poses already exist
    existing_pose = db.query(Pose).first()
    if not existing_pose:
        initial_poses = [
            Pose(
                id=str(uuid.uuid4()),
                english_name="Downward-Facing Dog",
                sanskrit_name="Adho Mukha Svanasana",
                difficulty="Beginner",
                category="Inversion",
                alignment_cues="Spread fingers wide, press hands into mat, lift sit bones high, melt heels toward floor with knees soft.",
                breath_instructions="Inhale to lengthen the spine, exhale to press chest gently toward thighs.",
                target_muscles="Hamstrings, calves, shoulders, spine, core",
                common_mistakes="Rounding the lower back, placing too much weight on wrists, locking knees.",
                image_url="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
                video_url="https://www.youtube.com/watch?v=EC7RGJ945nM",
            ),
            Pose(
                id=str(uuid.uuid4()),
                english_name="Warrior I",
                sanskrit_name="Virabhadrasana I",
                difficulty="Beginner",
                category="Standing",
                alignment_cues="Step one foot forward into a deep lunge, square hips forward, reach arms overhead with palms facing inward.",
                breath_instructions="Inhale to extend through fingertips, exhale to ground through both feet.",
                target_muscles="Quadriceps, glutes, calves, chest, shoulders",
                common_mistakes="Front knee extending past toes, back heel lifting off the floor, arched lower back.",
                image_url="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
                video_url="",
            ),
            Pose(
                id=str(uuid.uuid4()),
                english_name="Warrior II",
                sanskrit_name="Virabhadrasana II",
                difficulty="Beginner",
                category="Standing",
                alignment_cues="Extend arms parallel to the floor, bend front knee to 90 degrees, gaze over front fingertips with open hips.",
                breath_instructions="Inhale to open the chest, exhale to sink lower into the front hip crease.",
                target_muscles="Quadriceps, hamstrings, adductors, shoulders",
                common_mistakes="Leaning torso too far forward over front leg, collapsing front knee inward.",
                image_url="https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=600&q=80",
                video_url="",
            ),
            Pose(
                id=str(uuid.uuid4()),
                english_name="Warrior III",
                sanskrit_name="Virabhadrasana III",
                difficulty="Intermediate",
                category="Balance",
                alignment_cues="Hinge at the hips, extend one leg straight back parallel to the floor, reach arms forward creating a T-shape with body.",
                breath_instructions="Inhale to elongate from heel to fingertips, exhale to engage core stabilizers.",
                target_muscles="Core, hamstrings, glutes, spinal erectors, ankles",
                common_mistakes="Opening standing hip outward, letting chest drop lower than hips.",
                image_url="https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80",
                video_url="",
            ),
            Pose(
                id=str(uuid.uuid4()),
                english_name="Tree Pose",
                sanskrit_name="Vrksasana",
                difficulty="Beginner",
                category="Balance",
                alignment_cues="Shift weight to standing foot, place sole of other foot on inner calf or thigh (avoiding knee), bring hands to heart center.",
                breath_instructions="Steady even breathing, focus gaze on a stationary point (drishti).",
                target_muscles="Ankles, calves, thighs, core, pelvic floor",
                common_mistakes="Placing foot directly on knee joint, hiking hip up on lifted side.",
                image_url="https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=600&q=80",
                video_url="",
            ),
            Pose(
                id=str(uuid.uuid4()),
                english_name="Child's Pose",
                sanskrit_name="Balasana",
                difficulty="Beginner",
                category="Restorative",
                alignment_cues="Kneel on mat, big toes touching, sit on heels, fold forward extending arms in front and resting forehead on mat.",
                breath_instructions="Deep diaphragmatic breaths into the back rib cage.",
                target_muscles="Hips, thighs, ankles, lower back, spine",
                common_mistakes="Forcing hips down when tight, holding tension in shoulders and neck.",
                image_url="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
                video_url="",
            ),
            Pose(
                id=str(uuid.uuid4()),
                english_name="Cobra Pose",
                sanskrit_name="Bhujangasana",
                difficulty="Beginner",
                category="Restorative",
                alignment_cues="Lie prone on mat, hands under shoulders, press tops of feet into floor, gently lift chest using back muscles.",
                breath_instructions="Inhale to draw chest upward and open collarbones, exhale to release shoulders away from ears.",
                target_muscles="Spinal extensors, chest, glutes, shoulders",
                common_mistakes="Crunched lower back, pushing with arms rather than using back muscles, tense neck.",
                image_url="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
                video_url="",
            ),
            Pose(
                id=str(uuid.uuid4()),
                english_name="Corpse Pose",
                sanskrit_name="Savasana",
                difficulty="Beginner",
                category="Restorative",
                alignment_cues="Lie flat on back, legs hip-width apart, arms by sides palms up, close eyes and release all physical effort.",
                breath_instructions="Natural effortless breathing, relaxing deeper with each exhale.",
                target_muscles="Full body relaxation, nervous system down-regulation",
                common_mistakes="Fidgeting, holding subtle tension in jaw or forehead, sleeping.",
                image_url="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
                video_url="",
            ),
            Pose(
                id=str(uuid.uuid4()),
                english_name="Seated Forward Bend",
                sanskrit_name="Paschimottanasana",
                difficulty="Intermediate",
                category="Seated",
                alignment_cues="Sit with legs extended straight forward, flex feet, hinge from hips keeping spine long, reach for shins or feet.",
                breath_instructions="Inhale to lengthen torso, exhale to fold gently forward.",
                target_muscles="Hamstrings, calves, spine, lower back",
                common_mistakes="Rounding upper back to grab toes, locking knees.",
                image_url="https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=600&q=80",
                video_url="",
            ),
            Pose(
                id=str(uuid.uuid4()),
                english_name="Headstand",
                sanskrit_name="Sirsasana",
                difficulty="Advanced",
                category="Inversion",
                alignment_cues="Interlace fingers behind crown of head, create strong forearm triangle base, engage core and press shoulders away from ears to lift legs.",
                breath_instructions="Slow steady breath, maintain core stabilization.",
                target_muscles="Shoulders, arms, core, upper back, neck stabilizers",
                common_mistakes="Dumping weight into cervical spine, kicking up uncontrollably.",
                image_url="https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80",
                video_url="",
            ),
        ]
        db.add_all(initial_poses)
        db.commit()

    # Seed sample routine if none exists
    existing_routine = db.query(Routine).first()
    if not existing_routine:
        all_poses = db.query(Pose).all()
        if len(all_poses) >= 4:
            routine_id = str(uuid.uuid4())
            sample_routine = Routine(
                id=routine_id,
                name="Morning Flow Sequence",
                description="An invigorating 15-minute sequence to awaken the body and sharpen focus.",
                total_duration_seconds=180,
            )
            db.add(sample_routine)
            db.flush()

            selected_poses = all_poses[:4]
            durations = [30, 45, 45, 60]
            notes = [
                "Ground palms and awaken the hamstrings.",
                "Step right foot forward smoothly into high lunge.",
                "Open hips and extend arms strongly.",
                "Conclude with grounding stillness.",
            ]

            for idx, pose in enumerate(selected_poses):
                rp = RoutinePose(
                    id=str(uuid.uuid4()),
                    routine_id=routine_id,
                    pose_id=pose.id,
                    sequence_order=idx + 1,
                    hold_duration_seconds=durations[idx],
                    transition_notes=notes[idx],
                )
                db.add(rp)
            db.commit()
