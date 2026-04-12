from app.auth.service import get_current_user
from .schema import CurrencyRequest, IncomeRequest, BucketCreate, CategoryCreate, OnboardingRequest
from app.models.base import Income, BudgetBucket, BudgetCategory
from sqlmodel import select
from .exceptions import BucketAccessDenied, BucketAllocationError, OnboardingAlreadyComplete, IncorrectBucketCount
from app.utils.convert_to_monthly import convert_to_monthly
from app.utils.create_notification import create_notification
from app.models.notification import NotificationType

# Function to set user currency
def set_user_currency(currency_data: CurrencyRequest, db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Update the value
    user.currency = currency_data.currency
    
    # Explicitly add to session'
    db_session.add(user) 
    
    # Commit the transaction
    db_session.commit()
    
    # Refresh
    db_session.refresh(user)

    return {"message": "Currency updated"}

# Function to create income
def create_user_income(income_data: IncomeRequest, db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Check if user already has income set
    statement = select(Income).where(Income.user_id == user.id)
    existing_income = db_session.exec(statement).first()

    # Update income if already existing
    if existing_income:
        existing_income.amount = income_data.amount
        existing_income.frequency = income_data.frequency
        db_session.add(existing_income)
        message = "Income updated"
    else:
        # Create income if not existing
        income = Income(amount=income_data.amount, frequency=income_data.frequency, user=user)
        db_session.add(income)
        message = "Income Created"

    db_session.commit()

    return {"message": message}

# Function for creating budget bucket
def create_bucket(bucket_data: BucketCreate, db_session, user):
    # Create budget bucket
    bucket = BudgetBucket(name=bucket_data.name, percentage_allocation=bucket_data.percentage_allocation, user=user)

    db_session.add(bucket)
    db_session.flush()
    db_session.refresh(bucket)

    return bucket

# Function for creating budget category
def create_category(category_data: CategoryCreate, db_session, bucket):
    if not bucket:
        raise BucketAccessDenied()

    # Create budget category
    category = BudgetCategory(name=category_data.name, monthly_limit=category_data.monthly_limit, percentage_allocation=category_data.percentage_allocation, bucket=bucket)

    db_session.add(category)

# Function to complete onboarding
def complete_onboarding(session_token, db_session, buckets: OnboardingRequest ):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Raise error if onboarding already complete
    if user.onboarding:
        raise OnboardingAlreadyComplete()
    
    # Get users income to convert
    statement = select(Income).where(Income.user_id == user.id)
    user_income = db_session.exec(statement).first()

    # Convert income to Monthly 
    monthly_income = convert_to_monthly(user_income.amount, user_income.frequency)
    
    # Validate bucket count is 3
    if len(buckets.buckets) != 3:
        raise IncorrectBucketCount()

    # Validate sum of percentage allocation for buckets
    total_percentage = sum(b.percentage_allocation for b in buckets.buckets)
    if total_percentage != 100:
        raise BucketAllocationError()
    
    try:
        # Create categories for each bucket
        for bucket_data in buckets.buckets:
            # Create buckets (Needs, Wants, Savings)
            bucket = create_bucket(bucket_data, db_session, user)

            if bucket_data.categories:
                for category_data in bucket_data.categories:
                    # Convert percentage to currency amount
                    percentage = float(category_data.percentage_allocation)

                    # Get bucket share
                    bucket_share = (monthly_income * bucket_data.percentage_allocation) / 100
                    actual_limit = (bucket_share * percentage) / 100

                    category_data.monthly_limit = round(actual_limit, 2)
                    create_category(category_data, db_session, bucket)
        
        # Set onboarding to true for completion
        user.onboarding = True
        db_session.commit()

        # Create notification
        title = "🎉 Welcome to Allocare"
        message = f"Welcome to Allocare, {user.name}! Start by creating your first budget bucket"
        create_notification(
            title=title,
            notification_type=NotificationType.WELCOME,
            message=message,
            user_id=user.id,
            db_session=db_session
        )
        db_session.commit()
    # Undo everything if anything fails 
    except Exception as e:
        db_session.rollback()
        raise e