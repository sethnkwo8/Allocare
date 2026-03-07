from fastapi import APIRouter, Cookie, Depends
from .schema import ExpenseCreate, ExpenseResponse
from typing import Annotated, Optional
from sqlmodel import Session
from app.database import get_session
from . import service

router = APIRouter(prefix='/expenses')

# POST route for creating an expense
@router.post('/', response_model=ExpenseResponse, status_code=201)
def create_expense(payload: ExpenseCreate,
                   session_token: Annotated[Optional[str], Cookie()] = None,
                   db_session: Session = Depends(get_session)
):
    expense = service.create_expense(payload, db_session, session_token)
    return ExpenseResponse(id=expense.id, amount=expense.amount, category_id=expense.category_id, description=expense.description, date=expense.date)