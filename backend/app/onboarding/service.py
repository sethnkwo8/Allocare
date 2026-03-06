from app.auth.service import get_current_user
from .schema import CurrencyRequest

# Function to set user currency
def set_user_currency(currency_data: CurrencyRequest, db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Update currency
    user.currency = currency_data.currency

    db_session.add(user)
    db_session.commit()

    return {"message": "Currency updated"}