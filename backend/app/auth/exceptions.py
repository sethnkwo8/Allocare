# Base class for all auth errors
class AuthError(Exception):
    def __init__(self, message: str, status_code: int, code: str):
        self.message = message
        self.status_code = status_code
        self.code = code
        super().__init__(self.message)

class UserAlreadyExistsError(AuthError):
    def __init__(self, email: str):
        super().__init__(
            message=f"User with email {email} already exists",
            status_code=400,
            code="USER_ALREADY_EXISTS"
        )

class InvalidCredentialsError(AuthError):
    def __init__(self):
        super().__init__(
            message="Invalid email or password",
            status_code=401,
            code="INVALID_CREDENTIALS"
        )

class UnauthorizedError(AuthError):
    def __init__(self):
        super().__init__(
            message="Could not validate credentials",
            status_code=401,
            code="UNAUTHORIZED"
        )

class ExpiredResetLinkError(AuthError):
    def __init__(self):
        super().__init__(
            message="Reset link has expired",
            status_code=400,
            code="EXPIRED_RESET_LINK"
        )

class InvalidResetLinkError(AuthError):
    def __init__(self):
        super().__init__(
            message="Invalid reset link",
            status_code=400,
            code="INVALID_RESET_LINK"
        )

class UserNotFoundError(AuthError):
    def __init__(self):
        super().__init__(
            message="User Not Found",
            status_code=400,
            code="USER_NOT_FOUND"
        )

