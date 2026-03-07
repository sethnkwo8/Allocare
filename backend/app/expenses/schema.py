from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime
from decimal import Decimal

# Schema for creating expense
class ExpenseCreate(BaseModel):
    amount: Decimal
    description: Optional[str]
    category_id: uuid.UUID
    date: Optional[datetime]

# Schema for expense response
class ExpenseResponse(BaseModel):
    id: uuid.UUID
    amount: Decimal
    category_id: uuid.UUID
    description: Optional[str]
    date: datetime

# Schema for expense update
class ExpenseUpdate(BaseModel):
    amount: Optional[Decimal]
    description: Optional[str]
    category_id: Optional[uuid.UUID]
    date: Optional[datetime]
