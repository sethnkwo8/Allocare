# Base class for expense errors
class ExpenseError(Exception):
    def __init__(self, message: str, status_code: int, code: str):
        self.message = message
        self.status_code = status_code
        self.code = code
        super().__init__(self.message)

class CategoryDoesntExist(ExpenseError):
    def __init__(self):
        super().__init__(
            message=f"Category does not exist",
            status_code=400,
            code="CATEGORY_DOES_NOT_EXIST"
        )

class CategoryUserMismatch(ExpenseError):
    def __init__(self):
        super().__init__(
            message=f"Category does not belong to user",
            status_code=400,
            code="CATEGORY_USER_MISMATCH"
        )

class AmountError(ExpenseError):
    def __init__(self):
        super().__init__(
            message=f"Amount has to be more than 0",
            status_code=400,
            code="AMOUNT_ERROR"
        )

class ExpenseNotFound(ExpenseError):
    def __init__(self):
        super().__init__(
            message=f"Expense not found",
            status_code=400,
            code="EXPENSE_USER_MISMATCH"
        )