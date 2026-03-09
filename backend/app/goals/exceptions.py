# Base class for goal errors
class GoalError(Exception):
    def __init__(self, message: str, status_code: int, code: str):
        self.message = message
        self.status_code = status_code
        self.code = code
        super().__init__(self.message)

class GoalAlreadyCompleted(GoalError):
    def __init__(self):
        super().__init__(
            message=f"Goal has already been completed",
            status_code=400,
            code="GOAL_ALREADY_COMPLETED"
        )