from datetime import datetime, timezone
from decimal import Decimal
import uuid
from app.models.rollover import Rollover
from app.models.expense import Expense
from app.models.goal import Goal
from app.models.budget_bucket import BudgetBucket
from app.models.budget_category import BudgetCategory
from . import exceptions
from sqlmodel import select

# Function to apply remaining balance as bonus income for next month
def handle_monthly_rollover(db_session, user_id: uuid.UUID, amount: Decimal):
    now = datetime.now(timezone.utc)
    
    # Calculate target month and year
    if now.month == 12:
        target_month = 1
        target_year = now.year + 1
    else:
        target_month = now.month + 1
        target_year = now.year

    # Check if a rollover from this source month already exists
    stmt = select(Rollover).where(
        Rollover.user_id == user_id,
        Rollover.source_month == now.month,
        Rollover.source_year == now.year
    )
    existing = db_session.exec(stmt).first()
    
    if existing:
        existing.amount = amount
        active_rollover = existing
    else:
        active_rollover = Rollover(
            user_id=user_id,
            amount=amount,
            month=target_month,
            year=target_year,
            source_month=now.month,
            source_year=now.year
        )
        db_session.add(active_rollover) # Add only if it's new
    
    db_session.commit()
    db_session.refresh(active_rollover)
    return active_rollover

# Function to deposit surplus into goal
def handle_surplus_sweep(db_session, user_id: uuid.UUID, goal_id: uuid.UUID, amount: Decimal):
    # Find 'Financial Goals' category for this user
    stmt = (
        select(BudgetCategory)
        .join(BudgetBucket)
        .where(
            BudgetBucket.user_id == user_id,
            BudgetBucket.name.ilike("savings"),
            BudgetCategory.name.ilike("financial goals")
        )
    )
    category = db_session.exec(stmt).first()
    
    if not category:
        raise exceptions.FinacialGoalsNotFound()

    # Create the 'Surplus' Expense
    sweep_expense = Expense(
        title="Surplus Sweep",
        amount=amount,
        category_id=category.id,
        user_id=user_id,
        is_surplus=True,
        notes=f"End of month surplus sweep into goal"
    )

    # Update the Goal Balance
    goal = db_session.get(Goal, goal_id)
    if goal:
        goal.current_amount += amount
    else:
        raise exceptions.GoalNotFound()

    db_session.add(sweep_expense)
    db_session.add(goal)
    db_session.commit()
    
    return sweep_expense