# Base class for all dashboard errors
class DashboardError(Exception):
    def __init__(self, message: str, status_code: int, code: str):
        self.message = message
        self.status_code = status_code
        self.code = code
        super().__init__(self.message)

class SavingsAlreadyInitializedError(DashboardError):
    def __init__(self):
        super().__init__(
            message=f"User savings have already been initialized for this month",
            status_code=400,
            code="SAVINGS_ALREADY_INITIALIZED"
        )
