from pydantic import BaseModel
import uuid
from decimal import Decimal
from typing import Optional, List

class ExpenseCalculationResponse(BaseModel):
    category_id: uuid.UUID
    category_name: str
    category_percentage: Decimal
    total_spent: Decimal
    budget_limit: Decimal
    remaining_budget: Decimal

class BucketCalculationResponse(BaseModel):
    bucket_id: uuid.UUID
    bucket_name: str
    total_spent: Decimal
    budget_limit: Decimal
    remaining_budget: Decimal
    spending_percentage: int

class OverBudgetCategory(BaseModel):
    name: str
    overage: Decimal

class DashboardSummaryResponse(BaseModel):
    total_spent: Decimal
    total_budget: Decimal
    remaining_budget: Decimal
    categories_over_budget: Optional[List[OverBudgetCategory]]
