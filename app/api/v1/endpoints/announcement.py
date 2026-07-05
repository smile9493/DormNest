from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.dependencies import get_db
from app.models.announcement import Announcement
from app.models.user import User
from app.schemas.announcement_schema import AnnouncementResponse
from app.utils.auth import get_current_active_user

router = APIRouter()


@router.get("/", response_model=List[AnnouncementResponse])
def get_announcements(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取公告列表"""
    query = db.query(Announcement).filter(Announcement.status == "published")

    # 如果指定了分类，进行筛选
    if category:
        query = query.filter(Announcement.category == category)

    # 获取未过期的公告（expire_time为空或者大于当前时间）
    query = query.filter(
        (Announcement.expire_time.is_(None)) | (Announcement.expire_time > datetime.now())
    )

    # 按置顶和发布时间排序
    announcements = query.order_by(
        Announcement.is_top.desc(),
        Announcement.publish_time.desc()
    ).offset(skip).limit(limit).all()

    return announcements