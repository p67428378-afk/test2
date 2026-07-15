from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Broker
from server.schemas import BrokerRegister, BrokerResponse, Token
from server.auth import get_password_hash, verify_password, create_access_token
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()


@router.post(
    "/auth/register", response_model=BrokerResponse, status_code=status.HTTP_201_CREATED
)
def register(broker_in: BrokerRegister, db: Session = Depends(get_db)):
    # Check if username or email already exists
    existing_user = (
        db.query(Broker)
        .filter(
            (Broker.username == broker_in.username) | (Broker.email == broker_in.email)
        )
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists",
        )

    hashed_password = get_password_hash(broker_in.password)
    db_broker = Broker(
        username=broker_in.username,
        email=broker_in.email,
        hashed_password=hashed_password,
    )
    db.add(db_broker)
    db.commit()
    db.refresh(db_broker)
    return db_broker


@router.post("/auth/token", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    broker = db.query(Broker).filter(Broker.username == form_data.username).first()
    if not broker or not verify_password(form_data.password, broker.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": broker.username})
    return {"access_token": access_token, "token_type": "bearer"}
