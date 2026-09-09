import uuid
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from server.models import Pose, Routine, RoutinePose
from server.schemas import PoseCreate, PoseUpdate, RoutineCreate, RoutineUpdate


# --- Pose CRUD Operations ---
def get_poses(
    db: Session,
    query: Optional[str] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> List[Pose]:
    db_query = db.query(Pose)

    if query:
        search_pattern = f"%{query.strip()}%"
        db_query = db_query.filter(
            or_(
                Pose.english_name.ilike(search_pattern),
                Pose.sanskrit_name.ilike(search_pattern),
            )
        )

    if category and category.lower() not in ("all", "all categories"):
        db_query = db_query.filter(Pose.category.ilike(category.strip()))

    if difficulty and difficulty.lower() not in ("all", "all difficulties"):
        db_query = db_query.filter(Pose.difficulty.ilike(difficulty.strip()))

    return db_query.offset(skip).limit(limit).all()


def get_pose_by_id(db: Session, pose_id: str) -> Optional[Pose]:
    return db.query(Pose).filter(Pose.id == pose_id).first()


def create_pose(db: Session, pose_in: PoseCreate) -> Pose:
    db_pose = Pose(
        id=str(uuid.uuid4()),
        english_name=pose_in.english_name,
        sanskrit_name=pose_in.sanskrit_name,
        difficulty=pose_in.difficulty,
        category=pose_in.category,
        alignment_cues=pose_in.alignment_cues,
        breath_instructions=pose_in.breath_instructions,
        target_muscles=pose_in.target_muscles,
        common_mistakes=pose_in.common_mistakes,
        image_url=pose_in.image_url,
        video_url=pose_in.video_url,
    )
    db.add(db_pose)
    db.commit()
    db.refresh(db_pose)
    return db_pose


def update_pose(db: Session, db_pose: Pose, pose_in: PoseUpdate) -> Pose:
    update_data = pose_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_pose, field, value)
    db.commit()
    db.refresh(db_pose)
    return db_pose


# --- Routine CRUD Operations ---
def get_routines(db: Session, skip: int = 0, limit: int = 20) -> List[Routine]:
    return (
        db.query(Routine)
        .options(joinedload(Routine.items).joinedload(RoutinePose.pose))
        .order_by(Routine.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_routine_by_id(db: Session, routine_id: str) -> Optional[Routine]:
    return (
        db.query(Routine)
        .options(joinedload(Routine.items).joinedload(RoutinePose.pose))
        .filter(Routine.id == routine_id)
        .first()
    )


def create_routine(db: Session, routine_in: RoutineCreate) -> Routine:
    total_duration = sum(item.hold_duration_seconds for item in routine_in.items)
    db_routine = Routine(
        id=str(uuid.uuid4()),
        name=routine_in.name,
        description=routine_in.description,
        total_duration_seconds=total_duration,
    )
    db.add(db_routine)
    db.flush()

    for item in routine_in.items:
        db_item = RoutinePose(
            id=str(uuid.uuid4()),
            routine_id=db_routine.id,
            pose_id=item.pose_id,
            sequence_order=item.sequence_order,
            hold_duration_seconds=item.hold_duration_seconds,
            transition_notes=item.transition_notes,
        )
        db.add(db_item)

    db.commit()
    db.refresh(db_routine)
    return db_routine


def update_routine(
    db: Session, db_routine: Routine, routine_in: RoutineUpdate
) -> Routine:
    if routine_in.name is not None:
        db_routine.name = routine_in.name
    if routine_in.description is not None:
        db_routine.description = routine_in.description

    if routine_in.items is not None:
        # Delete existing items and insert new ones
        db.query(RoutinePose).filter(RoutinePose.routine_id == db_routine.id).delete()
        total_duration = sum(item.hold_duration_seconds for item in routine_in.items)
        db_routine.total_duration_seconds = total_duration

        for item in routine_in.items:
            db_item = RoutinePose(
                id=str(uuid.uuid4()),
                routine_id=db_routine.id,
                pose_id=item.pose_id,
                sequence_order=item.sequence_order,
                hold_duration_seconds=item.hold_duration_seconds,
                transition_notes=item.transition_notes,
            )
            db.add(db_item)

    db.commit()
    db.refresh(db_routine)
    return db_routine


def duplicate_routine(db: Session, db_routine: Routine) -> Routine:
    new_routine = Routine(
        id=str(uuid.uuid4()),
        name=f"{db_routine.name} (Copy)",
        description=db_routine.description,
        total_duration_seconds=db_routine.total_duration_seconds,
    )
    db.add(new_routine)
    db.flush()

    for item in db_routine.items:
        new_item = RoutinePose(
            id=str(uuid.uuid4()),
            routine_id=new_routine.id,
            pose_id=item.pose_id,
            sequence_order=item.sequence_order,
            hold_duration_seconds=item.hold_duration_seconds,
            transition_notes=item.transition_notes,
        )
        db.add(new_item)

    db.commit()
    db.refresh(new_routine)
    return new_routine


def delete_routine(db: Session, db_routine: Routine) -> None:
    db.delete(db_routine)
    db.commit()
