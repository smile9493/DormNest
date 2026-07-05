from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BuildingBase(BaseModel):
    """宿舍楼基础模型"""
    build_name: str
    dorm_count: Optional[int] = 0
    dorm_floor: Optional[int] = 0
    address: Optional[str] = None


class BuildingCreate(BuildingBase):
    """宿舍楼创建模型"""
    pass


class BuildingUpdate(BaseModel):
    """宿舍楼更新模型"""
    build_name: Optional[str] = None
    dorm_count: Optional[int] = None
    dorm_floor: Optional[int] = None
    address: Optional[str] = None


class BuildingResponse(BuildingBase):
    """宿舍楼响应模型"""
    build_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True