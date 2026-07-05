from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RepairBase(BaseModel):
    """报修工单基础模型"""
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = "medium"


class RepairCreate(RepairBase):
    """创建报修工单模型"""
    dorm_id: int


class RepairUpdate(BaseModel):
    """更新报修工单模型"""
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None


class RepairStatusUpdate(BaseModel):
    """更新工单状态模型"""
    status: str
    assigned_to: Optional[int] = None
    feedback: Optional[str] = None


class RepairResponse(RepairBase):
    """报修工单响应模型"""
    repair_id: int
    student_id: int
    dorm_id: int
    status: str
    assigned_to: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    feedback: Optional[str] = None

    class Config:
        from_attributes = True


class RepairWithDetailsResponse(RepairResponse):
    """报修工单（含详细信息）响应模型"""
    student_name: Optional[str] = None
    student_no: Optional[str] = None
    room_number: Optional[str] = None
    building_name: Optional[str] = None