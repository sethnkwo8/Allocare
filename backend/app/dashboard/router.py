from fastapi import APIRouter, Depends, Cookie
from . import schema
from . import service
from typing import Annotated, Optional
from sqlmodel import Session
from app.database import get_session
from .serialize_dashboard import serialiaze_dashboard
from app.auth.service import get_current_user

router = APIRouter(prefix='/dashboard')

# GET route to get all dashboard data
@router.get('/', response_model=schema.DashboardResponse, status_code=200)
def dashboard_data(
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    return serialiaze_dashboard(db_session, session_token)

# POST route to initialize savings
@router.post('/initialize-savings', response_model=schema.InitializedSavings, status_code=201)
def initialize_savings(
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    # Get user data
    user = get_current_user(db_session, session_token)

    message = service.initialize_monthly_allocation(db_session, user)

    return schema.InitializedSavings(
        message=message["message"]
    )