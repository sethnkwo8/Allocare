from sqlmodel import SQLModel, Field, Relationship
import uuid
from decimal import Decimal
from typing import Optional, TYPE_CHECKING
from datetime import datetime, timezone

if TYPE_CHECKING:
    from models.user import User

# Rollover model
class Rollover(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    amount: Decimal = Field(default=0, max_digits=15, decimal_places=2)
    month: int = Field(description="The month this rollover applies to (1-12)")
    year: int = Field(description="The year this rollover applies to")
    source_month: Optional[int] = None
    source_year: Optional[int] = None
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    user: "User" = Relationship(back_populates="rollovers")