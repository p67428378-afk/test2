from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server.database import get_db
from server.models import Deck
from server.schemas import DeckCreate, DeckUpdate, DeckResponse

router = APIRouter(prefix="/api/v1/decks", tags=["Decks"])


@router.post("", response_model=DeckResponse, status_code=status.HTTP_201_CREATED)
def create_deck(deck_in: DeckCreate, db: Session = Depends(get_db)):
    if not deck_in.title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title cannot be empty or whitespace-only",
        )

    deck = Deck(
        title=deck_in.title.strip(),
        description=deck_in.description.strip() if deck_in.description else None,
    )
    db.add(deck)
    db.commit()
    db.refresh(deck)
    return deck


@router.get("", response_model=List[DeckResponse])
def list_decks(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    decks = db.query(Deck).offset(skip).limit(limit).all()
    return decks


@router.get("/{deck_id}", response_model=DeckResponse)
def get_deck(deck_id: str, db: Session = Depends(get_db)):
    deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found"
        )
    return deck


@router.put("/{deck_id}", response_model=DeckResponse)
def update_deck(deck_id: str, deck_in: DeckUpdate, db: Session = Depends(get_db)):
    deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found"
        )

    if deck_in.title is not None:
        if not deck_in.title.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title cannot be empty or whitespace-only",
            )
        deck.title = deck_in.title.strip()

    if deck_in.description is not None:
        deck.description = deck_in.description.strip() if deck_in.description else None

    db.commit()
    db.refresh(deck)
    return deck


@router.delete("/{deck_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deck(deck_id: str, db: Session = Depends(get_db)):
    deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found"
        )
    db.delete(deck)
    db.commit()
    return None
