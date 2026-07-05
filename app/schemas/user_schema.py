from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime


class UserBase(BaseModel):
    """用户基础模型"""
    username: str
    role: Literal["admin", "student", "repairman"]
    real_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class UserCreate(UserBase):
    """用户创建模型"""
    password: str = Field(..., min_length=6)
    student_id: Optional[int] = None


class UserUpdate(BaseModel):
    """用户更新模型"""
    real_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    """用户响应模型"""
    user_id: int
    student_id: Optional[int] = None
    is_active: bool
    last_login: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True