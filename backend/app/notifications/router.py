from fastapi import APIRouter, Depends, Cookie
from typing import Optional, Annotated
from . import schema
from . import service
from sqlmodel import Session
from app.database import get_session

router = APIRouter(prefix='/notifications')

# Get route to get paginated notifications
@router.get('/', response_model=schema.NotificationPaginationResponse, status_code=200)
def get_notifications(
    page: int = 1,
    size: int = 10,
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    notifications, total_count, total_pages = service.get_paginated_notifications(db_session, session_token, page, size)

    return schema.NotificationPaginationResponse(
        items=[
            schema.NotificationResponse(
                id=n.id,
                title=n.title,
                type=n.type,
                message=n.message,
                is_read=n.is_read,
                reference_id=n.reference_id,
                created_at=n.created_at
            ) for n in notifications
        ],
        total_count=total_count,
        page=page,
        size=size,
        total_pages=total_pages
    )