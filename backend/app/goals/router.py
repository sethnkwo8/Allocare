from fastapi import APIRouter, Depends, Cookie
from sqlmodel import Session
from typing import Annotated, Optional
from .service import create_goal
from .schema import GoalCreateResponse, GoalCreateRequest
from app.database import get_session

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