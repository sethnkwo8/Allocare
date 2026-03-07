from .schema import ExpenseCreate, ExpenseUpdate
from app.models.base import Expense, BudgetCategory, BudgetBucket, User
from app.auth.service import get_current_user
from app.auth.exceptions import UnauthorizedError
from .exceptions import CategoryDoesntExist, AmountError, ExpenseNotFound
from sqlmodel import select

# Function for creating an expense
def create_expense(expense_data: ExpenseCreate, db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    if not user:
        raise UnauthorizedError()
    
    # Get category and check if it belongs to user by
    result = db_session.exec(select(BudgetCategory).join(BudgetBucket).where(BudgetCategory.id == expense_data.category_id, BudgetBucket.user_id == user.id))
    category = result.first()

    if not category:
        raise CategoryDoesntExist()
    
    # Check if amount is more than 0
    if not expense_data.amount > 0:
        raise AmountError()
    
    expense = Expense(amount=expense_data.amount,
                      category_id=expense_data.category_id,
                      description=expense_data.description,
                      user_id=user.id,
                      date=expense_data.date
                      )
    
    db_session.add(expense)
    db_session.commit()
    db_session.refresh(expense)

    return expense

# Function to get all user expenses
def get_expenses(db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    if not user:
        raise UnauthorizedError()
    
    # Get all expenses for user
    result = db_session.exec(select(Expense).where(Expense.user_id == user.id))
    # Return all results
    return result.all()

# Function to get specific expense
def get_expense(expense_id, db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    if not user:
        raise UnauthorizedError()
    
    # Get specific expense
    result = db_session.exec(select(Expense).where(Expense.id == expense_id, Expense.user_id == user.id))
    expense = result.first()

    # Validate expense belongs to user
    if not expense:
        raise ExpenseNotFound()
    
    return expense

# Function to edit expense
def edit_expense(update_data: ExpenseUpdate, expense_id, db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    if not user:
        raise UnauthorizedError()
    
    # Get specific expense
    expense_result = db_session.exec(select(Expense).where(Expense.id == expense_id, Expense.user_id == user.id))
    expense = expense_result.first()

    # Validate expense belongs to user
    if not expense:
        raise ExpenseNotFound()
    
    # Get category and check if it belongs to user by
    if update_data.category_id:
        category_result = db_session.exec(select(BudgetCategory).join(BudgetBucket).where(BudgetCategory.id == update_data.category_id, BudgetBucket.user_id == user.id))
        category = category_result.first()

        if not category:
            raise CategoryDoesntExist()
    
    # Validate data
    if update_data.amount is not None:
        if update_data.amount <= 0:
            raise AmountError()

    
    # Convert update data to a dict
    update_dict = update_data.model_dump(exclude_unset=True)

    # Update the existing expense object attributes
    for key, value in update_dict.items():
        setattr(expense, key, value)

    # Commit new expense
    db_session.commit()
    db_session.refresh(expense)

    return expense

# Function to delete expense
def delete_expense(expense_id, db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    if not user:
        raise UnauthorizedError()
    
    # Get specific expense
    expense_result = db_session.exec(select(Expense).where(Expense.id == expense_id, Expense.user_id == user.id))
    expense = expense_result.first()

    # Validate expense belongs to user
    if not expense:
        raise ExpenseNotFound()
    
    db_session.delete(expense)
    db_session.commit()

    return None
