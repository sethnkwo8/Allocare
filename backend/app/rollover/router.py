from fastapi import APIRouter, Depends, Cookie
from sqlmodel import Session
from app.rollover.schema import SurplusActionRequest
from app.rollover.service import handle_monthly_rollover, handle_surplus_sweep
from . import exceptions
from app.auth.service import get_current_user
from typing import Annotated, Optional
from app.database import get_session

router = APIRouter(prefix="/rollover", tags=["Rollover"])

@router.post("/settle")
def settle_month_surplus(
    payload: SurplusActionRequest, 
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    # Get current user
    user = get_current_user(db_session, session_token)

    if payload.amount <= 0:
        raise exceptions.AmountMustBePositive()

    if payload.action == "rollover":
        return handle_monthly_rollover(db_session, user.id, payload.amount)
    
    if payload.action == "goal":
        if not payload.goal_id:
            raise exceptions.GoalIDRequired()
        return handle_surplus_sweep(db_session, user.id, payload.goal_id, payload.amount)
    
    raise exceptions.InvalidAction()