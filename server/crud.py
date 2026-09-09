import uuid
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, desc
from server import models, schemas


# ---------------------------------------------------------
# POSE OPERATIONS
# ---------------------------------------------------------
def get_poses(
    db: Session,
    query: Optional[str] = None,
    difficulty: Optional[str] = None,
    category: Optional[str] = None,
    user_id: str = "default_user",
    skip: int = 0,
    limit: int = 100,
) -> List[dict]:
    stmt = db.query(models.Pose)

    if query:
        search_pattern = f"%{query}%"
        stmt = stmt.filter(
            or_(
                models.Pose.english_name.ilike(search_pattern),
                models.Pose.sanskrit_name.ilike(search_pattern),
                models.Pose.target_muscles.ilike(search_pattern),
            )
        )

    if difficulty and difficulty.lower() != "all":
        stmt = stmt.filter(models.Pose.difficulty.ilike(difficulty))

    if category and category.lower() != "all":
        stmt = stmt.filter(models.Pose.category.ilike(category))

    poses = (
        stmt.order_by(models.Pose.english_name.asc()).offset(skip).limit(limit).all()
    )

    # Get favorited pose IDs for user
    fav_ids = set(
        db.query(models.UserFavorite.pose_id)
        .filter(models.UserFavorite.user_id == user_id)
        .all()
    )
    fav_ids = {f[0] for f in fav_ids}

    result = []
    for pose in poses:
        p_dict = {
            "id": pose.id,
            "english_name": pose.english_name,
            "sanskrit_name": pose.sanskrit_name,
            "difficulty": pose.difficulty,
            "category": pose.category,
            "alignment_cues": pose.alignment_cues,
            "breath_instructions": pose.breath_instructions,
            "target_muscles": pose.target_muscles,
            "common_mistakes": pose.common_mistakes,
            "image_url": pose.image_url,
            "video_url": pose.video_url,
            "created_at": pose.created_at,
            "updated_at": pose.updated_at,
            "is_favorite": pose.id in fav_ids,
        }
        result.append(p_dict)
    return result


def get_pose_by_id(
    db: Session, pose_id: str, user_id: str = "default_user"
) -> Optional[dict]:
    pose = db.query(models.Pose).filter(models.Pose.id == pose_id).first()
    if not pose:
        return None

    is_fav = (
        db.query(models.UserFavorite)
        .filter(
            models.UserFavorite.user_id == user_id,
            models.UserFavorite.pose_id == pose_id,
        )
        .first()
        is not None
    )

    return {
        "id": pose.id,
        "english_name": pose.english_name,
        "sanskrit_name": pose.sanskrit_name,
        "difficulty": pose.difficulty,
        "category": pose.category,
        "alignment_cues": pose.alignment_cues,
        "breath_instructions": pose.breath_instructions,
        "target_muscles": pose.target_muscles,
        "common_mistakes": pose.common_mistakes,
        "image_url": pose.image_url,
        "video_url": pose.video_url,
        "created_at": pose.created_at,
        "updated_at": pose.updated_at,
        "is_favorite": is_fav,
    }


