from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt
import bcrypt
from server import crud, schemas
from server.database import get_db

router = APIRouter()

SECRET_KEY = "secret_key_for_library_management_system"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None or role is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if role == "librarian":
        user = crud.get_user_by_login_id(db, login_id=username)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
            )
        return {"username": user.login_id, "role": "librarian", "id": str(user.id)}
    elif role == "patron":
        patron = crud.get_patron_by_username(db, username=username)
        if patron is None:
            # Try email
            patron = crud.get_patron_by_email(db, email=username)
        if patron is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Patron not found"
            )
        return {"username": patron.username, "role": "patron", "id": str(patron.id)}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid role in token"
        )


def get_current_librarian(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "librarian":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden - Librarian only"
        )
    return current_user


@router.post("/auth/login", response_model=schemas.LoginResponse)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    if request.is_librarian:
        user = crud.get_user_by_login_id(db, login_id=request.username)
        if not user or not verify_password(request.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
            )
        access_token = create_access_token(
            data={"sub": user.login_id, "role": "librarian"},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        )
        return {
            "access_token": access_token,
            "role": "librarian",
            "token_type": "bearer",
        }
    else:
        patron = crud.get_patron_by_username(db, username=request.username)
        if not patron:
            patron = crud.get_patron_by_email(db, email=request.username)
        if not patron or not verify_password(request.password, patron.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
            )
        access_token = create_access_token(
            data={"sub": patron.username, "role": "patron"},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        )
        return {"access_token": access_token, "role": "patron", "token_type": "bearer"}
