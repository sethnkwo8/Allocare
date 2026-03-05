import uuid     # For primary keys
from enum import Enum
from typing import TYPE_CHECKING, List
from sqlmodel import Field, SQLModel, Relationship, UniqueConstraint
from datetime import datetime, timezone

if TYPE_CHECKING:
    from models.user import User
    from models.budget_category import BudgetCategory

class AllocationName(str, Enum):
    NEEDS = 'needs'
    WANTS = 'wants'
    SAVINGS = 'savings'



# BudgetBucket model
class BudgetBucket(SQLModel, table=True):
    __tablename__ = 'budget_buckets'
    # Define unique constraint for user_id and name
    __table_args__ = (
        UniqueConstraint("user_id", "name", name="unique_user_allocation"),
    )

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    name: AllocationName = Field(index=True)
    percentage_allocation: int = Field(default=0)
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)}
    )
    categories: List["BudgetCategory"] = Relationship(back_populates="bucket")
    user_id: uuid.UUID = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="budget_buckets")