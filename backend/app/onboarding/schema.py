# Onboarding schemas
from pydantic import BaseModel, Field
from decimal import Decimal
from typing import List, Optional
from enum import Enum

# Schema for getting currency
class CurrencyRequest(BaseModel):
    currency: str = Field(min_length=3, max_length=3)

# Schema for getting income
class FrequencyStatus(str, Enum): 
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"

class IncomeRequest(BaseModel):
    amount: float
    frequency: FrequencyStatus

# Schema for Category
class CategoryCreate(BaseModel):
    name: str
    monthly_limit: Optional[Decimal] = Field(ge=0)

# Schema for budget bucket
class AllocationName(str, Enum):
    NEEDS = 'needs'
    WANTS = 'wants'
    SAVINGS = 'savings'

class BucketCreate(BaseModel):
    name: AllocationName
    percentage_allocation: int = Field(ge=0, le=100)
    categories: List[CategoryCreate] = []

# Schema for accepting buckets (needs, wants, savings)
class OnboardingRequest(BaseModel):
    buckets: List[BucketCreate]

# Response after onboarding completion
class OnboardingResponse(BaseModel):
    message: str