from pydantic import BaseModel
import uuid
from decimal import Decimal

class ExpenseCalculationResponse(BaseModel):
    category_id: uuid.UUID
    category_name: str
    total_spent: Decimal
    budget_limit: Decimal
    remaining_budget: Decimal

class BucketCalculationResponse(BaseModel):
    bucket_id: uuid.UUID
    bucket_name: str
    total_spent: Decimal
    budget_limit: Decimal
    remaining_budget: Decimal