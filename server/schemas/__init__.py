from server.schemas.auth import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
    TokenData,
)
from server.schemas.course import (
    CourseCreate,
    CourseUpdate,
    CourseResponse,
    CourseDetailResponse,
    EnrollmentResponse,
)
from server.schemas.assignment import (
    AssignmentCreate,
    AssignmentUpdate,
    AssignmentResponse,
)
from server.schemas.submission import (
    SubmissionCreate,
    SubmissionGrade,
    SubmissionResponse,
    SubmissionReceiptResponse,
)

__all__ = [
    "UserRegister",
    "UserLogin",
    "UserResponse",
    "TokenResponse",
    "TokenData",
    "CourseCreate",
    "CourseUpdate",
    "CourseResponse",
    "CourseDetailResponse",
    "EnrollmentResponse",
    "AssignmentCreate",
    "AssignmentUpdate",
    "AssignmentResponse",
    "SubmissionCreate",
    "SubmissionGrade",
    "SubmissionResponse",
    "SubmissionReceiptResponse",
]
