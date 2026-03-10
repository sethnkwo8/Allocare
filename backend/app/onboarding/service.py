from app.auth.service import get_current_user
from .schema import CurrencyRequest, IncomeRequest, BucketCreate, CategoryCreate, OnboardingRequest
from app.models.base import Income, BudgetBucket, BudgetCategory
from sqlmodel import select
from .exceptions import BucketAccessDenied, BucketAllocationError, OnboardingAlreadyComplete, IncorrectBucketCount
from .default_categories import DEFAULT_CATEGORIES
from app.auth.exceptions import UnauthorizedError

# Function to set user currency
def set_user_currency(currency_data: CurrencyRequest, db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Update currency
    if user.currency != currency_data.currency:
        user.currency = currency_data.currency

        db_session.commit()

    return {"message": "Currency updated"}

# Function to create income
def create_user_income(income_data: IncomeRequest, db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Create income
    income = Income(amount=income_data.amount, frequency=income_data.frequency, user=user)

    db_session.add(income)
    db_session.commit()
    db_session.refresh(income)

    return {"message": "Income created"}

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
    category = BudgetCategory(name=category_data.name, monthly_limit=category_data.monthly_limit, bucket=bucket)

    db_session.add(category)

# Function to create default categories
def create_default_categories(bucket: BudgetBucket, db_session):
    # Create default categories for each bucket
    default_categories = DEFAULT_CATEGORIES[bucket.name]
    for category in default_categories:
        category_data = CategoryCreate(name=category, monthly_limit=None)
        create_category(category_data, db_session, bucket)

# Function to complete onboarding
def complete_onboarding(session_token, db_session, buckets: OnboardingRequest ):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Raise error if onboarding already complete
    if user.onboarding:
        raise OnboardingAlreadyComplete()
    
    # Validate bucket count is 3
    if len(buckets.buckets) != 3:
        raise IncorrectBucketCount()

    # Validate sum of percentage allocation for buckets
    total_percentage = sum(b.percentage_allocation for b in buckets.buckets)
    if total_percentage != 100:
        raise BucketAllocationError()
    
    try:
        # Create default categories and categories for each bucket
        for bucket_data in buckets.buckets:
            bucket = create_bucket(bucket_data, db_session, user)
            create_default_categories(bucket, db_session)
            if bucket_data.categories:
                for category_data in bucket_data.categories:
                    create_category(category_data, db_session, bucket)
        
        # Set onboarding to true for completion
        user.onboarding = True
        db_session.commit()
        db_session.refresh(user)
    # Undo everything if anything fails 
    except Exception as e:
        db_session.rollback()
        raise e
        