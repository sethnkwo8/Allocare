# Base class for all insights errors
class InsightError(Exception):
    def __init__(self, message: str, status_code: int, code: str):
        self.message = message
        self.status_code = status_code
        self.code = code
        super().__init__(self.message)

class InsightGenerationError(InsightError):
    def __init__(self):
        super().__init__(
            message=f"Could not generate financial insight.",
            status_code=500,
            code="INSIGHT_GENERATION_ERROR"
        )