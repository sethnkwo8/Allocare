from app.auth.service import get_current_user
from app.models.notification import Notification
from sqlmodel import select, func, desc, update, delete
import math
from . import exceptions

# Function to get count of all unread notifications
def get_user_and_unread_count(session_token, db_session):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Get total unread count
    statement = select(func.count()).select_from(Notification).where(
        Notification.user_id == user.id, Notification.is_read.is_(False))
    unread_count = db_session.exec(statement).one()

    return user, unread_count

# Function to get all user notifications
def get_paginated_notifications(db_session, session_token, page: int, size: int):
    # Get current user and user
    user, unread_count = get_user_and_unread_count(session_token, db_session)

    # Validate page and size
    page = max(1, page)

    size = max(1, min(50, size))

    # Get total_count
    count_statement = select(func.count()).select_from(Notification).where(Notification.user_id == user.id)
    total_count = db_session.exec(count_statement).one()

    # Calculate total pages
    total_pages = math.ceil(total_count / size) if size else 1

    # Get data slice
    skip = (page - 1) * size
    statement = select(Notification).where(Notification.user_id == user.id).order_by(desc(Notification.created_at)).offset(
        skip
    ).limit(size)

    notifications = db_session.exec(statement).all()

    return notifications, total_count, total_pages, unread_count

# Function to mark notification as read
def mark_notification_as_read(notification_id, db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Get notification
    statement = select(Notification).where(Notification.user_id == user.id, Notification.id == notification_id)
    notification = db_session.exec(statement).first()

    if not notification:
        raise exceptions.NotificationDoesntExist()
    
    if notification.is_read:
        return notification

    # Mark as read
    notification.is_read = True

    db_session.commit()
    db_session.refresh(notification)

    return notification

# Function to mark all notifications as read
def mark_all_notifications_as_read(db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Update notifications
    statement = (
        update(Notification)
        .where(Notification.user_id == user.id)
        .where(Notification.is_read == False)
        .values(is_read=True)
    )

    db_session.exec(statement)
    db_session.commit()

    return {"message": "All notifications marked as read"}

# Fuction to delete specific notification
def delete_specific_notification(notification_id, db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Get specific notification
    statement = select(Notification).where(
        Notification.id == notification_id,
        Notification.user_id == user.id
    )

    notification = db_session.exec(statement).first()

    if not notification:
        raise exceptions.NotificationDoesntExist()

    db_session.delete(notification)
    db_session.commit()

# Function to delete all user notifications
def delete_all_notifications(db_session, session_token):
    # Get current user
    user = get_current_user(db_session, session_token)

    statement = delete(Notification).where(Notification.user_id == user.id)

    db_session.exec(statement)
    db_session.commit()