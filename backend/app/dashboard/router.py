from fastapi import APIRouter, Depends, Cookie
from . import schema
from . import service
from typing import Annotated, Optional
from sqlmodel import Session
from app.database import get_session
from .serialize_dashboard import serialiaze_dashboard

router = APIRouter(prefix='/dashboard')

# GET route to get all dashboard data
@router.get('/', response_model=schema.DashboardResponse, status_code=200)
def dashboard_data(
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    return serialiaze_dashboard(db_session, session_token)