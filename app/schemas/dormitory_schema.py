from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class DormitoryBase(BaseModel):
    """宿舍房间基础模型"""
    build_id: int
    room_number: str
    floor: Optional[int] = None
    bed_count: Optional[int] = 4
    status: Optional[str] = "available"
    price: Optional[Decimal] = None


class DormitoryCreate(DormitoryBase):
    """宿舍房间创建模型"""
    pass


class DormitoryUpdate(BaseModel):
    """宿舍房间更新模型"""
    room_number: Optional[str] = None
    floor: Optional[int] = None
    bed_count: Optional[int] = None
    status: Optional[str] = None
    price: Optional[Decimal] = None


class DormitoryResponse(DormitoryBase):
    """宿舍房间响应模型"""
    dorm_id: int
    occupied_beds: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DormitoryWithBuildingResponse(DormitoryResponse):
    """宿舍房间(含楼栋信息)响应模型"""
    building_name: Optional[str] = None
    available_beds: int
    occupancy_rate: float