from app.models.base import Goal
from app.goals.schema import GoalResponse
from app.utils.calculate_goal_metrics import calculate_goal_metrics

# Seriliaze goal data for response
def serialize_goal(goal: Goal):
    progress, remaining = calculate_goal_metrics(
        goal.target_amount,
        goal.current_amount
    )

    return GoalResponse(
        id=goal.id,
        name=goal.name,
        description=goal.description,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        progress_percentage=round(progress, 1),
        remaining_amount=remaining,
        target_date=goal.target_date,
        is_completed=goal.is_completed
    )