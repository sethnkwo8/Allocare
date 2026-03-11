# Base class for expense errors
class NotificationError(Exception):
    def __init__(self, message: str, status_code: int, code: str):
        self.message = message
        self.status_code = status_code
        self.code = code
        super().__init__(self.message)

class NotificationDoesntExist(NotificationError):
    def __init__(self):
        super().__init__(
            message=f"Notification does not exist",
            status_code=400,
            code="NOTIFICATION_DOES_NOT_EXIST"
        )