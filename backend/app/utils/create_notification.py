from app.models.notification import Notification, NotificationType
import uuid
from typing import Optional

# Helper function to create notification
def create_notification(title: str,
                        notification_type: NotificationType,
                        message: str,
                        user_id: uuid.UUID,
                        db_session,
                        reference_id: Optional[uuid.UUID] = None
                        ):
    notification = Notification(
        title=title,
        type=notification_type,
        message=message,
        user_id=user_id,
        reference_id=reference_id
    )

    db_session.add(notification)