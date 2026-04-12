from sqlmodel import select
from . import schema
from app.models.base import User, Session, BudgetBucket, BudgetCategory, Income
import secrets, uuid
from datetime import datetime, timedelta, timezone
from . import exceptions
from ..utils import security
from app.utils.create_notification import create_notification
from app.utils.convert_to_monthly import convert_to_monthly
from app.models.notification import NotificationType
from app.onboarding.exceptions import CategoryAllocationError, BucketAllocationError
from app.onboarding.schema import OnboardingUpdateRequest


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
    user = User(name=user_data.name, email=user_data.email, hashed_password=hashed_password, onboarding=False)

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

# Function to get user budget configurations
def get_bucket_configurations(session_token, db_session):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Get income data 
    income_stmt = select(Income).where(Income.user_id == user.id)
    income = db_session.exec(income_stmt).first()

    # Get all buckets belonging to user
    bucket_statement = select(BudgetBucket).where(BudgetBucket.user_id == user.id)
    buckets = db_session.exec(bucket_statement).all()

    # 3. Response structure
    config_data = {
        "currency": user.currency,
        "income": income.amount if income else 0,
        "frequency": income.frequency if income else "monthly",
        "buckets": []
    }

    for bucket in buckets:
        # Get categories for specific bucket
        category_statement = select(BudgetCategory).where(BudgetCategory.bucket_id == bucket.id)
        categories = db_session.exec(category_statement).all()

        bucket_dict = {
            "name": bucket.name,
            "percentage_allocation": bucket.percentage_allocation,
            "categories": [
                {
                    "name": cat.name,
                    "percentage_allocation": cat.percentage_allocation,
                    "monthly_limit": cat.monthly_limit
                } for cat in categories
            ]
        }
        config_data["buckets"].append(bucket_dict)

    return config_data

# Function to update budget allocations
def update_budget_allocations(session_token, db_session, buckets_data: OnboardingUpdateRequest):
    user = get_current_user(db_session, session_token)
    
    # Get current income to recalculate limits
    statement = select(Income).where(Income.user_id == user.id)
    user_income = db_session.exec(statement).first()

    # Convert income to monthly
    monthly_income = convert_to_monthly(user_income.amount, user_income.frequency)

    # Check percentage total
    total_percentage = sum(b.percentage_allocation for b in buckets_data.buckets)
    if total_percentage != 100:
        raise BucketAllocationError()

    # Update Buckets
    try:
        for b_data in buckets_data.buckets:
            if b_data.categories and sum(c.percentage_allocation for c in b_data.categories) != 100:
                raise CategoryAllocationError()
            
            # Find existing bucket for this user by name
            stmt = select(BudgetBucket).where(
                BudgetBucket.user_id == user.id, 
                BudgetBucket.name == b_data.name
            )
            bucket = db_session.exec(stmt).first()

            if bucket:
                bucket.percentage_allocation = b_data.percentage_allocation
                db_session.add(bucket)
                
                # Update Categories inside this bucket
                if b_data.categories:
                    bucket_share = (monthly_income * bucket.percentage_allocation) / 100
                    
                    for c_data in b_data.categories:
                        # Find existing category
                        c_stmt = select(BudgetCategory).where(
                            BudgetCategory.bucket_id == bucket.id,
                            BudgetCategory.name == c_data.name
                        )
                        category = db_session.exec(c_stmt).first()
                        
                        if category:
                            # Calculate new limit based on new percentage
                            percentage = float(c_data.percentage_allocation)
                            actual_limit = (bucket_share * percentage) / 100

                            # Update fields
                            category.percentage_allocation = percentage
                            category.monthly_limit = round(actual_limit, 2)
                            db_session.add(category)

        db_session.commit()

    except Exception as e:
        db_session.rollback()
        raise e
    return {"message": "Allocations updated successfully"}

