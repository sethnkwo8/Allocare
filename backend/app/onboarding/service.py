from app.auth.service import get_current_user
from .schema import CurrencyRequest, IncomeRequest
from app.models.base import Income

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