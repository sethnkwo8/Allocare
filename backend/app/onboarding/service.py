from app.auth.service import get_current_user
from .schema import CurrencyRequest, IncomeRequest, BucketCreate, CategoryCreate
from app.models.base import Income, BudgetBucket, BudgetCategory
from sqlmodel import select
from .exceptions import BucketAccessDenied
from .default_categories import DEFAULT_CATEGORIES

# Function to set user currency
def set_user_currency(currency_data: CurrencyRequest, db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Update currency
    user.currency = currency_data.currency

    db_session.add(user)
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

