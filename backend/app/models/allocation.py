import uuid     # For primary keys
from typing import TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime, timezone

if TYPE_CHECKING:
    from models.user import User

# Allocation model
class Allocation(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    needs_percent: int = Field(default=0)
    wants_percent: int = Field(default=0)
    savings_percent: int = Field(default=0)
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)}
    )
    user_id: uuid.UUID = Field(foreign_key="user.id", unique=True)
    user: "User" = Relationship(back_populates="allocation")