from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from server.database import get_db
from server.models import Message, Property, User
from server.schemas import MessageCreate, MessageResponse, MessageListResponse
from server.auth import get_current_user, get_current_buyer

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.post("", response_model=MessageResponse, status_code=201)
def send_message(
    msg_in: MessageCreate,
    current_buyer: User = Depends(get_current_buyer),
    db: Session = Depends(get_db),
):
    # Validate property exists
    prop = db.query(Property).filter(Property.id == msg_in.property_id).first()
    if not prop:
        raise HTTPException(status_code=400, detail="Invalid receiver or property ID")

    # Validate receiver exists and is a broker
    receiver = db.query(User).filter(User.id == msg_in.receiver_id).first()
    if not receiver or receiver.role != "broker":
        raise HTTPException(status_code=400, detail="Invalid receiver or property ID")

    db_msg = Message(
        sender_id=current_buyer.id,
        receiver_id=msg_in.receiver_id,
        property_id=msg_in.property_id,
        content=msg_in.content,
    )
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg


@router.get("", response_model=List[MessageListResponse])
def list_messages(
    property_id: Optional[UUID] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Retrieve messages where user is sender or receiver
    query = db.query(Message).filter(
        (Message.sender_id == current_user.id)
        | (Message.receiver_id == current_user.id)
    )

    if property_id:
        query = query.filter(Message.property_id == property_id)

    messages = query.order_by(Message.created_at.desc()).all()

    results = []
    for m in messages:
        results.append(
            MessageListResponse(
                id=m.id,
                content=m.content,
                property_id=m.property_id,
                property_address=m.property.address,
                receiver_id=m.receiver_id,
                receiver_name=m.receiver.full_name,
                sender_id=m.sender_id,
                sender_name=m.sender.full_name,
                created_at=m.created_at,
            )
        )
    return results
