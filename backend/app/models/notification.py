import uuid
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional
from enum import Enum

if TYPE_CHECKING:
    from models.user import User

class NotificationType(str, Enum):
    WELCOME = "welcome"
    GOAL_CREATED = "goal_created"
    GOAL_MILESTONE = "goal_milestone"
    GOAL_COMPLETED = "goal_completed"
    BUDGET_SUMMARY = "budget_summary"
    BUDGET_EXCEEDED = "budget_exceeded"

class Notification(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    type: NotificationType
    message: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    is_read: bool = Field(default=False)
    reference_id: Optional[uuid.UUID]
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    user: "User" = Relationship(back_populates='notifications')