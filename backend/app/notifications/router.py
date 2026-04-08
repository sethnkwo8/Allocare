from fastapi import APIRouter, Depends, Cookie
from typing import Optional, Annotated
from . import schema
from . import service
from sqlmodel import Session
from app.database import get_session
import uuid

router = APIRouter(prefix='/notifications')

# Get route to get paginated notifications
@router.get('/', response_model=schema.NotificationPaginationResponse, status_code=200)
def get_notifications(
    page: int = 1,
    size: int = 10,
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    notifications, total_count, total_pages, unread_count = service.get_paginated_notifications(db_session,
                                                                                                session_token,
                                                                                                page,
                                                                                                size)

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
        unread_count=unread_count,
        total_count=total_count,
        page=page,
        size=size,
        total_pages=total_pages
    )

# PATCH route to mark notification as read
@router.patch('/{notification_id}/read', response_model=schema.NotificationResponse, status_code=200)
def notification_mark(
    notification_id: uuid.UUID,
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    notification = service.mark_notification_as_read(notification_id, db_session, session_token)

    return schema.NotificationResponse(
        id=notification.id,
        title=notification.title,
        type=notification.type,
        message=notification.message,
        is_read=notification.is_read,
        reference_id=notification.reference_id,
        created_at=notification.created_at
    )

# PATCH route to mark all notifications as read
@router.patch('/read-all', response_model=schema.MarkAllResponse, status_code=200)
def mark_all_as_read(
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    message = service.mark_all_notifications_as_read(db_session, session_token)

    return schema.MarkAllResponse(
        message=message["message"]
    )

# DELETE route to delete notification
@router.delete('/{notification_id}', status_code=204)
def delete_notification(
    notification_id: uuid.UUID,
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    service.delete_specific_notification(notification_id, db_session, session_token)

# DELETE route to delete all user notifications
@router.delete('/', status_code=204)
def delete_user_notifications(
    db_session: Session = Depends(get_session),
    session_token: Annotated[Optional[str], Cookie()] = None
):
    service.delete_all_notifications(db_session, session_token)