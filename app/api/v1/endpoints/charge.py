from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from app.dependencies import get_db
from app.models.charge import Charge
from app.models.student import Student
from app.models.user import User
from app.schemas.charge_schema import (
    ChargeResponse,
    ChargeWithStudentResponse,
    ChargePayRequest
)
from app.utils.auth import require_role, get_current_active_user

router = APIRouter()


@router.get("/me", response_model=List[ChargeResponse])
def get_my_charges(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取当前用户的费用账单"""
    # 根据用户角色返回不同的费用数据
    if current_user.role == "student":
        # 学生只能查看自己的费用
        student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
        if student:
            charges = db.query(Charge).filter(
                Charge.student_id == student.student_id
            ).order_by(Charge.charge_date.desc()).offset(skip).limit(limit).all()
        else:
            charges = []
    else:
        # 管理员和维修员可以查看所有费用
        charges = db.query(Charge).order_by(Charge.charge_date.desc()).offset(skip).limit(limit).all()

    return charges


@router.get("/student/{student_id}", response_model=List[ChargeWithStudentResponse])
def get_student_charges(
    student_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """获取指定学生的费用（管理员）"""
    # 检查学生是否存在
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="学生不存在")

    # 查询学生的费用账单
    charges = db.query(
        Charge.charge_id,
        Charge.student_id,
        Charge.charge_type,
        Charge.amount,
        Charge.charge_date,
        Charge.due_date,
        Charge.pay_status,
        Charge.pay_date,
        Charge.pay_method,
        Charge.memo,
        Charge.created_at,
        Charge.updated_at,
        Student.name.label("student_name"),
        Student.student_no.label("student_no")
    ).join(Student, Charge.student_id == Student.student_id).filter(
        Charge.student_id == student_id
    ).order_by(Charge.charge_date.desc()).offset(skip).limit(limit).all()

    return charges


@router.post("/pay/{charge_id}", response_model=ChargeResponse)
def pay_charge(
    charge_id: int,
    pay_request: ChargePayRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """标记缴费"""
    # 查找费用账单
    db_charge = db.query(Charge).filter(Charge.charge_id == charge_id).first()
    if not db_charge:
        raise HTTPException(status_code=404, detail="费用账单不存在")

    # 检查是否已缴费
    if db_charge.pay_status == "paid":
        raise HTTPException(status_code=400, detail="该费用已缴费")

    # 更新缴费状态
    db_charge.pay_status = "paid"
    db_charge.pay_date = datetime.now(timezone.utc)
    if pay_request.pay_method:
        db_charge.pay_method = pay_request.pay_method

    db.commit()
    db.refresh(db_charge)
    return db_charge