def create_pose(db: Session, pose_in: schemas.PoseCreate) -> models.Pose:
    pose = models.Pose(
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
    db.add(pose)
    db.commit()
    db.refresh(pose)
    return pose


# ---------------------------------------------------------
# FAVORITE OPERATIONS
# ---------------------------------------------------------
def add_pose_favorite(
    db: Session, pose_id: str, user_id: str = "default_user"
) -> models.UserFavorite:
    pose = db.query(models.Pose).filter(models.Pose.id == pose_id).first()
    if not pose:
        raise ValueError("Pose not found")

    existing = (
        db.query(models.UserFavorite)
        .filter(
            models.UserFavorite.user_id == user_id,
            models.UserFavorite.pose_id == pose_id,
        )
        .first()
    )
    if existing:
        return existing

    favorite = models.UserFavorite(
        id=str(uuid.uuid4()),
        user_id=user_id,
        pose_id=pose_id,
    )
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite


def remove_pose_favorite(
    db: Session, pose_id: str, user_id: str = "default_user"
) -> bool:
    fav = (
        db.query(models.UserFavorite)
        .filter(
            models.UserFavorite.user_id == user_id,
            models.UserFavorite.pose_id == pose_id,
        )
        .first()
    )
    if not fav:
        return False
    db.delete(fav)
    db.commit()
    return True


def get_favorite_poses(db: Session, user_id: str = "default_user") -> List[dict]:
    favs = (
        db.query(models.UserFavorite)
        .filter(models.UserFavorite.user_id == user_id)
        .options(joinedload(models.UserFavorite.pose))
        .all()
    )
    result = []
    for fav in favs:
        if fav.pose:
            p = fav.pose
            result.append(
                {
                    "id": p.id,
                    "english_name": p.english_name,
                    "sanskrit_name": p.sanskrit_name,
                    "difficulty": p.difficulty,
                    "category": p.category,
                    "alignment_cues": p.alignment_cues,
                    "breath_instructions": p.breath_instructions,
                    "target_muscles": p.target_muscles,
                    "common_mistakes": p.common_mistakes,
                    "image_url": p.image_url,
                    "video_url": p.video_url,
                    "created_at": p.created_at,
                    "updated_at": p.updated_at,
                    "is_favorite": True,
                }
            )
    return result


# ---------------------------------------------------------
# ROUTINE OPERATIONS
# ---------------------------------------------------------
def get_routines(db: Session, skip: int = 0, limit: int = 100) -> List[models.Routine]:
    return (
        db.query(models.Routine)
        .options(joinedload(models.Routine.poses).joinedload(models.RoutinePose.pose))
        .order_by(desc(models.Routine.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_routine_by_id(db: Session, routine_id: str) -> Optional[models.Routine]:
    return (
        db.query(models.Routine)
        .options(joinedload(models.Routine.poses).joinedload(models.RoutinePose.pose))
        .filter(models.Routine.id == routine_id)
        .first()
    )


def create_routine(db: Session, routine_in: schemas.RoutineCreate) -> models.Routine:
    pose_items = routine_in.poses if routine_in.poses else (routine_in.items or [])
    if not pose_items:
        raise ValueError(
            "Empty routines cannot be saved. At least one pose is required."
        )

    # Validate that all pose_ids exist
    pose_ids = [item.pose_id for item in pose_items]
    existing_poses = db.query(models.Pose.id).filter(models.Pose.id.in_(pose_ids)).all()
    found_ids = {p[0] for p in existing_poses}
    for pid in pose_ids:
        if pid not in found_ids:
            raise ValueError(f"Pose with ID '{pid}' does not exist.")

    total_duration = sum(item.hold_duration_seconds for item in pose_items)

    routine = models.Routine(
        id=str(uuid.uuid4()),
        name=routine_in.name,
        description=routine_in.description,
        total_duration_seconds=total_duration,
    )
    db.add(routine)
    db.flush()

    for idx, item in enumerate(pose_items):
        seq = item.sequence_order if item.sequence_order is not None else idx + 1
        rp = models.RoutinePose(
            id=str(uuid.uuid4()),
            routine_id=routine.id,
            pose_id=item.pose_id,
            sequence_order=seq,
            hold_duration_seconds=item.hold_duration_seconds,
            transition_notes=item.transition_notes,
        )
        db.add(rp)

    db.commit()
    db.refresh(routine)
    return get_routine_by_id(db, routine.id)


def update_routine(
    db: Session, routine_id: str, routine_in: schemas.RoutineUpdate
) -> Optional[models.Routine]:
    routine = db.query(models.Routine).filter(models.Routine.id == routine_id).first()
    if not routine:
        return None

    if routine_in.name is not None:
        routine.name = routine_in.name
    if routine_in.description is not None:
        routine.description = routine_in.description

    pose_items = routine_in.poses if routine_in.poses is not None else routine_in.items
    if pose_items is not None:
        if len(pose_items) == 0:
            raise ValueError(
                "Empty routines cannot be saved. At least one pose is required."
            )

        # Validate that all pose_ids exist
        pose_ids = [item.pose_id for item in pose_items]
        existing_poses = (
            db.query(models.Pose.id).filter(models.Pose.id.in_(pose_ids)).all()
        )
        found_ids = {p[0] for p in existing_poses}
        for pid in pose_ids:
            if pid not in found_ids:
                raise ValueError(f"Pose with ID '{pid}' does not exist.")

        # Clear existing items
        db.query(models.RoutinePose).filter(
            models.RoutinePose.routine_id == routine_id
        ).delete()

        total_duration = sum(item.hold_duration_seconds for item in pose_items)
        routine.total_duration_seconds = total_duration

        for idx, item in enumerate(pose_items):
            seq = item.sequence_order if item.sequence_order is not None else idx + 1
            rp = models.RoutinePose(
                id=str(uuid.uuid4()),
                routine_id=routine.id,
                pose_id=item.pose_id,
                sequence_order=seq,
                hold_duration_seconds=item.hold_duration_seconds,
                transition_notes=item.transition_notes,
            )
            db.add(rp)

    db.commit()
    return get_routine_by_id(db, routine_id)


def duplicate_routine(db: Session, routine_id: str) -> Optional[models.Routine]:
    orig = get_routine_by_id(db, routine_id)
    if not orig:
        return None

    new_routine = models.Routine(
        id=str(uuid.uuid4()),
        name=f"{orig.name} (Copy)",
        description=orig.description,
        total_duration_seconds=orig.total_duration_seconds,
    )
    db.add(new_routine)
    db.flush()

    for item in orig.poses:
        new_item = models.RoutinePose(
            id=str(uuid.uuid4()),
            routine_id=new_routine.id,
            pose_id=item.pose_id,
            sequence_order=item.sequence_order,
            hold_duration_seconds=item.hold_duration_seconds,
            transition_notes=item.transition_notes,
        )
        db.add(new_item)

    db.commit()
    return get_routine_by_id(db, new_routine.id)


def delete_routine(db: Session, routine_id: str) -> bool:
    routine = db.query(models.Routine).filter(models.Routine.id == routine_id).first()
    if not routine:
        return False
    db.delete(routine)
    db.commit()
    return True


# ---------------------------------------------------------
# PRACTICE SESSION OPERATIONS
# ---------------------------------------------------------
def create_practice_session(
    db: Session, session_in: schemas.PracticeSessionCreate
) -> models.PracticeSession:
    if session_in.routine_id:
        r = (
            db.query(models.Routine.id)
            .filter(models.Routine.id == session_in.routine_id)
            .first()
        )
        if not r:
            session_in.routine_id = None

    ps = models.PracticeSession(
        id=str(uuid.uuid4()),
        user_id=session_in.user_id or "default_user",
        routine_id=session_in.routine_id,
        completed_duration_seconds=session_in.completed_duration_seconds,
        poses_completed=session_in.poses_completed,
        notes=session_in.notes,
    )
    db.add(ps)
    db.commit()
    db.refresh(ps)
    return ps


def get_practice_sessions(
    db: Session,
    user_id: str = "default_user",
    skip: int = 0,
    limit: int = 100,
) -> List[dict]:
    sessions = (
        db.query(models.PracticeSession)
        .options(joinedload(models.PracticeSession.routine))
        .filter(models.PracticeSession.user_id == user_id)
        .order_by(desc(models.PracticeSession.completed_at))
        .offset(skip)
        .limit(limit)
        .all()
    )

    result = []
    for s in sessions:
        result.append(
            {
                "id": s.id,
                "user_id": s.user_id,
                "routine_id": s.routine_id,
                "completed_duration_seconds": s.completed_duration_seconds,
                "poses_completed": s.poses_completed,
                "notes": s.notes,
                "completed_at": s.completed_at,
                "routine_name": s.routine.name if s.routine else "Custom Flow",
            }
        )
    return result
