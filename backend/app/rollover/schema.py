from pydantic import BaseModel
from decimal import Decimal
from uuid import UUID
from typing import Optional
from enum import Enum

# Schema for surplus action request
class RolloverAction(str, Enum):
    ROLLOVER = "rollover"
    GOAL = "goal"

class SurplusActionRequest(BaseModel):
    action: RolloverAction
    amount: Decimal
    goal_id: Optional[UUID] = None  # Required only if action is 'goal'

# Schema for rollover response
class RolloverResponse(BaseModel):
    id: UUID
    amount: Decimal
    month: int
    year: int

    class Config:
        from_attributes = True