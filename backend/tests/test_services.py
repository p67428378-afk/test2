from sqlalchemy.orm import Session
from backend import services, schemas, models
from datetime import date

def test_create_user_service(db_session: Session):
    user_data = schemas.UserCreate(username="testuser_service", email="test_service@example.com", password="testpassword")
    user = services.create_user(db_session, user_data)

    assert user.id is not None
    assert user.username == "testuser_service"
    assert user.email == "test_service@example.com"
    assert services.verify_password("testpassword", user.hashed_password)

def test_get_user_by_email_service(db_session: Session):
    user_data = schemas.UserCreate(username="anotheruser", email="another@example.com", password="testpassword")
    services.create_user(db_session, user_data)

    user = services.get_user_by_email(db_session, "another@example.com")
    assert user is not None
    assert user.username == "anotheruser"

def test_create_applicant_service(db_session: Session):
    user_data = schemas.UserCreate(username="applicantuser", email="applicant@example.com", password="testpassword")
    user = services.create_user(db_session, user_data)

    applicant_data = schemas.ApplicantCreate(
        user_id=user.id,
        full_name="John Doe",
        phone_number="123-456-7890",
        email="john.doe@example.com",
        credit_score=750,
        annual_income=100000.0,
        mailing_address="123 Main St",
        employer_name="ABC Corp",
        job_title="Software Engineer",
        employment_start_date=date(2020, 1, 1),
        employer_address="456 Oak Ave"
    )
    applicant = services.create_applicant(db_session, applicant_data)

    assert applicant.id is not None
    assert applicant.full_name == "John Doe"
    assert applicant.user_id == user.id

def test_update_applicant_service(db_session: Session):
    user_data = schemas.UserCreate(username="updateuser", email="update@example.com", password="testpassword")
    user = services.create_user(db_session, user_data)

    applicant_data = schemas.ApplicantCreate(
        user_id=user.id,
        full_name="Jane Doe",
        phone_number="111-222-3333",
        email="jane.doe@example.com",
        credit_score=700,
        annual_income=80000.0,
        mailing_address="456 Pine St",
        employer_name="XYZ Inc",
        job_title="Project Manager",
        employment_start_date=date(2019, 5, 1),
        employer_address="789 Elm St"
    )
    applicant = services.create_applicant(db_session, applicant_data)

    update_data = schemas.ApplicantUpdate(credit_score=720, job_title="Senior Project Manager")
    updated_applicant = services.update_applicant(db_session, applicant.id, update_data)

    assert updated_applicant.credit_score == 720
    assert updated_applicant.job_title == "Senior Project Manager"

def test_create_credit_card_service(db_session: Session):
    card_data = schemas.CreditCardCreate(
        name="Test Card",
        description="A test credit card",
        apr=15.99,
        cashback_rate=1.5,
        annual_fee=0.0,
        features="rewards, travel",
        credit_limit=5000.0
    )
    credit_card = services.create_credit_card(db_session, card_data)

    assert credit_card.id is not None
    assert credit_card.name == "Test Card"

def test_create_application_service(db_session: Session):
    user_data = schemas.UserCreate(username="appuser", email="app@example.com", password="testpassword")
    user = services.create_user(db_session, user_data)

    applicant_data = schemas.ApplicantCreate(
        user_id=user.id,
        full_name="App User",
        phone_number="555-123-4567",
        email="app.user@example.com",
        credit_score=780,
        annual_income=120000.0,
        mailing_address="789 Maple Ave",
        employer_name="Tech Solutions",
        job_title="Developer",
        employment_start_date=date(2021, 3, 15),
        employer_address="101 Pine St"
    )
    applicant = services.create_applicant(db_session, applicant_data)

    card_data = schemas.CreditCardCreate(
        name="App Card",
        description="An application test card",
        apr=18.0,
        cashback_rate=2.0,
        annual_fee=50.0,
        features="cashback",
        credit_limit=10000.0
    )
    credit_card = services.create_credit_card(db_session, card_data)

    application_data = schemas.ApplicationCreate(
        applicant_id=applicant.id,
        credit_card_id=credit_card.id
    )
    application = services.create_application(db_session, application_data)

    assert application.id is not None
    assert application.status == "Pending"
    assert application.applicant_id == applicant.id
    assert application.credit_card_id == credit_card.id
    assert application.submission_date == date.today()

def test_update_application_service(db_session: Session):
    user_data = schemas.UserCreate(username="updateappuser", email="updateapp@example.com", password="testpassword")
    user = services.create_user(db_session, user_data)

    applicant_data = schemas.ApplicantCreate(
        user_id=user.id,
        full_name="Update App User",
        phone_number="555-987-6543",
        email="update.app.user@example.com",
        credit_score=760,
        annual_income=110000.0,
        mailing_address="321 Birch Ln",
        employer_name="Global Corp",
        job_title="Analyst",
        employment_start_date=date(2022, 1, 1),
        employer_address="202 Cedar Rd"
    )
    applicant = services.create_applicant(db_session, applicant_data)

    card_data = schemas.CreditCardCreate(
        name="Update App Card",
        description="Update application test card",
        apr=16.5,
        cashback_rate=1.0,
        annual_fee=25.0,
        features="low APR",
        credit_limit=7500.0
    )
    credit_card = services.create_credit_card(db_session, card_data)

    application_data = schemas.ApplicationCreate(
        applicant_id=applicant.id,
        credit_card_id=credit_card.id
    )
    application = services.create_application(db_session, application_data)

    update_data = schemas.ApplicationUpdate(status="Approved", denial_reason=None)
    updated_application = services.update_application(db_session, application.id, update_data)

    assert updated_application.status == "Approved"
    assert updated_application.denial_reason is None
    assert updated_application.last_updated_date == date.today()
