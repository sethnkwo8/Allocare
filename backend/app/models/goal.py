import uuid     # For primary keys
from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime, timezone
from decimal import Decimal

if TYPE_CHECKING:
    from models.user import User

# Goal model
class Goal(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    name: str = Field(index=True) # laptop, ps5, phone, equipment
    target_amount: Decimal = Field(decimal_places=2, max_digits=10)
    current_amount: Decimal = Field(decimal_places=2, max_digits=10, default=Decimal("0.00"))
    target_date: Optional[datetime]
    description: Optional[str]
    is_completed: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    user: "User" = Relationship(back_populates="goals")