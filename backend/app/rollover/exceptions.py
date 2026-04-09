# Base class for rollover errors
class RolloverError(Exception):
    def __init__(self, message: str, status_code: int, code: str):
        self.message = message
        self.status_code = status_code
        self.code = code
        super().__init__(self.message)

class AmountMustBePositive(RolloverError):
    def __init__(self):
        super().__init__(
            message=f"Amount must be positive",
            status_code=400,
            code="AMOUNT_MUST_BE_POSITIVE"
        )

class InvalidAction(RolloverError):
    def __init__(self):
        super().__init__(
            message=f"Invalid action",
            status_code=400,
            code="INVALID_ACTION"
        )

class GoalIDRequired(RolloverError):
    def __init__(self):
        super().__init__(
            message=f"Goal ID required for sweep",
            status_code=400,
            code="GOAL_ID_REQUIRED"
        )

class FinacialGoalsNotFound(RolloverError):
    def __init__(self):
        super().__init__(
            message=f"Financial Goals category not found.",
            status_code=400,
            code="FINANCIAL_GOALS_NOT_FOUND"
        )

class GoalIDRequired(RolloverError):
    def __init__(self):
        super().__init__(
            message=f"Goal ID required for sweep",
            status_code=400,
            code="GOAL_ID_REQUIRED"
        )

class GoalNotFound(RolloverError):
    def __init__(self):
        super().__init__(
            message=f"Goal not found",
            status_code=400,
            code="GOAL_NOT_FOUND"
        )