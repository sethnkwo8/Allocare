from passlib.context import CryptContext
from sqlmodel import select
from app.schemas.auth import RegisterRequest
from app.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserAlreadyExistsError(Exception):
    def __init__(self, email: str):
        self.email = email
        self.message = f"User with email {email} already exists."
        super().__init__(self.message)


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
