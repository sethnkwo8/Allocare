from sqlmodel import select
from . import schema
from app.models.base import User, Session
import secrets, uuid
from datetime import datetime, timedelta, timezone
from . import exceptions
from ..utils import security
from app.utils.create_notification import create_notification
from app.models.notification import NotificationType


now = datetime.now(timezone.utc)

# Function for user creation
def create_user(user_data: schema.RegisterRequest, db_session):
    # Check if user exists already
    result = db_session.exec(select(User).where(User.email == user_data.email))
    existing_user = result.first() # Get first result

    # Raise domain error if user already exists
    if existing_user:
        raise exceptions.UserAlreadyExistsError(user_data.email)
    
    # Hash password
    hashed_password = security.pwd_context.hash(user_data.password.get_secret_value())

    # Create user
    user = User(email=user_data.email, hashed_password=hashed_password, onboarding=False)

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Create notification
    title = "🎉 Welcome"
    message = "Welcome to Allocare! Start by creating your first budget"
    create_notification(
        title=title,
        notification_type=NotificationType.WELCOME,
        message=message,
        user_id=user.id,
        db_session=db_session
    )
    db_session.commit()

    return user

# Authenticate user
def authenticate_user(user_data: schema.LoginRequest, db_session):
    # Find user by email
    result = db_session.exec(select(User).where(User.email == user_data.email))
    user = result.first()

    # Check if user exists
    if not user:
        raise exceptions.InvalidCredentialsError()
    
    # Verify password
    if not security.pwd_context.verify(user_data.password.get_secret_value(), user.hashed_password):
        raise exceptions.InvalidCredentialsError()
    
    return user

# Function for session creation
def create_session(user_id: uuid.UUID, db_session):
    # Random token creation
    session_token = secrets.token_urlsafe(32)
    expiry = now + timedelta(days=7)

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

# Logout function
def logout_user(session_token: str, db_session):
    # Check if session exists
    result = db_session.exec(select(Session).where(Session.token == session_token))
    existing_session = result.first()

    # Delete session
    if existing_session:
        db_session.delete(existing_session)

    db_session.commit()
    return None

# Function to get current user
def get_current_user(db_session, session_token):
    # Get session token from cookies
    if not session_token:
        raise exceptions.UnauthorizedError()
    
    # Query for session where token matches session_token in cookies
    result = db_session.exec(select(Session).where(Session.token == session_token))
    session_record = result.first()

    if not session_record:
        raise exceptions.UnauthorizedError()
    
    # Get session expiry date
    expires_at = session_record.expires_at

    if expires_at < now:
        db_session.delete(session_record)
        db_session.commit()
        raise exceptions.UnauthorizedError()
    
    # Get the session's user
    user = session_record.user

    if not user:
        raise exceptions.UnauthorizedError()

    # Return user
    return user

