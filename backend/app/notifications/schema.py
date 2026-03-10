from pydantic import BaseModel
import uuid
from app.models.notification import NotificationType
from typing import Optional, List
from datetime import datetime

class NotificationResponse(BaseModel):
    id: uuid.UUID
    title: str
    type: NotificationType
    message: str
    is_read: bool
    reference_id: Optional[uuid.UUID]
    created_at: datetime

class NotificationPaginationResponse(BaseModel):
    items: List[NotificationResponse]
    total_count: int
    page: int
    size: int
    total_pages: int