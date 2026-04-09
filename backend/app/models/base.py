from sqlmodel import SQLModel

# Import all models for Alembic use
from app.models.budget_bucket import BudgetBucket
from app.models.budget_category import BudgetCategory
from app.models.expense import Expense
from app.models.goal import Goal
from app.models.income import Income
from app.models.session import Session
from app.models.user import User
from app.models.notification import Notification
from app.models.rollover import Rollover

# Export metadata
target_metadata = SQLModel.metadata