from app.auth.service import get_current_user
from app.models.notification import Notification
from sqlmodel import select, func, desc
import math

# Function to get all user notifications
def get_paginated_notifications(db_session, session_token, page: int, size: int):
    # Get current user
    user = get_current_user(db_session, session_token)

    # Validate page and size
    if page < 1:
        page = 1

    if size > 50:
        size = 50

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

    return notifications, total_count, total_pages