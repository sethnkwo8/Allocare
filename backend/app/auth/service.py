from passlib.context import CryptContext
from sqlmodel import select
from . import schema
from app.models.base import User, Session
import secrets, uuid
from datetime import datetime, timedelta, timezone
from app.auth.exception import UserAlreadyExistsError, InvalidCredentialsError
from pydantic import EmailStr

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Function for user creation
def create_user(user_data: schema.RegisterRequest, db_session):
    # Check if user exists already
    result = db_session.exec(select(User).where(User.email == user_data.email))
    existing_user = result.first() # Get first result

    # Raise domain error if user already exists
    if existing_user:
        raise UserAlreadyExistsError(user_data.email)
    
    # Hash password
    hashed_password = pwd_context.hash(user_data.password.get_secret_value())

    # Create user
    user = User(email=user_data.email, hashed_password=hashed_password, onboarding=False)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

# Authenticate user
def authenticate_user(user_data: schema.LoginRequest, db_session):
    # Find user by email
    result = db_session.exec(select(User).where(User.email == user_data.email))
    user = result.first()

    # Check if user exists
    if not user:
        raise InvalidCredentialsError()
    
    # Verify password
    if not pwd_context.verify(user_data.password.get_secret_value(), user.hashed_password):
        raise InvalidCredentialsError()
    
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


