from fastapi import APIRouter, Cookie, Depends
from typing import Annotated, Optional
from app.database import get_session
from sqlmodel import Session
from app.auth.service import get_current_user
from datetime import datetime
from . import exceptions
from . import service

router = APIRouter(prefix="/ai-insights")

# GET route to get AI insights from OpenAI
@router.get("/monthly", status_code=200)
def get_monthly_financial_insight(
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None,
    month: int = None,
    year: int = None
):
    # Get current user
    user = get_current_user(db_session, session_token)

    return {"insight": "AI Financial Insights are coming soon! Keep tracking your expenses to unlock personalized tips."}

    # # Default to current month/year
    # now = datetime.now()
    # target_month = month or now.month
    # target_year = year or now.year

    # try:
    #     insight_text = service.get_and_cache_insight(
    #         db_session=db_session, 
    #         user_id=user.id, 
    #         month=target_month, 
    #         year=target_year
    #     )
    #     return {"insight": insight_text}
    # except Exception as e:
    #     # Log error
    #     print(f"AI Insight Error: {e}")
    #     return {"insight": "AI Financial Insights are coming soon to your dashboard!"}