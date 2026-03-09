# Calculate goal progress
def calculate_goal_metrics(target_amount, current_amount):
    if target_amount > 0:
        raw_progress = (current_amount / target_amount) * 100
        progress = min(raw_progress, 100)
    else:
        progress = 0

    remaining_amount = max(target_amount - current_amount, 0)

    return progress, remaining_amount