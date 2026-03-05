import uuid
from sqlmodel import SQLModel, Field, Relationship, UniqueConstraint
from typing import TYPE_CHECKING, List
from decimal import Decimal

if TYPE_CHECKING:
    from models.budget_bucket import BudgetBucket
    from models.expense import Expense

# Budget Category model
class BudgetCategory(SQLModel, table=True):
    __tablename__ = 'budget_categories'
    # Define unique constraint for user_id and name
    __table_args__ = (
        UniqueConstraint("bucket_id", "name", name="unique_bucket_category"),
    )
    id: uuid.UUID = Field(default_factory=uuid.uuid4, index=True, primary_key=True)
    name: str = Field(index=True)
    is_default: bool = Field(default=True)
    bucket_id: uuid.UUID = Field(foreign_key="budget_buckets.id")
    bucket: "BudgetBucket" = Relationship(back_populates="categories")
    expenses: List["Expense"] = Relationship(back_populates="category")
    monthly_limit: Decimal