from app.models.base import Expense, BudgetCategory
from app.auth.service import get_current_user
from app.auth.exceptions import UnauthorizedError
from app.utils.date_utils import get_current_month_range
from sqlmodel import select, func, and_

# Function to calculate how much user spent per category
def get_category_spending(db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    if not user:
        raise UnauthorizedError()
    
    # Get expenses by category

    # Get start of month and start of next month
    start_of_month, start_of_next_month = get_current_month_range()

    # Select category and sum of expenses amount per category as total for user
    statement = select(BudgetCategory, func.coalesce(func.sum(Expense.amount), 0.0).label('total')).join(
        Expense, and_(Expense.category_id == BudgetCategory.id,
                      Expense.user_id == user.id,
                      Expense.date >= start_of_month,
                      Expense.date < start_of_next_month), isouter=True).group_by(BudgetCategory.id) # Grouped by category 
    
    results = db_session.exec(statement).all()

    return results

