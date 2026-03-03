import uuid     # For primary keys
from typing import List
from sqlmodel import Field, SQLModel, text, Column, TIMESTAMP, Relationship
from datetime import datetime

# User model
class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    email: str = Field(unique=True,index=True)
    currency: str = Field(default="NGN")
    onboarding: bool = Field(default=False)
    sessions: List["Session"] = Relationship(back_populates="user")
    incomes: List["Income"] = Relationship(back_populates="user")
    expenses: List["Expense"] = Relationship(back_populates="user")
    goals: List["Goal"] = Relationship(back_populates="user")
    allocation: "Allocation" = Relationship(back_populates="user")
    created_at: datetime = Field(
    sa_column=Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
)