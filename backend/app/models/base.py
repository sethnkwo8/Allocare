from sqlmodel import SQLModel

# Import all models for Alembic use
from app.models.budget_bucket import BudgetBucket
from app.models.budget_category import BudgetCategory
from app.models.expense import Expense
from app.models.goal import Goal
from app.models.income import Income
from app.models.session import Session
from app.models.user import User

# Export metadata
target_metadata = SQLModel.metadata