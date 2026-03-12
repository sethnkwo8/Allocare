from fastapi import APIRouter, Cookie, Depends
from .schema import ExpenseCreate, ExpenseResponse, ExpenseUpdate, ExpenseDelete
from typing import Annotated, Optional
from sqlmodel import Session
from app.database import get_session
from . import service
import uuid

router = APIRouter(prefix='/expenses')

# POST route for creating an expense
@router.post('/', response_model=ExpenseResponse, status_code=201)
def create_expense(payload: ExpenseCreate,
                   session_token: Annotated[Optional[str], Cookie()] = None,
                   db_session: Session = Depends(get_session)
):
    expense = service.create_expense(payload, db_session, session_token)
    return ExpenseResponse(id=expense.id, title=expense.title, amount=expense.amount, category_id=expense.category_id, notes=expense.notes, date=expense.date)

# GET route to get all expenses
@router.get("/", response_model=list[ExpenseResponse], status_code=200)
def get_expenses(
    session_token: Annotated[Optional[str], Cookie()] = None,
    db_session: Session = Depends(get_session)
):
    expenses = service.get_expenses(db_session, session_token)

    return [
        ExpenseResponse(
            id=e.id, title=e.title, amount=e.amount, category_id=e.category_id, notes=e.notes, date=e.date
        ) for e in expenses
    ]

# GET route to get specific expense
@router.get("/{expense_id}", response_model=ExpenseResponse, status_code=200)
def get_expense(
    expense_id: uuid.UUID,
    session_token: Annotated[Optional[str], Cookie()] = None,
    db_session: Session = Depends(get_session)
):
    expense = service.get_expense(expense_id=expense_id, db_session=db_session, session_token=session_token )

    return ExpenseResponse(id=expense.id, title=expense.title, amount=expense.amount, category_id=expense.category_id, notes=expense.notes, date=expense.date)

# PATCH route to edit expense details
@router.patch("/{expense_id}", response_model=ExpenseResponse, status_code=200)
def edit_expense(
    payload: ExpenseUpdate,
    expense_id: uuid.UUID,
    session_token: Annotated[Optional[str], Cookie()] = None,
    db_session: Session = Depends(get_session)
):
    expense = service.edit_expense(update_data=payload, expense_id=expense_id, db_session=db_session, session_token=session_token)

    return ExpenseResponse(id=expense.id, title=expense.title, amount=expense.amount, category_id=expense.category_id, notes=expense.notes, date=expense.date)

# DELETE route for deleting expense
@router.delete("/{expense_id}", status_code=204)
def delete_expense(
    expense_id: uuid.UUID,
    session_token: Annotated[Optional[str], Cookie()] = None,
    db_session: Session = Depends(get_session)
):
    service.delete_expense(expense_id, db_session, session_token)