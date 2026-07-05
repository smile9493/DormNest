from sqlalchemy import Column, Integer, String, Text, Boolean, Enum, DateTime
from sqlalchemy.sql import func
from app.dependencies import Base


class Announcement(Base):
    """公告通知模型"""
    __tablename__ = "announcement"

    announcement_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(100), nullable=False, comment="公告标题")
    content = Column(Text, nullable=False, comment="公告内容")
    category = Column(String(30), comment="公告类型")
    is_top = Column(Boolean, default=False, comment="是否置顶")
    status = Column(
        Enum("draft", "published", "archived", name="announcement_status"),
        default="published",
        comment="公告状态"
    )
    publisher_id = Column(Integer, nullable=False, comment="发布人ID")
    publish_time = Column(DateTime, comment="发布时间")
    expire_time = Column(DateTime, comment="过期时间")
    created_at = Column(DateTime, server_default=func.now(), comment="创建时间")
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment="更新时间")

    def __repr__(self):
        return f"<Announcement(announcement_id={self.announcement_id}, title='{self.title}')>"