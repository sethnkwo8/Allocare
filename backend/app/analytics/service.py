from app.models.base import Expense, BudgetCategory, BudgetBucket
from app.auth.service import get_current_user
from app.auth.exceptions import UnauthorizedError
from app.utils.date_utils import get_current_month_range
from sqlmodel import select, func, and_
from .schema import OverBudgetCategory

# Function to calculate how much user spent per category
def get_category_spending(db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

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

# Function to get buckets spendings
def get_total_buckets_spending(db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)
    
    # Get expenses by buckets

    # Get start of month and start of next month
    start_of_month, start_of_next_month = get_current_month_range()

    # Create a subquery to sum expenses per category for this month
    expense_subquery = select(Expense.category_id, func.sum(Expense.amount).label('category_spent')).where(
        Expense.user_id == user.id,
        Expense.date >= start_of_month,
        Expense.date < start_of_next_month
    ).group_by(Expense.category_id).subquery()

    # Now join the Bucket to Categories and the Subquery
    statement = (
        select(
            BudgetBucket,
            func.coalesce(func.sum(expense_subquery.c.category_spent), 0.0).label("total_spent"),
            func.coalesce(func.sum(BudgetCategory.monthly_limit), 0.0).label("total_limit")
        )
        .join(BudgetCategory, isouter=True)
        # Join our summed expenses subquery on category_id
        .join(expense_subquery, BudgetCategory.id == expense_subquery.c.category_id, isouter=True)
        .where(BudgetBucket.user_id == user.id)
        .group_by(BudgetBucket.id)
    )
    
    results = db_session.exec(statement).all()

    return results

# Function to get summary for dashboard
def get_dashboard_summary(db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)
    
    # Initialize total_spent and total_limit
    total_spent = 0
    total_budget= 0

    # Get categories spendings
    category_results = get_category_spending(db_session, session_token)

    # Initialize list for over budget categories
    over_budget_details = []

    # Get total_spent and total_limits
    for category, spent in category_results:
        # Ensure we are working with Decimals for financial precision
        c_spent = spent
        c_limit = category.monthly_limit or 0
        
        total_spent += c_spent
        total_budget += c_limit

        # If spent exceeds limit, create the OverBudgetCategory object
        if c_spent > c_limit and c_limit > 0:
            overage_amount = c_spent - c_limit
            over_budget_details.append(
                OverBudgetCategory(name=category.name, overage=overage_amount)
            )

    remaining_budget = total_budget - total_spent

    return total_spent, total_budget, remaining_budget, over_budget_details