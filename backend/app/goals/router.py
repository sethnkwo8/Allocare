from fastapi import APIRouter, Depends, Cookie
from sqlmodel import Session
from typing import Annotated, Optional, List
from . import service
from . import schema
from app.database import get_session
from app.utils.serialize_goal import serialize_goal
import uuid

router = APIRouter(prefix='/goals')

# POST route to create a goal
@router.post('/', response_model=schema.GoalCreateResponse, status_code=201)
def goal_creation(
    payload: schema.GoalCreateRequest,
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    goal, progress_percentage, remaining_amount = service.create_goal(payload, db_session, session_token)

    return schema.GoalCreateResponse(
        id=goal.id,
        name=goal.name,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        progress_percentage=round(progress_percentage, 1),
        remaining_amount=remaining_amount
    )

# POST route for depositing to goal
@router.post('/{goal_id}/deposit', response_model=schema.DepositResponse, status_code=201)
def goal_deposit(
    goal_id: uuid.UUID,
    payload: schema.DepositRequest,
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    goal, progress, remaining_amount, milestone_hit = service.deposit_for_goal(goal_id, payload, db_session, session_token)

    return schema.DepositResponse(
        id=goal.id,
        current_amount=goal.current_amount,
        progress_percentage=round(progress, 1),
        remaining_amount=remaining_amount,
        is_completed=goal.is_completed,
        milestone_hit=milestone_hit
    )

# GET route for getting all user goals
@router.get('/', response_model=List[schema.GoalResponse], status_code=200)
def get_all_goals(
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    goals = service.get_goals(db_session, session_token)

    return [serialize_goal(goal) for goal in goals]

# GET route for getting a goal from user
@router.get('/{goal_id}', response_model=schema.GoalResponse, status_code=200)
def get_goal(
    goal_id: uuid.UUID,
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
): 
    goal = service.get_specific_goal(goal_id, db_session, session_token)

    return serialize_goal(goal)

# PATCH route for updating goal
@router.patch('/{goal_id}', response_model=schema.GoalResponse, status_code=200)
def update_goal(
    goal_id: uuid.UUID,
    payload: schema.GoalUpdateRequest,
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    goal = service.update_specific_goal(payload, goal_id, db_session, session_token)

    return serialize_goal(goal)

# DELETE route to delete goal
@router.delete('/{goal_id}', status_code=204)
def delete_goal(
    goal_id: uuid.UUID,
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    service.delete_goal(goal_id, db_session, session_token)