from fastapi import APIRouter, Depends, Cookie
from sqlmodel import Session
from typing import Annotated, Optional, List
from .schema import ExpenseCalculationResponse, BucketCalculationResponse, DashboardSummaryResponse
from .service import get_category_spending, get_total_buckets_spending, get_dashboard_summary
from app.database import get_session
from app.auth.service import get_current_user
from app.utils.calculate_spending_percentage import calculate_percentage

router = APIRouter()

# GET route to get categories spendings
@router.get('/categories/spending', response_model=List[ExpenseCalculationResponse], status_code=200)
def get_categories_spending(
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    # Get current user
    user = get_current_user(db_session, session_token)

    results = get_category_spending(db_session, user)

    return [
        ExpenseCalculationResponse(
            category_id=category.id,
            category_name=category.name,
            total_spent=total,
            budget_limit=category.monthly_limit,
            remaining_budget=(category.monthly_limit - total)
        ) for category, total in results
    ]

# GET route to get buckets spendings
@router.get('/buckets/spending', response_model=List[BucketCalculationResponse], status_code=200)
def get_buckets_spending(
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    # Get current user
    user = get_current_user(db_session, session_token)

    results = get_total_buckets_spending(db_session, user)

    return [
        BucketCalculationResponse(
            bucket_id=bucket.id,
            bucket_name=bucket.name,
            total_spent=total_spent,
            budget_limit=total_limit,
            remaining_budget=(total_limit - total_spent),
            spending_percentage=calculate_percentage(total_spent, total_limit)
        ) for bucket, total_spent, total_limit in results
    ]

# GET route to get dashboard summary
@router.get('/dashboard/summary', response_model=DashboardSummaryResponse, status_code=200)
def get_dashboard(
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    spent, budget, remaining, over_budget_categories = get_dashboard_summary(db_session, session_token)

    return DashboardSummaryResponse(
        total_spent=spent,
        total_budget=budget,
        remaining_budget=remaining,
        categories_over_budget= over_budget_categories
    )

