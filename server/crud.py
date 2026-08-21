import uuid
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from fastapi import HTTPException, status
from server import models, schemas
from server.database import get_password_hash


def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_user(db: Session, user_data: schemas.UserCreate) -> models.User:
    existing = get_user_by_email(db, user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
    user = models.User(
        id=str(uuid.uuid4()),
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=get_password_hash(user_data.password),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_or_create_skill(
    db: Session, name: str, category: Optional[str] = None
) -> models.Skill:
    clean_name = name.strip()
    skill = db.query(models.Skill).filter(models.Skill.name.ilike(clean_name)).first()
    if not skill:
        skill = models.Skill(id=str(uuid.uuid4()), name=clean_name, category=category)
        db.add(skill)
        db.commit()
        db.refresh(skill)
    return skill


def create_user_skill(
    db: Session, user_id: str, skill_data: schemas.UserSkillCreate
) -> models.UserSkillResponse:
    if not skill_data.skill_name or not skill_data.skill_name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Skill name cannot be empty"
        )

    skill_type = skill_data.type.upper()
    if skill_type not in ["TEACH", "LEARN"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Skill type must be TEACH or LEARN",
        )

    prof = skill_data.proficiency.upper()
    if prof not in ["BEGINNER", "INTERMEDIATE", "EXPERT"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Proficiency must be BEGINNER, INTERMEDIATE, or EXPERT",
        )

    skill = get_or_create_skill(db, skill_data.skill_name, skill_data.category)

    # Check for duplicate skill in user's profile
    existing_us = (
        db.query(models.UserSkill)
        .filter(
            models.UserSkill.user_id == user_id,
            models.UserSkill.skill_id == skill.id,
            models.UserSkill.type == skill_type,
        )
        .first()
    )

    if existing_us:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Skill '{skill.name}' already exists in your {skill_type.lower()} list",
        )

    user_skill = models.UserSkill(
        id=str(uuid.uuid4()),
        user_id=user_id,
        skill_id=skill.id,
        type=skill_type,
        proficiency=prof,
        description=skill_data.description,
    )
    db.add(user_skill)
    db.commit()
    db.refresh(user_skill)

    return schemas.UserSkillResponse(
        id=user_skill.id,
        user_id=user_skill.user_id,
        skill_id=user_skill.skill_id,
        skill_name=skill.name,
        type=user_skill.type,
        proficiency=user_skill.proficiency,
        category=skill.category,
        description=user_skill.description,
        created_at=user_skill.created_at,
    )


def delete_user_skill(db: Session, user_id: str, user_skill_id: str):
    user_skill = (
        db.query(models.UserSkill)
        .filter(
            models.UserSkill.id == user_skill_id, models.UserSkill.user_id == user_id
        )
        .first()
    )

    if not user_skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Skill entry not found"
        )

    # Check if tied to active/pending exchange request
    active_requests = (
        db.query(models.ExchangeRequest)
        .filter(
            or_(
                models.ExchangeRequest.offered_skill_id == user_skill_id,
                models.ExchangeRequest.requested_skill_id == user_skill_id,
            ),
            models.ExchangeRequest.status.in_(["PENDING", "ACCEPTED"]),
        )
        .first()
    )

    if active_requests:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot remove a skill currently tied to an active or pending exchange request",
        )

    db.delete(user_skill)
    db.commit()


def get_user_profile(db: Session, user_id: str) -> schemas.UserResponse:
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user_skills = (
        db.query(models.UserSkill)
        .options(joinedload(models.UserSkill.skill))
        .filter(models.UserSkill.user_id == user_id)
        .all()
    )

    teach_skills = []
    learn_skills = []

    for us in user_skills:
        item = schemas.UserSkillResponse(
            id=us.id,
            user_id=us.user_id,
            skill_id=us.skill_id,
            skill_name=us.skill.name if us.skill else "Unknown",
            type=us.type,
            proficiency=us.proficiency,
            category=us.skill.category if us.skill else None,
            description=us.description,
            created_at=us.created_at,
        )
        if us.type == "TEACH":
            teach_skills.append(item)
        else:
            learn_skills.append(item)

    return schemas.UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        created_at=user.created_at,
        teach_skills=teach_skills,
        learn_skills=learn_skills,
    )


