import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from server.models import Base, Pose, Routine, RoutinePose

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/yoga_app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(engine_override=None) -> None:
    target_engine = engine_override or engine
    Base.metadata.create_all(bind=target_engine)


def seed_data(db: Session) -> None:
    # Seed predefined yoga poses if catalog is empty
    if db.query(Pose).count() == 0:
        seed_poses = [
            Pose(
                id="3fa85f64-5717-4562-b3fc-2c963f66afa1",
                english_name="Downward-Facing Dog",
                sanskrit_name="Adho Mukha Svanasana",
                difficulty="Beginner",
                category="Inversion",
                alignment_cues=[
                    "Spread fingers wide and ground palms firmly into the mat.",
                    "Lift sit bones toward ceiling, lengthening spine.",
                    "Press heels gently downward while keeping knees soft.",
                    "Keep head relaxed between upper arms, gazing toward navel.",
                ],
                breath_instructions="Inhale to press floor away, exhale to draw naval inward and deepen hip hinge.",
                target_muscles=["Hamstrings", "Calves", "Shoulders", "Lats"],
                common_mistakes=[
                    "Rounding the lower spine instead of bending the knees.",
                    "Putting excessive weight onto wrists instead of knuckles.",
                ],
                image_url="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
                video_url="https://www.youtube.com/watch?v=6Ep5VzGqYS8",
            ),
            Pose(
                id="3fa85f64-5717-4562-b3fc-2c963f66afa2",
                english_name="Warrior I",
                sanskrit_name="Virabhadrasana I",
                difficulty="Beginner",
                category="Standing",
                alignment_cues=[
                    "Step one foot forward into a deep lunge with knee stacked over ankle.",
                    "Turn back foot out at a 45-degree angle, grounding outer heel.",
                    "Square hips toward the front edge of the mat.",
                    "Reach arms overhead with palms facing each other.",
                ],
                breath_instructions="Inhale as you raise arms and lengthen torso, exhale to sink hips down.",
                target_muscles=["Quadriceps", "Glutes", "Hip Flexors", "Deltoids"],
                common_mistakes=[
                    "Front knee collapsing inward past the big toe.",
                    "Back heel lifting off the ground.",
                ],
                image_url="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600",
                video_url=None,
            ),
            Pose(
                id="3fa85f64-5717-4562-b3fc-2c963f66afa3",
                english_name="Warrior II",
                sanskrit_name="Virabhadrasana II",
                difficulty="Beginner",
                category="Standing",
                alignment_cues=[
                    "Step feet wide apart with front toes pointing forward and back toes perpendicular.",
                    "Bend front knee to 90 degrees directly above ankle.",
                    "Extend arms parallel to the floor, actively reaching front and back.",
                    "Gaze steadily over front middle finger.",
                ],
                breath_instructions="Inhale to expand the chest laterally, exhale to root down through both feet.",
                target_muscles=["Adductors", "Quadriceps", "Shoulders", "Core"],
                common_mistakes=[
                    "Leaning torso too far forward over the front knee.",
                    "Allowing back arm to drop below shoulder level.",
                ],
                image_url="https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600",
                video_url=None,
            ),
            Pose(
                id="3fa85f64-5717-4562-b3fc-2c963f66afa4",
                english_name="Warrior III",
                sanskrit_name="Virabhadrasana III",
                difficulty="Intermediate",
                category="Balance",
                alignment_cues=[
                    "Shift weight onto standing leg with a micro-bend in knee.",
                    "Hinge at the hips until torso and lifted leg are parallel to floor.",
                    "Flex back foot, pointing toes toward ground to square hips.",
                    "Reach arms forward or alongside the body for balance.",
                ],
                breath_instructions="Inhale to find length from fingertips to back heel, exhale to engage core stabilizers.",
                target_muscles=["Glutes", "Hamstrings", "Erector Spinae", "Ankles"],
                common_mistakes=[
                    "Opening the hip of the lifted leg upward.",
                    "Hyperextending the standing knee joint.",
                ],
                image_url="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600",
                video_url=None,
            ),
            Pose(
                id="3fa85f64-5717-4562-b3fc-2c963f66afa5",
                english_name="Tree Pose",
                sanskrit_name="Vrikshasana",
                difficulty="Beginner",
                category="Balance",
                alignment_cues=[
                    "Root standing foot firmly into the earth.",
                    "Place sole of opposite foot on inner calf or inner thigh (never on the knee).",
                    "Bring hands together at heart center or reach overhead like branches.",
                    "Fix gaze (Drishti) on an unmoving point straight ahead.",
                ],
                breath_instructions="Breathe smoothly and rhythmically to maintain equilibrium and calm focus.",
                target_muscles=["Calves", "Thighs", "Gluteus Medius", "Abdominals"],
                common_mistakes=[
                    "Placing the foot directly against the knee joint.",
                    "Pushing standing hip out to the side.",
                ],
                image_url="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600",
                video_url=None,
            ),
            Pose(
                id="3fa85f64-5717-4562-b3fc-2c963f66afa6",
                english_name="Child's Pose",
                sanskrit_name="Balasana",
                difficulty="Beginner",
                category="Restorative",
                alignment_cues=[
                    "Kneel on mat with big toes touching and knees wide apart.",
                    "Sit hips back toward heels and fold torso between thighs.",
                    "Rest forehead gently on the mat.",
                    "Extend arms long in front or rest them alongside the torso.",
                ],
                breath_instructions="Direct deep inhalations into back ribs, exhale to surrender weight into the floor.",
                target_muscles=["Lower Back", "Hips", "Ankles", "Spine"],
                common_mistakes=[
                    "Holding tension in the neck or shoulders.",
                    "Forcing hips down if knees feel strained.",
                ],
                image_url="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
                video_url=None,
            ),
            Pose(
                id="3fa85f64-5717-4562-b3fc-2c963f66afa7",
                english_name="Cobra Pose",
                sanskrit_name="Bhujangasana",
                difficulty="Beginner",
                category="Restorative",
                alignment_cues=[
                    "Lie prone with tops of feet pressing firmly into the mat.",
                    "Place palms under shoulders with elbows hugging into ribcage.",
                    "Engage back muscles to lift chest forward and up.",
                    "Keep neck long and gaze slightly upward without crunching cervical spine.",
                ],
                breath_instructions="Inhale smoothly as you lift chest, exhale to lower with control.",
                target_muscles=["Erector Spinae", "Glutes", "Chest", "Shoulders"],
                common_mistakes=[
                    "Pushing entirely with hands rather than engaging back musculature.",
                    "Splaying elbows wide away from the torso.",
                ],
                image_url="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600",
                video_url=None,
            ),
            Pose(
                id="3fa85f64-5717-4562-b3fc-2c963f66afa8",
                english_name="Crow Pose",
                sanskrit_name="Bakasana",
                difficulty="Advanced",
                category="Balance",
                alignment_cues=[
                    "Squat low and place hands flat on floor shoulder-width apart.",
                    "Place knees high onto the backs of upper arms near triceps/armpits.",
                    "Shift weight forward onto hands, looking ahead rather than down.",
                    "Engage core and lift one foot, then the other, bringing big toes to touch.",
                ],
                breath_instructions="Maintain steady shallow breathing through the nose while maintaining strong abdominal bandhas.",
                target_muscles=[
                    "Wrist Flexors",
                    "Triceps",
                    "Anterior Deltoids",
                    "Transverse Abdominis",
                ],
                common_mistakes=[
                    "Looking straight down, which causes momentum to fall forward.",
                    "Allowing elbows to flare outward instead of staying stacked over wrists.",
                ],
                image_url="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600",
                video_url=None,
            ),
            Pose(
                id="3fa85f64-5717-4562-b3fc-2c963f66afa9",
                english_name="Headstand",
                sanskrit_name="Sirsasana",
                difficulty="Advanced",
                category="Inversion",
                alignment_cues=[
                    "Interlace fingers to form a cup on the mat, placing forearms elbow-width apart.",
                    "Crown of head rests on mat with back of head cradled by palms.",
                    "Walk feet in toward elbows until spine is vertical over shoulders.",
                    "Engage core and lift legs upward in control into a straight vertical column.",
                ],
                breath_instructions="Breathe calmly and slowly, keeping 80% of weight supported by forearms.",
                target_muscles=["Shoulders", "Upper Back", "Core", "Neck Stabilizers"],
                common_mistakes=[
                    "Dumping body weight into the neck rather than active forearms.",
                    "Arching the lower back into a banana shape.",
                ],
                image_url="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
                video_url=None,
            ),
            Pose(
                id="3fa85f64-5717-4562-b3fc-2c963f66afb0",
                english_name="Seated Forward Bend",
                sanskrit_name="Paschimottanasana",
                difficulty="Beginner",
                category="Seated",
                alignment_cues=[
                    "Sit tall with legs extended straight in front, flexing feet.",
                    "Inhale to lengthen spine upward toward the sky.",
                    "Exhale to hinge forward from the hips, leading with the chest.",
                    "Hold outer edges of feet, ankles, or shins while keeping spine long.",
                ],
                breath_instructions="Inhale to find subtle extension in the spine, exhale to deepen hip fold.",
                target_muscles=["Hamstrings", "Lower Back", "Calves", "Spine"],
                common_mistakes=[
                    "Rounding the upper back to touch toes instead of hinging from pelvis.",
                    "Locking the knee joints rigidly.",
                ],
                image_url="https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600",
                video_url=None,
            ),
        ]
        db.add_all(seed_poses)
        db.commit()

    # Seed sample routine if none exists
    if db.query(Routine).count() == 0:
        sample_routine = Routine(
            id="4fa85f64-5717-4562-b3fc-2c963f66b001",
            name="Morning Energizer Flow",
            description="15-minute invigorating morning sequence designed for hip mobility and spine wake-up.",
            total_duration_seconds=150,
        )
        db.add(sample_routine)
        db.flush()

        items = [
            RoutinePose(
                id="5fa85f64-5717-4562-b3fc-2c963f66c001",
                routine_id=sample_routine.id,
                pose_id="3fa85f64-5717-4562-b3fc-2c963f66afa6",
                sequence_order=1,
                hold_duration_seconds=60,
                transition_notes="Deep grounding breaths to center the mind",
            ),
            RoutinePose(
                id="5fa85f64-5717-4562-b3fc-2c963f66c002",
                routine_id=sample_routine.id,
                pose_id="3fa85f64-5717-4562-b3fc-2c963f66afa1",
                sequence_order=2,
                hold_duration_seconds=45,
                transition_notes="Press hips high and pedal out feet gently",
            ),
            RoutinePose(
                id="5fa85f64-5717-4562-b3fc-2c963f66c003",
                routine_id=sample_routine.id,
                pose_id="3fa85f64-5717-4562-b3fc-2c963f66afa2",
                sequence_order=3,
                hold_duration_seconds=45,
                transition_notes="Step right foot forward smoothly into lunge",
            ),
        ]
        db.add_all(items)
        db.commit()
