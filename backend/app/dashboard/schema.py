from pydantic import BaseModel
import uuid
from datetime import datetime
from app.models.budget_bucket import AllocationName
from typing import List
from decimal import Decimal
from app.analytics.schema import ExpenseCalculationResponse, BucketCalculationResponse

class FinancialOverview(BaseModel):
    total_income: float
    total_spent: float
    remaining_balance: float
    currency_code: str

class RecentExpense(BaseModel):
    id: uuid.UUID
    title: str
    amount: float
    created_at: datetime

class UnreadCount(BaseModel):
    unread_count: int

class BudgetAllocation(BaseModel):
    budget_name: AllocationName
    percentage_allocation: int

class SavingsGoal(BaseModel):
    name: str
    target_amount: Decimal
    current_amount: Decimal
    progress_percentage: int
    remaining_amount: Decimal

class DashboardResponse(BaseModel):
    financial_overview: FinancialOverview
    budget_percentage_allocation: List[BudgetAllocation]
    recent_expenses: List[RecentExpense]
    goal_savings: List[SavingsGoal]
    category_spendings: List[ExpenseCalculationResponse]
    bucket_spendings: List[BucketCalculationResponse]
    unread_count: UnreadCount
