from fastapi import APIRouter, Depends, Cookie
from sqlmodel import Session
from typing import Annotated, Optional
from .service import create_goal, deposit_for_goal
from .schema import GoalCreateResponse, GoalCreateRequest, DepositRequest, DepositResponse
from app.database import get_session
import uuid

router = APIRouter(prefix='/goals')

# POST route to create a goal
@router.post('/', response_model=GoalCreateResponse, status_code=201)
def goal_creation(
    payload: GoalCreateRequest,
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    goal, progress_percentage, remaining_amount = create_goal(payload, db_session, session_token)

    return GoalCreateResponse(
        id=goal.id,
        name=goal.name,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        progress_percentage=round(progress_percentage, 1),
        remaining_amount=remaining_amount
    )

# POST route gor depositing to goal
@router.post('/{goal_id}/deposit', response_model=DepositResponse, status_code=201)
def goal_deposit(
    goal_id: uuid.UUID,
    payload: DepositRequest,
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    goal, progress, remaining_amount, milestone_hit = deposit_for_goal(goal_id, payload, db_session, session_token)

    return DepositResponse(
        id=goal.id,
        current_amount=goal.current_amount,
        progress_percentage=round(progress, 1),
        remaining_amount=remaining_amount,
        is_completed=goal.is_completed,
        milestone_hit=milestone_hit
    )