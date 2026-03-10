from fastapi import APIRouter, Depends, Cookie
from sqlmodel import Session
from typing import Annotated, Optional, List
from .service import create_goal, deposit_for_goal, get_goals, get_specific_goal
from .schema import GoalCreateResponse, GoalCreateRequest, DepositRequest, DepositResponse, GoalResponse
from app.database import get_session
from app.utils.serialize_goal import serialize_goal
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

# GET route for getting all user goals
@router.get('/', response_model=List[GoalResponse], status_code=200)
def get_all_goals(
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    goals = get_goals(db_session, session_token)

    return [serialize_goal(goal) for goal in goals]

# GET route for getting a goal from user
@router.get('/{goal_id}', response_model=GoalResponse, status_code=200)
def get_goal(
    goal_id: uuid.UUID,
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
): 
    goal = get_specific_goal(goal_id, db_session, session_token)

    return serialize_goal(goal)