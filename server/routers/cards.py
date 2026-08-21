from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server.database import get_db
from server.models import Deck, Card
from server.schemas import CardCreate, CardUpdate, CardResponse

router = APIRouter(tags=["Cards"])


@router.post(
    "/api/v1/decks/{deck_id}/cards",
    response_model=CardResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_card(deck_id: str, card_in: CardCreate, db: Session = Depends(get_db)):
    deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found"
        )

    if not card_in.front.strip() or not card_in.back.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Front and back content cannot be empty or whitespace-only",
        )

    card = Card(deck_id=deck_id, front=card_in.front.strip(), back=card_in.back.strip())
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


@router.get("/api/v1/decks/{deck_id}/cards", response_model=List[CardResponse])
def list_cards(deck_id: str, db: Session = Depends(get_db)):
    deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found"
        )
    return deck.cards


@router.put("/api/v1/cards/{card_id}", response_model=CardResponse)
def update_card(card_id: str, card_in: CardUpdate, db: Session = Depends(get_db)):
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Card not found"
        )

    if card_in.front is not None:
        if not card_in.front.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Front content cannot be empty or whitespace-only",
            )
        card.front = card_in.front.strip()

    if card_in.back is not None:
        if not card_in.back.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Back content cannot be empty or whitespace-only",
            )
        card.back = card_in.back.strip()

    db.commit()
    db.refresh(card)
    return card


@router.delete("/api/v1/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(card_id: str, db: Session = Depends(get_db)):
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Card not found"
        )
    db.delete(card)
    db.commit()
    return None
