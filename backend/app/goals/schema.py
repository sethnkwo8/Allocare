from pydantic import BaseModel, Field, field_validator
import uuid
from datetime import datetime, timezone
from typing import Optional
from decimal import Decimal

# Schema request for goal
class GoalCreateRequest(BaseModel):
    name: str
    target_amount: Decimal
    current_amount: Decimal = Decimal("0.00")
    target_date: Optional[datetime] = None
    description: Optional[str] = None

    # Validate target_date 
    @field_validator('target_date')
    def date_must_be_future(cls, v):
        if v is not None and v <= datetime.now(timezone.utc):
            raise ValueError('Target date must be in the future')
        return v

# Schema response for goal
class GoalCreateResponse(BaseModel):
    id: uuid.UUID
    name: str
    target_amount: Decimal
    current_amount: Decimal
    progress_percentage: Decimal
    remaining_amount: Decimal

# Schema for deposit request
class DepositRequest(BaseModel):
    amount: Decimal = Field(gt=0)

class DepositResponse(BaseModel):
    id: uuid.UUID
    current_amount: Decimal
    progress_percentage: Decimal
    remaining_amount: Decimal
    is_completed: bool