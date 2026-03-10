from decimal import Decimal

# Helper function to check if milestone is reached
def check_goal_milestone(old_current: Decimal, new_current: Decimal, target: Decimal):
    if target <= 0:
        return None
    
    # List of milestones
    milestones = [25, 50, 75, 100]

    # Calculate old progress percentage
    old_percent = min((old_current / target) * 100, 100)

    # Calculate new progress percentage
    new_percent = min((new_current / target) * 100, 100)

    # Find the highest milestone crossed
    achieved = [m for m in milestones if old_percent < m <= new_percent]

    # Return highest milestone achieved
    return achieved[-1] if achieved else None
