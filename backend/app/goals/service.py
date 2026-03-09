from app.auth.service import get_current_user
from app.models.base import Goal
from .schema import GoalCreateRequest
from app.auth.exceptions import UnauthorizedError

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