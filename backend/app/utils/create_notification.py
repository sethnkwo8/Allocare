from app.models.notification import Notification, NotificationType
import uuid

# Helper function to create notification
def create_notification(notification_type: NotificationType, message: str, user_id: uuid.UUID, db_session):
    notification = Notification(
        type=notification_type,
        message=message,
        user_id=user_id
    )

    db_session.add(notification)