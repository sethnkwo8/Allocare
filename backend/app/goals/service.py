from app.auth.service import get_current_user
from app.models.base import Goal
from .schema import GoalCreateRequest, DepositRequest
from .exceptions import GoalAlreadyCompleted, GoalDoesNotExist, InvalidDepositAmount
from app.auth.exceptions import UnauthorizedError
from sqlmodel import select
import uuid

# Function to create a goal
def create_goal(goal_data:GoalCreateRequest, db_session, session_token):
    # Get current_user
    user = get_current_user(db_session, session_token)

    if not user:
        raise UnauthorizedError()
    
    # Automatic completion check
    is_done = goal_data.current_amount >= goal_data.target_amount
    
    # Create goal
    goal = Goal(
        name=goal_data.name,
        target_amount=goal_data.target_amount,
        current_amount=goal_data.current_amount,
        target_date=goal_data.target_date,
        description=goal_data.description,
        is_completed=is_done,
        user_id=user.id
    )

    db_session.add(goal)
    db_session.commit()
    db_session.refresh(goal)

    # Calculate goal progress
    if goal_data.target_amount > 0:
        raw_progress = (goal.current_amount / goal.target_amount) * 100
        progress = min(raw_progress, 100)
    else:
        progress = 0

    remaining_amount = max(goal.target_amount - goal.current_amount, 0)

    return goal, progress, remaining_amount

# Function to deposit amount for goal
def deposit_for_goal(goal_id: uuid.UUID, deposit_data: DepositRequest, db_session, session_token):
    if deposit_data.amount <= 0:
        raise InvalidDepositAmount()
    
    # Get current user
    user = get_current_user(db_session, session_token)

    if not user:
        raise UnauthorizedError()
    
    # Get specific goal that belongs to user
    statement = select(Goal).where(Goal.id == goal_id, Goal.user_id == user.id)
    goal = db_session.exec(statement).first()

    if not goal:
        raise GoalDoesNotExist()

    # Validate goal
    if goal.is_completed:
        raise GoalAlreadyCompleted()
    
    goal.current_amount += deposit_data.amount
    goal.is_completed = goal.current_amount >= goal.target_amount

    # Recalculate progress
    if goal.target_amount > 0:
        raw_progress = (goal.current_amount / goal.target_amount) * 100
        progress = min(raw_progress, 100)
    else:
        progress = 0

    # Recalculate remaining amount
    remaining_amount = max(goal.target_amount - goal.current_amount, 0)

    db_session.commit()
    db_session.refresh(goal)

    return goal, progress, remaining_amount