def find_matches_for_user(
    db: Session,
    current_user_id: str,
    skip: int = 0,
    limit: int = 20,
    query: Optional[str] = None,
    proficiency: Optional[str] = None,
    reciprocal_only: bool = False,
) -> List[schemas.MatchResponse]:
    # Current user's skills
    current_user_skills = (
        db.query(models.UserSkill)
        .options(joinedload(models.UserSkill.skill))
        .filter(models.UserSkill.user_id == current_user_id)
        .all()
    )

    user_learn_skill_ids = {
        us.skill_id: us for us in current_user_skills if us.type == "LEARN"
    }
    user_teach_skill_ids = {
        us.skill_id: us for us in current_user_skills if us.type == "TEACH"
    }

    # Other active users
    other_users = (
        db.query(models.User)
        .filter(models.User.id != current_user_id, models.User.is_active == True)
        .all()
    )

    matches = []

    for partner in other_users:
        partner_skills = (
            db.query(models.UserSkill)
            .options(joinedload(models.UserSkill.skill))
            .filter(models.UserSkill.user_id == partner.id)
            .all()
        )

        partner_teach_skills = [us for us in partner_skills if us.type == "TEACH"]
        partner_learn_skills = [us for us in partner_skills if us.type == "LEARN"]

        # Find intersections: partner teaches a skill that current user wants to learn
        for p_teach in partner_teach_skills:
            if p_teach.skill_id in user_learn_skill_ids:
                # Check filters
                if query:
                    q_lower = query.lower()
                    skill_name_match = q_lower in p_teach.skill.name.lower()
                    partner_name_match = q_lower in partner.full_name.lower()
                    if not (skill_name_match or partner_name_match):
                        continue

                if proficiency and p_teach.proficiency.upper() != proficiency.upper():
                    continue

                # Check reciprocal
                is_reciprocal = False
                matching_learn = None
                for p_learn in partner_learn_skills:
                    if p_learn.skill_id in user_teach_skill_ids:
                        is_reciprocal = True
                        matching_learn = schemas.MatchedSkillDetail(
                            user_skill_id=p_learn.id,
                            skill_name=p_learn.skill.name,
                            proficiency=p_learn.proficiency,
                        )
                        break

                if reciprocal_only and not is_reciprocal:
                    continue

                match_item = schemas.MatchResponse(
                    partner_id=partner.id,
                    partner_name=partner.full_name,
                    partner_email=partner.email
                    if is_reciprocal
                    else None,  # Contact details unlocked if reciprocal or accepted
                    teaches_skill=schemas.MatchedSkillDetail(
                        user_skill_id=p_teach.id,
                        skill_name=p_teach.skill.name,
                        proficiency=p_teach.proficiency,
                    ),
                    learns_skill=matching_learn,
                    is_reciprocal=is_reciprocal,
                )
                matches.append(match_item)

    # Paginate matches
    return matches[skip : skip + limit]


