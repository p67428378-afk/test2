from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, courses
from server.database import Base, engine, SessionLocal
from server import crud, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(courses.router, prefix="/api/v1", tags=["courses"])


@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    try:
        # Check if courses table is empty
        existing_courses = crud.get_courses(db, limit=1)
        if not existing_courses:
            initial_courses = [
                schemas.CourseCreate(
                    title="Introduction to Python",
                    description="A beginner-friendly course on Python programming.",
                    instructor_name="Jane Doe",
                    price=49.99,
                ),
                schemas.CourseCreate(
                    title="Advanced React & Tailwind",
                    description="A sleek, minimalist digital composition illustrating advanced UI design concepts.",
                    instructor_name="John Smith",
                    price=79.99,
                ),
                schemas.CourseCreate(
                    title="UI/UX Design Fundamentals",
                    description="A calm, professional graphic representing user experience design.",
                    instructor_name="Sarah Jenkins",
                    price=59.99,
                ),
                schemas.CourseCreate(
                    title="Data Science with R",
                    description="A sophisticated abstract visualization of data science and statistics.",
                    instructor_name="Dr. Alan Turing",
                    price=89.99,
                ),
                schemas.CourseCreate(
                    title="Digital Marketing Masterclass",
                    description="A clean, conceptual representation of digital marketing strategy.",
                    instructor_name="Emily Watson",
                    price=39.99,
                ),
                schemas.CourseCreate(
                    title="Product Management 101",
                    description="An abstract layout illustrating product management frameworks.",
                    instructor_name="Marcus Aurelius",
                    price=69.99,
                ),
            ]
            for course in initial_courses:
                crud.create_course(db, course)
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Welcome to the Password Reset Microservice"}
