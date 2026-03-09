from fastapi import APIRouter, Depends, Cookie
from sqlmodel import Session
from typing import Annotated, Optional, List
from .schema import ExpenseCalculationResponse, BucketCalculationResponse
from .service import get_category_spending, get_total_buckets_spending
from app.database import get_session

router = APIRouter()

# GET route to get categories spendings
@router.get('/categories/spending', response_model=List[ExpenseCalculationResponse], status_code=200)
def get_categories_spending(
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    results = get_category_spending(db_session, session_token)

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
    results = get_total_buckets_spending(db_session, session_token)

    return [
        BucketCalculationResponse(
            bucket_id=bucket.id,
            bucket_name=bucket.name,
            total_spent=total_spent,
            budget_limit=total_limit,
            remaining_budget=(total_limit - total_spent)
        ) for bucket, total_spent, total_limit in results
    ]

