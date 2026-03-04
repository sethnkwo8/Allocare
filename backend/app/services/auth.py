from passlib.context import CryptContext
from sqlmodel import select
from app.schemas.auth import RegisterRequest
from app.models.base import User, Session
import secrets
import uuid
from datetime import datetime, timedelta, timezone

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Custom domain error
class UserAlreadyExistsError(Exception):
    def __init__(self, email: str):
        self.email = email
        self.message = f"User with email {email} already exists."
        super().__init__(self.message)

# Function for user creation
def create_user(user_data: RegisterRequest, db_session):
    # Check if user exists already
    result = db_session.exec(select(User).where(User.email == user_data.email))
    existing_user = result.first() # Get first result

    # Raise domain error if user already exists
    if existing_user:
        raise UserAlreadyExistsError(user_data.email)
    
    # Hash password
    hashed_password = pwd_context.hash(user_data.password.get_secret_value())

    # Create user
    user = User(email=user_data.email, password=hashed_password, onboarding=False)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

# Function for session creation
def create_session(user_id: uuid.UUID, db_session):
    # Random token creation
    session_token = secrets.token_urlsafe(32)
    expiry = datetime.now(timezone.utc) + timedelta(days=7)

    # Check if session for user exists already
    result = db_session.exec(select(Session).where(Session.user_id == user_id))
    existing_session = result.first()

    if existing_session:
        # Update existing record
        existing_session.token = session_token
        existing_session.expires_at = expiry
        db_session.add(existing_session)
    else:
        # If no existing session
        new_session = Session(token=session_token, expires_at=expiry, user_id=user_id)
        db_session.add(new_session)
    
    db_session.commit()
    return session_token


