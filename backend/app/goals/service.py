from app.auth.service import get_current_user
from app.models.base import Goal, Expense, BudgetBucket, BudgetCategory
from app.models.notification import NotificationType
from .schema import GoalCreateRequest, DepositRequest, GoalUpdateRequest
from .exceptions import GoalAlreadyCompleted, GoalDoesNotExist
from app.utils.milestone_check import check_goal_milestone
from app.utils.calculate_goal_metrics import calculate_goal_metrics
from app.utils.create_notification import create_notification
from sqlmodel import select
import uuid

# Function to create a goal
def create_goal(goal_data:GoalCreateRequest, db_session, session_token):
    # Get current_user
    user = get_current_user(db_session, session_token)

    # Automatic completion check
    is_done = goal_data.current_amount >= goal_data.target_amount
    
    # Create goal
    goal = Goal(
        name=goal_data.name,
        target_amount=goal_data.target_amount,
        target_date=goal_data.target_date,
        description=goal_data.description,
        is_completed=is_done,
        user_id=user.id
    )

    db_session.add(goal)
    db_session.flush() # gives goal.id without commiting

    # Create notification
    title = "🚀 Goal Created"
    message = f"Your {goal.name} goal has been created."
    create_notification(
        title=title,
        notification_type=NotificationType.GOAL_CREATED,
        message=message,
        user_id=user.id,
        reference_id=goal.id,
        db_session=db_session
    )

    db_session.commit()
    db_session.refresh(goal)

    # Get progress and remaining amount
    progress, remaining_amount = calculate_goal_metrics(goal.target_amount, goal.current_amount)

    return goal, progress, remaining_amount

# Function to deposit amount for goal
def deposit_for_goal(goal_id: uuid.UUID, deposit_data: DepositRequest, db_session, session_token):
    # Get specific goal
    goal = get_specific_goal(goal_id, db_session, session_token)
    
    # Check previous completion state
    was_completed = goal.is_completed

    # Validate goal
    if goal.is_completed:
        raise GoalAlreadyCompleted()
    
    # Amount before deposit
    old_amount = goal.current_amount

    # Adding deposit amount
    goal.current_amount += deposit_data.amount

    category_stmt = select(BudgetCategory).where(BudgetCategory.name == "Financial Goals")
    goal_category = db_session.exec(category_stmt).first()

    # Create goal expense
    if goal_category:
        db_session.add(Expense(
            title=f"Goal Deposit: {goal.name}",
            amount=deposit_data.amount,
            category_id=goal_category.id,
            user_id=goal.user_id,
            notes=f"Funds moved to {goal.name}"
        ))

    # Automatic completion check
    goal.is_completed = goal.current_amount >= goal.target_amount

    # Get progress and remaining amount
    progress, remaining_amount = calculate_goal_metrics(goal.target_amount, goal.current_amount)

    # Milestone check
    milestone = check_goal_milestone(old_current=old_amount, new_current=goal.current_amount, target=goal.target_amount)

    if milestone and not goal.is_completed:
        # Create notification for milestone 
        title = "📈 Goal Milestone"
        message=f"You reached {milestone}% of your {goal.name} goal! 🎉"
        create_notification(
            title=title,
            notification_type=NotificationType.GOAL_MILESTONE,
            message=message,
            user_id=goal.user_id,
            reference_id=goal.id,
            db_session=db_session
        )

    if not was_completed and goal.is_completed:
        # Create notification
        title = "🎉 Goal Completed"
        message = f"You completed your {goal.name} goal!"
        create_notification(
            title=title,
            notification_type=NotificationType.GOAL_COMPLETED,
            message=message,
            user_id=goal.user_id,
            db_session=db_session,
            reference_id=goal.id
        )

    db_session.commit()
    db_session.refresh(goal)

    return goal, progress, remaining_amount, milestone

# Function to get all user goals
def get_goals(db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Get goals for user
    statement = select(Goal).where(Goal.user_id == user.id)
    goals = db_session.exec(statement).all()

    return goals

# Function to get specific user goal
def get_specific_goal(goal_id: uuid.UUID, db_session, session_token): 
    # Get current user
    user = get_current_user(db_session, session_token)

    # Get goal
    statement = select(Goal).where(Goal.id == goal_id, Goal.user_id == user.id)
    goal = db_session.exec(statement).first()

    if not goal:
        raise GoalDoesNotExist()
    
    return goal

# Function to update a goal
def update_specific_goal(update_data: GoalUpdateRequest, goal_id: uuid.UUID, db_session, session_token):
    # Get goal
    goal = get_specific_goal(goal_id, db_session, session_token)

    # Convert update data to a dict
    update_dict = update_data.model_dump(exclude_unset=True)

    # Update goal attributes
    for key, value in update_dict.items():
        setattr(goal, key, value)

    # Check if we need to re-evaluate the completion status
    if "target_amount" in update_dict:
        # Ensure target_amount isn't zero
        if goal.target_amount > 0:
            goal.is_completed = goal.current_amount >= goal.target_amount

    # Commit updated goal
    db_session.commit()
    db_session.refresh(goal)

    return goal

# Function to delete goal
def delete_goal(goal_id: uuid.UUID, db_session, session_token):
    # Get goal
    goal = get_specific_goal(goal_id, db_session, session_token)

    # Delete goal
    db_session.delete(goal)
    db_session.commit()

    return None