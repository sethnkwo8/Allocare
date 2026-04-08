from app.auth.service import get_current_user
from .schema import CurrencyRequest, IncomeRequest, BucketCreate, CategoryCreate, OnboardingRequest
from app.models.base import Income, BudgetBucket, BudgetCategory
from sqlmodel import select
from .exceptions import BucketAccessDenied, BucketAllocationError, OnboardingAlreadyComplete, IncorrectBucketCount, CategoryAllocationError
from app.utils.convert_to_monthly import convert_to_monthly

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
    # Undo everything if anything fails 
    except Exception as e:
        db_session.rollback()
        raise e

# Function to update budget allocations
def update_budget_allocations(session_token, db_session, buckets_data: OnboardingRequest):
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
        
# Function to get budget configurations
def get_bucket_configurations(session_token, db_session):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Get all buckets belonging to user
    bucket_statement = select(BudgetBucket).where(BudgetBucket.user_id == user.id)
    buckets = db_session.exec(bucket_statement).all()

    # 3. Response structure
    config_data = {
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