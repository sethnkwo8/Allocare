from datetime import datetime, timezone
from decimal import Decimal
import uuid
from app.models.rollover import Rollover
from app.models.expense import Expense
from app.models.goal import Goal
from app.models.budget_bucket import BudgetBucket
from app.models.budget_category import BudgetCategory
from . import exceptions
from sqlmodel import select, func, String, cast, extract
from app.utils.create_notification import create_notification
from app.models.notification import NotificationType
from app.utils.milestone_check import check_goal_milestone

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
            func.lower(cast(BudgetBucket.name, String)) == "savings",
            func.lower(cast(BudgetCategory.name, String)) == "financial goals"
        )
    )
    category = db_session.exec(stmt).first()
    
    if not category:
        raise exceptions.FinacialGoalsNotFound()

    # Get Goal and track old state
    goal = db_session.get(Goal, goal_id)
    if not goal:
        raise exceptions.GoalNotFound()
    
    was_completed = goal.is_completed
    old_amount = goal.current_amount

    # Check if sweep exists already
    existing_sweep = db_session.exec(
        select(Expense).where(
            Expense.user_id == user_id,
            Expense.title == "Surplus Sweep",
            extract('month', Expense.date) == datetime.now().month
        )
    ).first()

    if existing_sweep:
        return existing_sweep # Skip if already done
    
    # Create the 'Surplus' Expense
    sweep_expense = Expense(
        title="Surplus Sweep",
        amount=amount,
        category_id=category.id,
        user_id=user_id,
        is_surplus=True,
        notes=f"End of month surplus sweep into goal"
    )

    # Update goal balance and check if complete
    goal.current_amount += amount
    goal.is_completed = goal.current_amount >= goal.target_amount

    # Milestone & notification Logic
    milestone = check_goal_milestone(
        old_current=old_amount, 
        new_current=goal.current_amount, 
        target=goal.target_amount
    )

    # Trigger Milestone Notification
    if milestone and not goal.is_completed:
        create_notification(
            title="📈 Goal Milestone",
            notification_type=NotificationType.GOAL_MILESTONE,
            message=f"Surplus sweep pushed you to {milestone}% of your {goal.name} goal! 🎉",
            user_id=user_id,
            reference_id=goal.id,
            db_session=db_session
        )

    # Trigger Completion Notification
    if not was_completed and goal.is_completed:
        create_notification(
            title="🎉 Goal Completed",
            message=f"End-of-month surplus completed your {goal.name} goal!",
            notification_type=NotificationType.GOAL_COMPLETED,
            user_id=user_id,
            reference_id=goal.id,
            db_session=db_session
        )

    db_session.add(sweep_expense)
    db_session.add(goal)
    db_session.commit()
    
    return sweep_expense