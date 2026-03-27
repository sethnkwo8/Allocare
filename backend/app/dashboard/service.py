from app.models.base import Income,Expense, Goal
from app.notifications.service import get_user_and_unread_count
from sqlmodel import select, func, desc
from app.analytics.service import get_category_spending, get_total_buckets_spending
from decimal import Decimal

# Function to get dashboard data
def get_dashboard_data(db_session, session_token):
    # Get user and unread notification count
    user, unread_count = get_user_and_unread_count(session_token, db_session)

    # Get user name
    user_name = user.name

    # Get users currency code
    currency_code = user.currency

    # total income
    income_stmt = select(func.sum(Income.amount)).where(Income.user_id == user.id)
    raw_income = db_session.exec(income_stmt).one()
    total_income = Decimal(str(raw_income or 0))

    # total spent
    expense_stmt = select(func.sum(Expense.amount)).where(Expense.user_id == user.id)
    raw_spent = db_session.exec(expense_stmt).one()
    total_spent = Decimal(str(raw_spent or 0))

    remaining_balance = total_income - total_spent

    # Get bucket spendings
    bucket_results = get_total_buckets_spending(db_session, user)

    # Get category spendings
    category_results = get_category_spending(db_session, user)

    # recent expenses
    recent_stmt = (
        select(Expense)
        .where(Expense.user_id == user.id)
        .order_by(desc(Expense.date))
        .limit(5)
    )

    recent_expenses = db_session.exec(recent_stmt).all()

    # Uncompleted goals
    goal_stmt = select(Goal).where(Goal.user_id == user.id, Goal.is_completed.is_(False)).limit(3)
    goals = db_session.exec(goal_stmt).all()

    return total_income, total_spent, remaining_balance, recent_expenses, unread_count, goals, bucket_results, category_results, currency_code, user_name