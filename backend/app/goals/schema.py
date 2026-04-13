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
    @classmethod
    def date_must_be_future(cls, v):
        if v is not None:
            # Check if v has timezone info
            if v.tzinfo is None:
                # If it's naive (from your frontend string), make it UTC aware
                v_to_compare = v.replace(tzinfo=timezone.utc)
            else:
                # If it's already aware, ensure it's converted to UTC for consistency
                v_to_compare = v.astimezone(timezone.utc)
                
            # Now both are 'aware' and can be compared safely
            if v_to_compare <= datetime.now(timezone.utc):
                raise ValueError("Target date must be in the future")
                
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

# Schema for deposit response
class DepositResponse(BaseModel):
    id: uuid.UUID
    current_amount: Decimal
    progress_percentage: Decimal
    remaining_amount: Decimal
    is_completed: bool
    milestone_hit: Optional[int]

# Schema for getting goal
class GoalResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str]
    target_amount: Decimal
    current_amount: Decimal
    progress_percentage: Decimal
    remaining_amount: Decimal
    target_date: datetime
    is_completed: bool

# Schema for updating goal
class GoalUpdateRequest(BaseModel):
    name: Optional[str]
    target_amount: Optional[Decimal]
    target_date: Optional[datetime]
    description: Optional[str]

    # Validate target_date 
    @field_validator('target_date')
    @classmethod
    def date_must_be_future(cls, v):
        if v is not None:
            if v.tzinfo is None:
                v_to_compare = v.replace(tzinfo=timezone.utc)
            else:
                v_to_compare = v.astimezone(timezone.utc)
                
            # 2. Compare aware to aware
            if v_to_compare <= datetime.now(timezone.utc):
                raise ValueError('Target date must be in the future')
                
        return v
