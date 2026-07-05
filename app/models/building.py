from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.dependencies import Base


class Building(Base):
    """宿舍楼模型"""
    __tablename__ = "building"

    build_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    build_name = Column(String(30), nullable=False, comment="楼栋名称")
    dorm_count = Column(Integer, default=0, comment="房间总数")
    dorm_floor = Column(Integer, default=0, comment="楼层数")
    address = Column(String(100), comment="地址")
    created_at = Column(DateTime, server_default=func.now(), comment="创建时间")
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment="更新时间")

    def __repr__(self):
        return f"<Building(build_id={self.build_id}, build_name='{self.build_name}')>"