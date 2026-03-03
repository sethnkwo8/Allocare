import uuid     # For primary keys
from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import DateTime
from datetime import datetime, timedelta, timezone
from models.user import User

def get_expiration():
    return datetime.now(timezone.utc) + timedelta(days=7)

# Session model
class Session(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    token: str = Field(unique=True, index=True)
    expires_at: datetime = Field(sa_type=DateTime(timezone=True), # Ensures DB stores TZ info
        default_factory=get_expiration)
    user_id: uuid.UUID = Field(default=False, foreign_key="user.id")
    user: User = Relationship(back_populates="sessions")