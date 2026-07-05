from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class StudentBase(BaseModel):
    """学生基础模型"""
    student_no: str
    name: str
    gender: str
    phone: Optional[str] = None
    department: Optional[str] = None
    class_name: Optional[str] = None


class StudentCreate(StudentBase):
    """学生创建模型"""
    pass


class StudentUpdate(BaseModel):
    """学生更新模型"""
    name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    class_name: Optional[str] = None
    status: Optional[str] = None


class StudentResponse(StudentBase):
    """学生响应模型"""
    student_id: int
    dorm_id: Optional[int] = None
    bed_number: Optional[int] = None
    check_in_date: Optional[date] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StudentWithDormitoryResponse(StudentResponse):
    """学生(含宿舍信息)响应模型"""
    building_name: Optional[str] = None
    room_number: Optional[str] = None


class CheckInRequest(BaseModel):
    """入住请求模型"""
    student_id: int
    dorm_id: int
    bed_number: Optional[int] = None


class CheckOutRequest(BaseModel):
    """退宿请求模型"""
    student_id: int