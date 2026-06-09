from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
import os
import time
import re
import sys
from uuid import UUID
from server import crud, schemas, models
from server.database import get_db

router = APIRouter()

def run_code_scan(review_id, pr_title: str, branch_name: str, db_session_maker):
    # We use a fresh session in the background task
    db = db_session_maker()
    try:
        start_time = time.time()
        if isinstance(review_id, str):
            review_id = UUID(review_id)

        review = crud.get_review_by_id(db, review_id=review_id)
        if not review:
            print(f"Review {review_id} not found in database", file=sys.stderr)
            return

        config = crud.get_config(db)
        issues_found = []

        # Define the root directory to scan (the workspace root)
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
        
        # Common secret patterns
        secret_patterns = [
            re.compile(r'(api_key|secret|password|token|passwd|credentials)\s*=\s*["\'][a-zA-Z0-9_\-]{8,}["\']', re.IGNORECASE),
        ]

        # Walk through the workspace
        for root, dirs, files in os.walk(root_dir):
            # Skip virtual environments, git, and cache directories
            if any(p in root for p in [".venv", "venv", ".git", "__pycache__", ".pytest_cache"]):
                continue

            # Check for missing __init__.py in subdirectories of server/ containing .py files
            if "server" in root and root != os.path.join(root_dir, "server"):
                py_files = [f for f in files if f.endswith(".py")]
                if py_files and "__init__.py" not in files:
                    rel_path = os.path.relpath(root, root_dir)
                    issues_found.append({
                        "file_path": os.path.join(rel_path, "__init__.py"),
                        "line_number": 1,
                        "message": f"Missing __init__.py in directory '{rel_path}' containing Python files (Constitution Section 5.1)",
                        "severity": "WARNING"
                    })

            for file in files:
                if file.endswith(".py"):
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, root_dir)

                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            lines = f.readlines()
                    except Exception:
                        continue

                    for idx, line in enumerate(lines):
                        line_num = idx + 1
                        stripped_line = line.strip()

                        # 1. PEP8 Line Length Check
                        if config.pep8_enabled:
                            if len(line.rstrip("\r\n")) > config.max_line_length:
                                issues_found.append({
                                    "file_path": rel_path,
                                    "line_number": line_num,
                                    "message": f"Line exceeds maximum line length ({len(line.rstrip())} > {config.max_line_length} characters)",
                                    "severity": "INFO"
                                })

                        # 2. Hardcoded Secrets Check
                        for pattern in secret_patterns:
                            if pattern.search(stripped_line):
                                if "class " not in stripped_line and "settings" not in stripped_line.lower():
                                    issues_found.append({
                                        "file_path": rel_path,
                                        "line_number": line_num,
                                        "message": "Potential hardcoded secret, API key, or password detected",
                                        "severity": "CRITICAL"
                                    })

                        # 3. OWASP Top 10 / SAST Vulnerability Check
                        if config.owasp_top_10:
                            if "eval(" in stripped_line and not stripped_line.startswith("#"):
                                issues_found.append({
                                    "file_path": rel_path,
                                    "line_number": line_num,
                                    "message": "Security vulnerability: Use of unsafe eval() function detected (OWASP Top 10)",
                                    "severity": "HIGH"
                                })
                            if "exec(" in stripped_line and not stripped_line.startswith("#"):
                                issues_found.append({
                                    "file_path": rel_path,
                                    "line_number": line_num,
                                    "message": "Security vulnerability: Use of unsafe exec() function detected (OWASP Top 10)",
                                    "severity": "HIGH"
                                })
                            if "subprocess.Popen" in stripped_line and "shell=True" in stripped_line:
                                issues_found.append({
                                    "file_path": rel_path,
                                    "line_number": line_num,
                                    "message": "Security vulnerability: Subprocess execution with shell=True detected (OWASP Top 10)",
                                    "severity": "HIGH"
                                })

        # Save issues to database
        has_critical_or_high = False
        for issue in issues_found:
            crud.create_issue(
                db,
                review_id=review.review_id,
                file_path=issue["file_path"],
                line_number=issue["line_number"],
                message=issue["message"],
                severity=issue["severity"]
            )
            if issue["severity"] in ["CRITICAL", "HIGH"]:
                has_critical_or_high = True

        # Update review status
        review.status = "CHANGES_REQUESTED" if has_critical_or_high else "APPROVED"
        review.scan_duration_seconds = int(time.time() - start_time) or 1
        review.title = pr_title
        review.branch_name = branch_name
        db.commit()

    except Exception as e:
        print(f"Error during background code scan: {e}", file=sys.stderr)
    finally:
        db.close()

@router.post("/webhook", response_model=schemas.WebhookResponse)
def receive_webhook(
    payload: schemas.WebhookRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    action = payload.action
    pull_request = payload.pull_request
    repository = payload.repository

    pr_id = str(pull_request.get("number") or pull_request.get("id") or "unknown")
    repo_name = repository.get("full_name") or "unknown"
    pr_title = pull_request.get("title") or "Untitled Pull Request"
    branch_name = pull_request.get("head", {}).get("ref") or "unknown"

    # Create a pending review record
    review = crud.create_review(
        db,
        pr_id=pr_id,
        repo_name=repo_name,
        title=pr_title,
        branch_name=branch_name,
        status="PENDING"
    )

    # Trigger background scan
    from server.main import app
    from server.database import get_db as db_dep, SessionLocal
    
    # If get_db is overridden (e.g. in tests), we extract the overridden sessionmaker
    override = app.dependency_overrides.get(db_dep)
    if override:
        # The override is a generator function, so we can call it to get a session,
        # or we can inspect its closure to get the sessionmaker.
        # To keep it simple and robust, we can just use a sessionmaker wrapper
        # that calls the override generator.
        def test_session_maker():
            gen = override()
            return next(gen)
        db_session_maker = test_session_maker
    else:
        db_session_maker = SessionLocal

    background_tasks.add_task(
        run_code_scan,
        review_id=review.review_id,
        pr_title=pr_title,
        branch_name=branch_name,
        db_session_maker=db_session_maker
    )

    return schemas.WebhookResponse(
        status="success",
        message=f"Webhook received. Code review {review.review_id} initiated in the background."
    )