def create_exchange_request(
    db: Session, requester_id: str, data: schemas.ExchangeRequestCreate
) -> schemas.ExchangeRequestResponse:
    if requester_id == data.recipient_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send exchange request to yourself",
        )

    recipient = get_user_by_id(db, data.recipient_id)
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipient user not found"
        )

    offered_skill = (
        db.query(models.UserSkill)
        .options(joinedload(models.UserSkill.skill))
        .filter(
            models.UserSkill.id == data.offered_skill_id,
            models.UserSkill.user_id == requester_id,
        )
        .first()
    )

    if not offered_skill or offered_skill.type != "TEACH":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid offered skill. Must be a skill you teach.",
        )

    requested_skill = (
        db.query(models.UserSkill)
        .options(joinedload(models.UserSkill.skill))
        .filter(
            models.UserSkill.id == data.requested_skill_id,
            models.UserSkill.user_id == data.recipient_id,
        )
        .first()
    )

    if not requested_skill or requested_skill.type != "TEACH":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid requested skill. Must be a skill offered by recipient.",
        )

    # Prevent duplicate PENDING request for same skill pair
    existing = (
        db.query(models.ExchangeRequest)
        .filter(
            models.ExchangeRequest.requester_id == requester_id,
            models.ExchangeRequest.recipient_id == data.recipient_id,
            models.ExchangeRequest.offered_skill_id == data.offered_skill_id,
            models.ExchangeRequest.requested_skill_id == data.requested_skill_id,
            models.ExchangeRequest.status == "PENDING",
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A pending exchange request already exists for these skills",
        )

    requester = get_user_by_id(db, requester_id)

    exchange_req = models.ExchangeRequest(
        id=str(uuid.uuid4()),
        requester_id=requester_id,
        recipient_id=data.recipient_id,
        offered_skill_id=data.offered_skill_id,
        requested_skill_id=data.requested_skill_id,
        status="PENDING",
        message=data.message,
    )
    db.add(exchange_req)
    db.commit()
    db.refresh(exchange_req)

    return schemas.ExchangeRequestResponse(
        id=exchange_req.id,
        requester_id=requester_id,
        requester_name=requester.full_name if requester else "Unknown",
        recipient_id=data.recipient_id,
        recipient_name=recipient.full_name,
        offered_skill_id=offered_skill.id,
        offered_skill_name=offered_skill.skill.name
        if offered_skill.skill
        else "Unknown",
        requested_skill_id=requested_skill.id,
        requested_skill_name=requested_skill.skill.name
        if requested_skill.skill
        else "Unknown",
        status=exchange_req.status,
        message=exchange_req.message,
        created_at=exchange_req.created_at,
        updated_at=exchange_req.updated_at,
    )


def get_exchange_requests_for_user(
    db: Session,
    user_id: str,
    role_filter: Optional[str] = "all",
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> List[schemas.ExchangeRequestResponse]:
    query = db.query(models.ExchangeRequest).options(
        joinedload(models.ExchangeRequest.requester),
        joinedload(models.ExchangeRequest.recipient),
        joinedload(models.ExchangeRequest.offered_skill).joinedload(
            models.UserSkill.skill
        ),
        joinedload(models.ExchangeRequest.requested_skill).joinedload(
            models.UserSkill.skill
        ),
    )

    if role_filter == "incoming":
        query = query.filter(models.ExchangeRequest.recipient_id == user_id)
    elif role_filter == "outgoing":
        query = query.filter(models.ExchangeRequest.requester_id == user_id)
    else:
        query = query.filter(
            or_(
                models.ExchangeRequest.recipient_id == user_id,
                models.ExchangeRequest.requester_id == user_id,
            )
        )

    if status_filter:
        query = query.filter(models.ExchangeRequest.status == status_filter.upper())

    query = query.order_by(models.ExchangeRequest.created_at.desc())
    requests = query.offset(skip).limit(limit).all()

    results = []
    for req in requests:
        offered_name = (
            req.offered_skill.skill.name
            if (req.offered_skill and req.offered_skill.skill)
            else "Unknown"
        )
        requested_name = (
            req.requested_skill.skill.name
            if (req.requested_skill and req.requested_skill.skill)
            else "Unknown"
        )
        results.append(
            schemas.ExchangeRequestResponse(
                id=req.id,
                requester_id=req.requester_id,
                requester_name=req.requester.full_name if req.requester else "Unknown",
                recipient_id=req.recipient_id,
                recipient_name=req.recipient.full_name if req.recipient else "Unknown",
                offered_skill_id=req.offered_skill_id,
                offered_skill_name=offered_name,
                requested_skill_id=req.requested_skill_id,
                requested_skill_name=requested_name,
                status=req.status,
                message=req.message,
                created_at=req.created_at,
                updated_at=req.updated_at,
            )
        )

    return results


def update_exchange_request_status(
    db: Session, request_id: str, user_id: str, action: str
) -> schemas.ExchangeRequestResponse:
    req = (
        db.query(models.ExchangeRequest)
        .options(
            joinedload(models.ExchangeRequest.requester),
            joinedload(models.ExchangeRequest.recipient),
            joinedload(models.ExchangeRequest.offered_skill).joinedload(
                models.UserSkill.skill
            ),
            joinedload(models.ExchangeRequest.requested_skill).joinedload(
                models.UserSkill.skill
            ),
        )
        .filter(models.ExchangeRequest.id == request_id)
        .first()
    )

    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exchange request not found"
        )

    if req.status != "PENDING":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PENDING requests can be updated",
        )

    act = action.upper()

    if act == "ACCEPT":
        if req.recipient_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only recipient can accept an exchange request",
            )
        req.status = "ACCEPTED"
    elif act == "REJECT":
        if req.recipient_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only recipient can reject an exchange request",
            )
        req.status = "REJECTED"
    elif act == "CANCEL":
        if req.requester_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only requester can cancel an exchange request",
            )
        req.status = "CANCELLED"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid action. Must be ACCEPT, REJECT, or CANCEL",
        )

    db.commit()
    db.refresh(req)

    offered_name = (
        req.offered_skill.skill.name
        if (req.offered_skill and req.offered_skill.skill)
        else "Unknown"
    )
    requested_name = (
        req.requested_skill.skill.name
        if (req.requested_skill and req.requested_skill.skill)
        else "Unknown"
    )

    return schemas.ExchangeRequestResponse(
        id=req.id,
        requester_id=req.requester_id,
        requester_name=req.requester.full_name if req.requester else "Unknown",
        recipient_id=req.recipient_id,
        recipient_name=req.recipient.full_name if req.recipient else "Unknown",
        offered_skill_id=req.offered_skill_id,
        offered_skill_name=offered_name,
        requested_skill_id=req.requested_skill_id,
        requested_skill_name=requested_name,
        status=req.status,
        message=req.message,
        created_at=req.created_at,
        updated_at=req.updated_at,
    )
