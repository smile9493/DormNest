from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.dependencies import get_db
from app.models.repair import Repair
from app.models.student import Student
from app.models.dormitory import Dormitory
from app.models.building import Building
from app.models.user import User
from app.schemas.repair_schema import (
    RepairCreate,
    RepairResponse,
    RepairWithDetailsResponse,
    RepairStatusUpdate
)
from app.utils.auth import require_role, get_current_active_user

# 合法的工单状态转换映射
VALID_STATUS_TRANSITIONS = {
    "pending": {"assigned", "cancelled"},
    "assigned": {"processing", "cancelled"},
    "processing": {"completed", "cancelled"},
    "completed": set(),  # 已完成不可再变更
    "cancelled": set(),  # 已取消不可再变更
}

router = APIRouter()


@router.get("/", response_model=List[RepairWithDetailsResponse])
def get_repairs(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取工单列表（支持状态筛选）"""
    # 学生只能查看自己的工单
    if current_user.role == "student":
        query = db.query(
            Repair.repair_id,
            Repair.student_id,
            Repair.dorm_id,
            Repair.title,
            Repair.description,
            Repair.category,
            Repair.status,
            Repair.priority,
            Repair.assigned_to,
            Repair.created_at,
            Repair.updated_at,
            Repair.completed_at,
            Repair.feedback,
            Student.name.label("student_name"),
            Student.student_no.label("student_no"),
            Dormitory.room_number.label("room_number"),
            Building.build_name.label("building_name")
        ).join(Student, Repair.student_id == Student.student_id).join(
            Dormitory, Repair.dorm_id == Dormitory.dorm_id
        ).join(Building, Dormitory.build_id == Building.build_id).filter(
            Repair.student_id == current_user.student_id
        )
    else:
        # 管理员和维修员可以查看所有工单
        query = db.query(
            Repair.repair_id,
            Repair.student_id,
            Repair.dorm_id,
            Repair.title,
            Repair.description,
            Repair.category,
            Repair.status,
            Repair.priority,
            Repair.assigned_to,
            Repair.created_at,
            Repair.updated_at,
            Repair.completed_at,
            Repair.feedback,
            Student.name.label("student_name"),
            Student.student_no.label("student_no"),
            Dormitory.room_number.label("room_number"),
            Building.build_name.label("building_name")
        ).join(Student, Repair.student_id == Student.student_id).join(
            Dormitory, Repair.dorm_id == Dormitory.dorm_id
        ).join(Building, Dormitory.build_id == Building.build_id)

    if status:
        query = query.filter(Repair.status == status)

    repairs = query.order_by(Repair.created_at.desc()).offset(skip).limit(limit).all()
    return repairs


@router.post("/", response_model=RepairResponse)
def create_repair(
    repair: RepairCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["student"]))
):
    """创建新工单（学生提交）"""
    # 检查学生是否存在
    student = db.query(Student).filter(Student.student_id == current_user.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="学生信息不存在")

    # 校验学生已分配宿舍
    if not student.dorm_id:
        raise HTTPException(status_code=400, detail="您尚未分配宿舍，无法提交报修")

    # 校验报修宿舍必须是学生自己居住的宿舍
    if repair.dorm_id != student.dorm_id:
        raise HTTPException(status_code=400, detail="只能为自己居住的宿舍提交报修")

    # 检查宿舍是否存在
    dormitory = db.query(Dormitory).filter(Dormitory.dorm_id == repair.dorm_id).first()
    if not dormitory:
        raise HTTPException(status_code=404, detail="宿舍不存在")

    # 创建工单
    db_repair = Repair(
        student_id=current_user.student_id,
        dorm_id=repair.dorm_id,
        title=repair.title,
        description=repair.description,
        category=repair.category,
        priority=repair.priority,
        status="pending"
    )
    db.add(db_repair)
    db.commit()
    db.refresh(db_repair)
    return db_repair


@router.get("/{repair_id}", response_model=RepairWithDetailsResponse)
def get_repair(
    repair_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取工单详情"""
    query = db.query(
        Repair.repair_id,
        Repair.student_id,
        Repair.dorm_id,
        Repair.title,
        Repair.description,
        Repair.category,
        Repair.status,
        Repair.priority,
        Repair.assigned_to,
        Repair.created_at,
        Repair.updated_at,
        Repair.completed_at,
        Repair.feedback,
        Student.name.label("student_name"),
        Student.student_no.label("student_no"),
        Dormitory.room_number.label("room_number"),
        Building.build_name.label("building_name")
    ).join(Student, Repair.student_id == Student.student_id).join(
        Dormitory, Repair.dorm_id == Dormitory.dorm_id
    ).join(Building, Dormitory.build_id == Building.build_id).filter(
        Repair.repair_id == repair_id
    )

    # 学生只能查看自己的工单
    if current_user.role == "student":
        query = query.filter(Repair.student_id == current_user.student_id)

    repair = query.first()
    if not repair:
        raise HTTPException(status_code=404, detail="工单不存在")

    return repair


@router.put("/{repair_id}/status", response_model=RepairResponse)
def update_repair_status(
    repair_id: int,
    status_update: RepairStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "repairman"]))
):
    """更新工单状态（维修员/管理员）"""
    # 查找工单
    db_repair = db.query(Repair).filter(Repair.repair_id == repair_id).first()
    if not db_repair:
        raise HTTPException(status_code=404, detail="工单不存在")

    # 校验状态转换合法性
    allowed = VALID_STATUS_TRANSITIONS.get(db_repair.status, set())
    if status_update.status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"不允许从 '{db_repair.status}' 状态转换到 '{status_update.status}'"
        )

    # 如果指定了维修人员，校验其存在且角色为 repairman
    if status_update.assigned_to:
        assigned_user = db.query(User).filter(User.user_id == status_update.assigned_to).first()
        if not assigned_user:
            raise HTTPException(status_code=404, detail="指定的维修人员不存在")
        if assigned_user.role != "repairman":
            raise HTTPException(status_code=400, detail="只能分配给维修人员")
        db_repair.assigned_to = status_update.assigned_to

    # 更新状态
    db_repair.status = status_update.status

    # 如果有反馈
    if status_update.feedback:
        db_repair.feedback = status_update.feedback

    # 如果状态为完成，记录完成时间
    if status_update.status == "completed":
        db_repair.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(db_repair)
    return db_repair