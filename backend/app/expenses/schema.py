from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime
from decimal import Decimal

# Schema for creating expense
class ExpenseCreate(BaseModel):
    title: str
    amount: Decimal
    notes: Optional[str] = None
    category_id: uuid.UUID

# Schema for expense response
class ExpenseResponse(BaseModel):
    id: uuid.UUID
    title: str
    amount: Decimal
    category_id: uuid.UUID
    notes: Optional[str]
    date: datetime

# Schema for expense update
class ExpenseUpdate(BaseModel):
    title: Optional[str]
    amount: Optional[Decimal]
    notes: Optional[str]
    category_id: Optional[uuid.UUID]
    date: Optional[datetime]
