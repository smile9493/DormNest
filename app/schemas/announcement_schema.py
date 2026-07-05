from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AnnouncementBase(BaseModel):
    """公告通知基础模型"""
    title: str
    content: str
    category: Optional[str] = None
    is_top: Optional[bool] = False


class AnnouncementCreate(AnnouncementBase):
    """创建公告通知模型"""
    pass


class AnnouncementUpdate(BaseModel):
    """更新公告通知模型"""
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    is_top: Optional[bool] = None
    status: Optional[str] = None


class AnnouncementResponse(AnnouncementBase):
    """公告通知响应模型"""
    announcement_id: int
    status: str
    publisher_id: int
    publish_time: Optional[datetime] = None
    expire_time: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True