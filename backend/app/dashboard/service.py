from app.models.base import Income,Expense, Goal, BudgetBucket, BudgetCategory, Notification, Rollover
from app.notifications.service import get_user_and_unread_count
from sqlmodel import select, func, desc
from app.analytics.service import get_category_spending, get_total_buckets_spending
from app.utils.date_utils import get_current_month_range
from decimal import Decimal
from . import exceptions

# Function to get dashboard data
def get_dashboard_data(db_session, session_token):
    # Get user and unread notification count
    user, unread_count = get_user_and_unread_count(session_token, db_session)

    # Get current month range
    start_of_month, start_of_next_month = get_current_month_range()

    # Get user name
    user_name = user.name

    # Get users currency code
    currency_code = user.currency

    # Income record
    income_stmt = select(Income).where(Income.user_id == user.id)
    income_record = db_session.exec(income_stmt).first()
    base_income = income_record.amount if income_record else Decimal("0.00")

    # Bonus from previous month
    rollover_stmt = select(func.sum(Rollover.amount)).where(
        Rollover.user_id == user.id,
        Rollover.month == start_of_month.month,
        Rollover.year == start_of_month.year
    )
    rollover_amount = db_session.exec(rollover_stmt).one() or Decimal("0.00")

    # Total income
    total_income = Decimal(str(base_income)) + rollover_amount
    income_frequency = income_record.frequency if income_record else "monthly"

    # total spent for month
    expense_stmt = select(func.sum(Expense.amount)).where(
        Expense.user_id == user.id,
        Expense.date >= start_of_month,
        Expense.date < start_of_next_month,
        # Expense.is_surplus == False
        )
    raw_spent = db_session.exec(expense_stmt).one()
    total_spent = Decimal(str(raw_spent or 0))

    # Remaining balance for month
    remaining_balance = Decimal(str(total_income)) - total_spent

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

    # Check if savings are initialized for the current month
    savings_init_stmt = (
        select(func.count(Expense.id))
        .join(BudgetCategory)
        .join(BudgetBucket)
        .where(
            BudgetBucket.user_id == user.id,
            BudgetBucket.name == "savings",
            Expense.date >= start_of_month,
            Expense.date < start_of_next_month
        )
    )
    savings_count = db_session.exec(savings_init_stmt).one()

    # If count is 0, they haven't moved money to savings yet this month
    needs_savings_init = savings_count == 0

    # Get recent notifications
    notification_stmt = (
        select(Notification)
        .where(Notification.user_id == user.id)
        .order_by(desc(Notification.created_at))
        .limit(5)
    )
    recent_notifications = db_session.exec(notification_stmt).all()

    return base_income, total_income, rollover_amount, income_frequency, total_spent, remaining_balance, recent_expenses, unread_count, recent_notifications, goals, bucket_results, category_results, currency_code, user_name, needs_savings_init

# Function to initialize savings allocation automatically
def initialize_monthly_allocation(db_session, user):
    # Get current month range
    start_of_month, start_of_next_month = get_current_month_range()

    # Check if user already has savings expenses this month
    stmt = select(Expense).join(BudgetCategory).join(BudgetBucket).where(
        BudgetBucket.user_id == user.id,
        BudgetBucket.name == "savings",
        Expense.date >= start_of_month,
        Expense.date < start_of_next_month
    )

    existing_check = db_session.exec(stmt).first()

    if existing_check:
        raise exceptions.SavingsAlreadyInitializedError()
    
    # Get savings bucket categories
    statement = (
        select(BudgetCategory)
        .join(BudgetBucket)
        .where(
            BudgetBucket.user_id == user.id,
            BudgetBucket.name == "savings"
        )
    )
    savings_categories = db_session.exec(statement).all()

    created_expenses = []

    # Create an expense for each category
    for category in savings_categories:
        # Skip auto filling financial goals category
        if category.name == "Financial Goals":
            continue

        if category.monthly_limit > 0:
            new_allocation = Expense(
                title=f"Monthly Allocation: {category.name}",
                amount=category.monthly_limit,
                category_id=category.id,
                user_id=user.id,
                notes="Automatic allocation from monthly budget targets."
            )
            db_session.add(new_allocation)
            created_expenses.append(new_allocation)

    db_session.commit()
    
    return {"message": "Monthly savings successfully allocated!" }