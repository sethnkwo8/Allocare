import uuid     # For primary keys
from enum import Enum
from typing import TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime, timezone

if TYPE_CHECKING:
    from models.user import User

class Frequency_Status(str, Enum): 
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"

# Income model
class Income(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    amount: float = Field()
    frequency: Frequency_Status = Field(default=Frequency_Status.MONTHLY)
    currency: str = Field(default="NGN")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    user: "User" = Relationship(back_populates="incomes")