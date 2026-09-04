from datetime import datetime, timezone
from typing import List
from sqlalchemy.orm import Session, joinedload
from server.models import Topic
from server.schemas import TopicRecommendation


def calculate_topic_recommendations(
    db: Session, limit: int = 5
) -> List[TopicRecommendation]:
    """
    Algorithmic AI Recommendation Engine.
    Prioritizes topics based on:
      1. Difficulty rating (Easy: 1.0, Medium: 2.0, Hard: 3.0)
      2. Status (Not Started: 3.0, In Progress: 2.0, Completed: 0.2)
      3. Proximity to target exam date (decay/urgency factor)
      4. Time elapsed since last study session (decay curve)
    """
    now = datetime.now(timezone.utc)

    # Fetch topics with related subject and logs
    topics = (
        db.query(Topic)
        .options(
            joinedload(Topic.subject),
            joinedload(Topic.study_logs),
        )
        .all()
    )

    if not topics:
        return []

    scored_items = []

    difficulty_weights = {
        "Easy": 1.0,
        "Medium": 2.0,
        "Hard": 3.0,
    }

    status_weights = {
        "Not Started": 3.0,
        "In Progress": 2.0,
        "Completed": 0.2,
    }

    for topic in topics:
        diff_weight = difficulty_weights.get(topic.difficulty, 2.0)
        stat_weight = status_weights.get(topic.status, 2.0)

        subject = topic.subject
        subject_title = subject.title if subject else "General"

        # 1. Exam deadline urgency
        urgency = 1.5
        deadline_text = "with no set deadline"
        if subject and subject.target_exam_date:
            target_date = subject.target_exam_date
            if target_date.tzinfo is None:
                target_date = target_date.replace(tzinfo=timezone.utc)
            days_until_exam = (target_date - now).total_seconds() / 86400.0

            if days_until_exam <= 0:
                urgency = 5.0
                deadline_text = "with an exam overdue or due today"
            elif days_until_exam <= 3:
                urgency = 4.0
                deadline_text = f"with an upcoming exam in {int(days_until_exam)} days"
            elif days_until_exam <= 7:
                urgency = 3.0
                deadline_text = f"with an exam in {int(days_until_exam)} days"
            elif days_until_exam <= 14:
                urgency = 2.0
                deadline_text = f"with an exam in {int(days_until_exam)} days"
            else:
                urgency = 1.0
                deadline_text = f"with an exam in {int(days_until_exam)} days"

        # 2. Study decay / recency factor
        decay_factor = 2.5
        history_text = "zero recent study logs"

        if topic.study_logs:
            sorted_logs = sorted(
                topic.study_logs,
                key=lambda log: log.logged_at
                if log.logged_at.tzinfo
                else log.logged_at.replace(tzinfo=timezone.utc),
                reverse=True,
            )
            latest_log = sorted_logs[0]
            log_time = latest_log.logged_at
            if log_time.tzinfo is None:
                log_time = log_time.replace(tzinfo=timezone.utc)

            days_since = max(0.0, (now - log_time).total_seconds() / 86400.0)
            decay_factor = min(3.5, 1.0 + (days_since * 0.25))

            if days_since < 1:
                history_text = "studied today"
            else:
                history_text = f"last studied {int(days_since)} days ago"

        # Final Priority Score
        priority_score = round(
            (diff_weight * 1.5)
            + (stat_weight * 1.5)
            + (urgency * 2.0)
            + (decay_factor * 1.0),
            2,
        )

        reason = (
            f"{topic.difficulty} difficulty topic ({topic.status}) "
            f"{deadline_text} and {history_text}."
        )

        recommendation = TopicRecommendation(
            topic_id=str(topic.id),
            topic_title=topic.title,
            subject_title=subject_title,
            difficulty=topic.difficulty,
            estimated_minutes=topic.estimated_minutes,
            priority_score=priority_score,
            recommendation_reason=reason,
        )

        # Prefer uncompleted topics higher if scores are close
        is_completed = 1 if topic.status == "Completed" else 0
        scored_items.append((is_completed, priority_score, recommendation))

    # Sort: uncompleted first (0 before 1), then highest priority_score descending
    scored_items.sort(key=lambda x: (x[0], -x[1]))

    return [item[2] for item in scored_items[:limit]]
