from fastapi import APIRouter, Depends, Cookie
from app.database import get_session
from . import schema
from . import service
from typing import Annotated, Optional
from sqlmodel import Session

router = APIRouter(prefix="/onboarding")

@router.post('/currency', response_model=schema.OnboardingResponse, status_code=201)
def set_currency(
    payload: schema.CurrencyRequest,
    session_token: Annotated[Optional[str], Cookie()] = None,
    db_session: Session = Depends(get_session)
):
    return service.set_user_currency(payload, db_session, session_token)