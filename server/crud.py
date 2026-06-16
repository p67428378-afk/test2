from sqlalchemy.orm import Session
from server import models, schemas

def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()

def get_user_by_mobile_number(db: Session, mobile_number: str):
    return db.query(models.User).filter(models.User.mobile_number == mobile_number).first()

def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at)
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp

def get_otp(db: Session, otp_session_id: str):
    return db.query(models.OTP).filter(models.OTP.id == otp_session_id).first()

def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True
    db.commit()
    db.refresh(otp)
    return otp

def create_password_history(db: Session, user_id: str, hashed_password: str):
    db_password_history = models.PasswordHistory(user_id=user_id, hashed_password=hashed_password)
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history

def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user

def get_alphabets(db: Session):
    return db.query(models.Alphabet).order_by(models.Alphabet.letter).all()

def get_numbers(db: Session):
    return db.query(models.Number).order_by(models.Number.number).all()

def seed_learning_data(db: Session):
    # Seed alphabets if empty
    if db.query(models.Alphabet).count() == 0:
        alphabet_data = [
            {"letter": "A", "word": "Apple", "emoji": "🍎"},
            {"letter": "B", "word": "Ball", "emoji": "⚽"},
            {"letter": "C", "word": "Cat", "emoji": "🐱"},
            {"letter": "D", "word": "Dog", "emoji": "🐶"},
            {"letter": "E", "word": "Elephant", "emoji": "🐘"},
            {"letter": "F", "word": "Fish", "emoji": "🐟"},
            {"letter": "G", "word": "Grapes", "emoji": "🍇"},
            {"letter": "H", "word": "Hat", "emoji": "🎩"},
            {"letter": "I", "word": "Ice Cream", "emoji": "🍦"},
            {"letter": "J", "word": "Juice", "emoji": "🧃"},
            {"letter": "K", "word": "Kite", "emoji": "🪁"},
            {"letter": "L", "word": "Lion", "emoji": "🦁"},
            {"letter": "M", "word": "Monkey", "emoji": "🐵"},
            {"letter": "N", "word": "Nest", "emoji": "🪹"},
            {"letter": "O", "word": "Owl", "emoji": "🦉"},
            {"letter": "P", "word": "Panda", "emoji": "🐼"},
            {"letter": "Q", "word": "Queen", "emoji": "👑"},
            {"letter": "R", "word": "Rabbit", "emoji": "🐰"},
            {"letter": "S", "word": "Sun", "emoji": "☀️"},
            {"letter": "T", "word": "Tiger", "emoji": "🐯"},
            {"letter": "U", "word": "Umbrella", "emoji": "☔"},
            {"letter": "V", "word": "Violin", "emoji": "🎻"},
            {"letter": "W", "word": "Watermelon", "emoji": "🍉"},
            {"letter": "X", "word": "Xylophone", "emoji": "🪘"},
            {"letter": "Y", "word": "Yo-yo", "emoji": "🪀"},
            {"letter": "Z", "word": "Zebra", "emoji": "🦓"}
        ]
        for item in alphabet_data:
            db.add(models.Alphabet(letter=item["letter"], word=item["word"], emoji=item["emoji"]))
        db.commit()

    # Seed numbers if empty
    if db.query(models.Number).count() == 0:
        number_data = [
            {"number": 1, "word": "One", "emoji": "🎈"},
            {"number": 2, "word": "Two", "emoji": "🎈🎈"},
            {"number": 3, "word": "Three", "emoji": "🎈🎈🎈"},
            {"number": 4, "word": "Four", "emoji": "🍀"},
            {"number": 5, "word": "Five", "emoji": "🖐️"},
            {"number": 6, "word": "Six", "emoji": "🎲"},
            {"number": 7, "word": "Seven", "emoji": "🌈"},
            {"number": 8, "word": "Eight", "emoji": "🐙"},
            {"number": 9, "word": "Nine", "emoji": "🌸"},
            {"number": 10, "word": "Ten", "emoji": "🔟"},
            {"number": 11, "word": "Eleven", "emoji": "⭐"},
            {"number": 12, "word": "Twelve", "emoji": "🕛"},
            {"number": 13, "word": "Thirteen", "emoji": "🍩"},
            {"number": 14, "word": "Fourteen", "emoji": "🧁"},
            {"number": 15, "word": "Fifteen", "emoji": "🍬"},
            {"number": 16, "word": "Sixteen", "emoji": "🍭"},
            {"number": 17, "word": "Seventeen", "emoji": "🎨"},
            {"number": 18, "word": "Eighteen", "emoji": "🚀"},
            {"number": 19, "word": "Nineteen", "emoji": "🧸"},
            {"number": 20, "word": "Twenty", "emoji": "⚽"}
        ]
        for item in number_data:
            db.add(models.Number(number=item["number"], word=item["word"], emoji=item["emoji"]))
        db.commit()
