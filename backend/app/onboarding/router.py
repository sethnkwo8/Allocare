from fastapi import APIRouter, Depends, Cookie
from app.database import get_session
from . import schema
from . import service
from typing import Annotated, Optional
from sqlmodel import Session

router = APIRouter(prefix="/onboarding")

# POST route for setting currency in onboarding flow
@router.post('/currency', response_model=schema.OnboardingResponse, status_code=201)
def set_currency(
    payload: schema.CurrencyRequest,
    session_token: Annotated[Optional[str], Cookie()] = None,
    db_session: Session = Depends(get_session)
):
    return service.set_user_currency(payload, db_session, session_token)

# POST route for creating income amount and frequency in onboarding flow
@router.post('/income', response_model=schema.OnboardingResponse, status_code=201)
def create_income(
    payload: schema.IncomeRequest,
    session_token: Annotated[Optional[str], Cookie()] = None,
    db_session: Session = Depends(get_session)
):
    return service.create_user_income(payload, db_session, session_token)

# POST route to complete onboarding
@router.post('/complete', response_model=schema.OnboardingResponse, status_code=201)
def complete_onboarding(
    payload: schema.OnboardingRequest,
    session_token: Annotated[Optional[str], Cookie()] = None,
    db_session: Session = Depends(get_session)
):
    service.complete_onboarding(session_token, db_session, payload)

    return {"message": "Onboarding complete"}

# PATCH route to update budgets
@router.patch("/budget-update", status_code=200)
def update_allocations(
    payload: schema.OnboardingRequest,
    session_token: Annotated[Optional[str], Cookie()] = None,
    db_session: Session = Depends(get_session)
):
    return service.update_budget_allocations(session_token=session_token, db_session=db_session, buckets_data=payload)

# GET route to get budget configurations
@router.get("/budget-configuration", response_model=schema.OnboardingRequest)
def get_config(
    session_token: Annotated[Optional[str], Cookie()] = None,
    db_session: Session = Depends(get_session)   
):
    return service.get_bucket_configurations(session_token, db_session)