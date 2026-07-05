from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from decimal import Decimal


class ChargeBase(BaseModel):
    """费用账单基础模型"""
    charge_type: str
    amount: Decimal
    charge_date: date
    due_date: Optional[date] = None
    memo: Optional[str] = None


class ChargeCreate(ChargeBase):
    """创建费用账单模型"""
    student_id: int


class ChargeResponse(ChargeBase):
    """费用账单响应模型"""
    charge_id: int
    student_id: int
    pay_status: str
    pay_date: Optional[datetime] = None
    pay_method: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChargeWithStudentResponse(ChargeResponse):
    """费用账单（含学生信息）响应模型"""
    student_name: Optional[str] = None
    student_no: Optional[str] = None


class ChargePayRequest(BaseModel):
    """缴费请求模型"""
    pay_method: Optional[str] = None