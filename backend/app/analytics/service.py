from app.models.base import Expense, BudgetCategory
from app.auth.service import get_current_user
from app.auth.exceptions import UnauthorizedError
from sqlmodel import select, func, and_
from datetime import datetime

# Function to calculate how much user spent per category
def get_category_spending(db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    if not user:
        raise UnauthorizedError()
    
    # Get expenses by category

    # Start of month
    start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # Start of next month
    if start_of_month.month == 12:
        # If December, move to January of next year
        start_of_next_month = start_of_month.replace(year=start_of_month.year + 1, month=1)
    else:
        # Otherwise, just increment the month
        start_of_next_month = start_of_month.replace(month=start_of_month.month + 1)

    # Select category and sum of expenses amount per category as total for user
    statement = select(BudgetCategory, func.coalesce(func.sum(Expense.amount), 0.0).label('total')).join(
        Expense, and_(Expense.category_id == BudgetCategory.id,
                      Expense.user_id == user.id,
                      Expense.date >= start_of_month,
                      Expense.date < start_of_next_month), isouter=True).group_by(BudgetCategory.id) # Grouped by category 
    
    results = db_session.exec(statement).all()

    return results

