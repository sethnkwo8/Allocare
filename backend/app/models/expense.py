import uuid     # For primary keys
from typing import TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime, timezone
from decimal import Decimal

if TYPE_CHECKING:
    from models.user import User


# Expense model
class Expense(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    amount: Decimal = Field()
    category: str = Field(index=True)
    description: str = Field()
    spent_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    user: "User" = Relationship(back_populates="expenses")