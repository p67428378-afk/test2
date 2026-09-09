import os
import uuid
from datetime import datetime, timezone
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dems.db")

# SQLite connection args for threading
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )
    except Exception:
        return False


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Import models so tables register on Base.metadata
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models import (
        User,
        Case,
        EvidenceItem,
        CaseEvidenceLink,
        ChainOfCustodyEntry,
        AuditLog,
    )

    # Check if users already exist
    existing_admin = db.query(User).filter(User.email == "admin@example.com").first()
    if existing_admin:
        return

    users_to_seed = [
        {
            "id": "11111111-1111-1111-1111-111111111111",
            "email": "admin@example.com",
            "full_name": "System Administrator",
            "password": "adminpassword",
            "role": "Administrator",
        },
        {
            "id": "22222222-2222-2222-2222-222222222222",
            "email": "test@example.com",
            "full_name": "Test Investigator",
            "password": "testpassword",
            "role": "Investigator",
        },
        {
            "id": "33333333-3333-3333-3333-333333333333",
            "email": "lead@example.com",
            "full_name": "Lead Investigator Sarah",
            "password": "leadpassword",
            "role": "Lead Investigator",
        },
        {
            "id": "44444444-4444-4444-4444-444444444444",
            "email": "auditor@example.com",
            "full_name": "External Auditor Frank",
            "password": "auditorpassword",
            "role": "External Auditor",
        },
        {
            "id": "55555555-5555-5555-5555-555555555555",
            "email": "prosecutor@example.com",
            "full_name": "Lead Prosecutor Bob",
            "password": "prosecutorpassword",
            "role": "Prosecutor",
        },
        {
            "id": "66666666-6666-6666-6666-666666666666",
            "email": "observer@example.com",
            "full_name": "Observer Dave",
            "password": "observerpassword",
            "role": "Read-Only Observer",
        },
        {
            "id": "77777777-7777-7777-7777-777777777777",
            "email": "alice@police.gov",
            "full_name": "Investigator Alice",
            "password": "password123",
            "role": "Investigator",
        },
        {
            "id": "88888888-8888-8888-8888-888888888888",
            "email": "bob@prosecutor.gov",
            "full_name": "Prosecutor Bob",
            "password": "password123",
            "role": "Prosecutor",
        },
        {
            "id": "99999999-9999-9999-9999-999999999999",
            "email": "charlie@police.gov",
            "full_name": "Officer Charlie",
            "password": "password123",
            "role": "Read-Only Observer",
        },
    ]

    for u in users_to_seed:
        user_obj = User(
            id=u["id"],
            email=u["email"],
            full_name=u["full_name"],
            hashed_password=get_password_hash(u["password"]),
            role=u["role"],
            is_active=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(user_obj)
    db.commit()

    # Seed demo Cases
    case1 = Case(
        id="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        case_number="CASE-2026-089",
        title="Cyber Fraud Investigation",
        description="Investigation into unauthorized corporate database breach and exfiltration.",
        lead_investigator_id="33333333-3333-3333-3333-333333333333",
        status="Active",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    case2 = Case(
        id="bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        case_number="CASE-2026-090",
        title="Downtown Traffic Incident",
        description="Vehicular incident at 742 Evergreen Terrace involving multiple dashcam recordings.",
        lead_investigator_id="77777777-7777-7777-7777-777777777777",
        status="Active",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(case1)
    db.add(case2)
    db.commit()

    # Seed Evidence Items
    evid1 = EvidenceItem(
        id="c1111111-1111-1111-1111-111111111111",
        evidence_code="EVID-1001",
        file_name="Forensic_Report.pdf",
        file_type="PDF",
        file_size_bytes=2458120,
        sha256_hash="7d4a2f8be91c49832b0f4e6d2a1b9c3f5e8a7d6c5b4a3f2e1d0c9b8a7f6e5d4c",
        storage_path="evidence/EVID-1001/Forensic_Report.pdf",
        collection_date=datetime.now(timezone.utc),
        collection_location="Cyber Crime Forensic Lab #3",
        source_device="Forensic Workstation-ALPHA",
        current_custodian_id="77777777-7777-7777-7777-777777777777",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    evid2 = EvidenceItem(
        id="c2222222-2222-2222-2222-222222222222",
        evidence_code="EVID-1002",
        file_name="dashcam_footage.mp4",
        file_type="Video",
        file_size_bytes=1288490188,
        sha256_hash="a5f18c0e2b4d9627e36980db1c149afbf4c8996fb92427ae41e4649b934ca495",
        storage_path="evidence/EVID-1002/dashcam_footage.mp4",
        collection_date=datetime.now(timezone.utc),
        collection_location="742 Evergreen Terrace",
        source_device="Axon Body 3 Dashcam #482-B",
        current_custodian_id="55555555-5555-5555-5555-555555555555",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    evid3 = EvidenceItem(
        id="c3333333-3333-3333-3333-333333333333",
        evidence_code="EVID-1005",
        file_name="encrypted_drive_image.raw",
        file_type="Binary / Disk Image",
        file_size_bytes=4831838208,
        sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        storage_path="evidence/EVID-1005/encrypted_drive_image.raw",
        collection_date=datetime.now(timezone.utc),
        collection_location="Suspect Residence Server Room",
        source_device="Hardware Write-Blocker UltraKit III",
        current_custodian_id="22222222-2222-2222-2222-222222222222",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(evid1)
    db.add(evid2)
    db.add(evid3)
    db.commit()

    # Link evidence to Case 1
    link1 = CaseEvidenceLink(
        case_id="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        evidence_id="c1111111-1111-1111-1111-111111111111",
        linked_at=datetime.now(timezone.utc),
        linked_by_id="33333333-3333-3333-3333-333333333333",
    )
    link2 = CaseEvidenceLink(
        case_id="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        evidence_id="c2222222-2222-2222-2222-222222222222",
        linked_at=datetime.now(timezone.utc),
        linked_by_id="33333333-3333-3333-3333-333333333333",
    )
    db.add(link1)
    db.add(link2)
    db.commit()

    # Seed Chain of Custody entries
    coc1 = ChainOfCustodyEntry(
        id=str(uuid.uuid4()),
        evidence_id="c1111111-1111-1111-1111-111111111111",
        previous_custodian_id=None,
        new_custodian_id="77777777-7777-7777-7777-777777777777",
        action="UPLOAD",
        transfer_reason="Initial forensic evidence ingestion and SHA-256 verification",
        location_context="Forensic Lab #3",
        timestamp=datetime.now(timezone.utc),
    )
    coc2 = ChainOfCustodyEntry(
        id=str(uuid.uuid4()),
        evidence_id="c2222222-2222-2222-2222-222222222222",
        previous_custodian_id=None,
        new_custodian_id="77777777-7777-7777-7777-777777777777",
        action="UPLOAD",
        transfer_reason="Initial dashcam media upload",
        location_context="Central Precinct Evidence Locker",
        timestamp=datetime.now(timezone.utc),
    )
    coc3 = ChainOfCustodyEntry(
        id=str(uuid.uuid4()),
        evidence_id="c2222222-2222-2222-2222-222222222222",
        previous_custodian_id="77777777-7777-7777-7777-777777777777",
        new_custodian_id="55555555-5555-5555-5555-555555555555",
        action="TRANSFER",
        transfer_reason="Court Presentation",
        location_context="8th Judicial District Courtroom 4B",
        timestamp=datetime.now(timezone.utc),
    )
    db.add(coc1)
    db.add(coc2)
    db.add(coc3)
    db.commit()

    # Seed initial audit log entries
    audit1 = AuditLog(
        id=str(uuid.uuid4()),
        user_id="77777777-7777-7777-7777-777777777777",
        user_email="alice@police.gov",
        action="EVIDENCE_UPLOAD",
        resource="EVID-1001",
        status_code=201,
        ip_address="10.42.108.19",
        details={"file_name": "Forensic_Report.pdf", "sha256": "7d4a2f8b...e91c"},
        timestamp=datetime.now(timezone.utc),
    )
    audit2 = AuditLog(
        id=str(uuid.uuid4()),
        user_id="99999999-9999-9999-9999-999999999999",
        user_email="charlie@police.gov",
        action="EVIDENCE_VIEW",
        resource="EVID-1005",
        status_code=403,
        ip_address="192.168.1.45",
        details={"reason": "Insufficient Role Permissions for Case CASE-2026-089"},
        timestamp=datetime.now(timezone.utc),
    )
    db.add(audit1)
    db.add(audit2)
    db.commit()
