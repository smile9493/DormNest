from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.dependencies import get_db
from app.models.student import Student
from app.models.dormitory import Dormitory
from app.models.building import Building
from app.models.check_in_record import CheckInRecord
from app.schemas.student_schema import (
    StudentResponse,
    StudentCreate,
    StudentUpdate,
    StudentWithDormitoryResponse,
    CheckInRequest,
    CheckOutRequest
)
from app.utils.auth import require_role, get_current_active_user
from app.models.user import User
from datetime import date

router = APIRouter()


@router.get("/", response_model=List[StudentWithDormitoryResponse])
def get_students(
    skip: int = 0,
    limit: int = 100,
    student_no: Optional[str] = None,
    name: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取学生列表（支持搜索）"""
    query = db.query(
        Student.student_id,
        Student.student_no,
        Student.name,
        Student.gender,
        Student.phone,
        Student.department,
        Student.class_name,
        Student.dorm_id,
        Student.bed_number,
        Student.check_in_date,
        Student.status,
        Student.created_at,
        Student.updated_at,
        Building.build_name.label("building_name"),
        Dormitory.room_number.label("room_number")
    ).outerjoin(Dormitory, Student.dorm_id == Dormitory.dorm_id).outerjoin(
        Building, Dormitory.build_id == Building.build_id
    )

    if student_no:
        query = query.filter(Student.student_no == student_no)
    if name:
        query = query.filter(Student.name.contains(name))

    students = query.offset(skip).limit(limit).all()
    return students


@router.get("/{student_id}", response_model=StudentWithDormitoryResponse)
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取单个学生信息"""
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="学生不存在")
    return student


@router.post("/", response_model=StudentResponse)
def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """创建学生（管理员权限）"""
    # 检查学号是否已存在
    db_student = db.query(Student).filter(Student.student_no == student.student_no).first()
    if db_student:
        raise HTTPException(status_code=400, detail="学号已存在")

    db_student = Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int,
    student_update: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """更新学生信息（管理员权限）"""
    db_student = db.query(Student).filter(Student.student_id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="学生不存在")

    for key, value in student_update.dict(exclude_unset=True).items():
        setattr(db_student, key, value)

    db.commit()
    db.refresh(db_student)
    return db_student


@router.delete("/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """删除学生（管理员权限）"""
    db_student = db.query(Student).filter(Student.student_id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="学生不存在")

    # 检查是否还在住宿
    if db_student.dorm_id:
        raise HTTPException(status_code=400, detail="学生正在住宿，请先办理退宿")

    db.delete(db_student)
    db.commit()
    return {"message": "学生已删除"}


@router.post("/checkin")
def check_in(
    request: CheckInRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """学生入住（管理员权限）"""
    # 检查学生是否存在
    student = db.query(Student).filter(Student.student_id == request.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="学生不存在")

    # 检查学生是否已入住
    if student.dorm_id:
        raise HTTPException(status_code=400, detail="学生已入住宿舍")

    # 检查宿舍是否存在且有空床位
    dormitory = db.query(Dormitory).filter(Dormitory.dorm_id == request.dorm_id).first()
    if not dormitory:
        raise HTTPException(status_code=404, detail="宿舍不存在")

    if dormitory.occupied_beds >= dormitory.bed_count:
        raise HTTPException(status_code=400, detail="宿舍已满")

    # 分配床位（如果未指定，自动分配）
    bed_number = request.bed_number
    if bed_number is None:
        # 查找可用床位号
        occupied_beds = db.query(Student.bed_number).filter(
            Student.dorm_id == request.dorm_id,
            Student.bed_number.isnot(None)
        ).all()
        occupied_set = set([bed[0] for bed in occupied_beds])
        for i in range(1, dormitory.bed_count + 1):
            if i not in occupied_set:
                bed_number = i
                break

        if bed_number is None:
            raise HTTPException(status_code=400, detail="无法分配床位")

    # 更新学生信息
    student.dorm_id = request.dorm_id
    student.bed_number = bed_number
    student.check_in_date = date.today()
    student.status = "living"

    # 更新宿舍入住人数
    dormitory.occupied_beds += 1
    if dormitory.occupied_beds >= dormitory.bed_count:
        dormitory.status = "full"

    # 写入入住审计记录
    record = CheckInRecord(
        student_id=student.student_id,
        dorm_id=dormitory.dorm_id,
        bed_number=bed_number,
        check_in_date=date.today(),
        reason="入住",
        operator_id=current_user.user_id
    )
    db.add(record)

    db.commit()
    return {"message": "入住成功", "bed_number": bed_number}


@router.post("/checkout")
def check_out(
    request: CheckOutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """学生退宿（管理员权限）"""
    # 检查学生是否存在
    student = db.query(Student).filter(Student.student_id == request.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="学生不存在")

    # 检查是否已入住
    if not student.dorm_id:
        raise HTTPException(status_code=400, detail="学生未入住宿舍")

    # 记录退宿信息
    dorm_id = student.dorm_id
    bed_number = student.bed_number

    # 更新学生信息
    student.dorm_id = None
    student.bed_number = None
    student.check_in_date = None
    student.status = "leave"

    # 更新宿舍信息
    dormitory = db.query(Dormitory).filter(Dormitory.dorm_id == dorm_id).first()
    if dormitory:
        dormitory.occupied_beds -= 1
        dormitory.status = "available"

    # 写入退宿审计记录
    record = CheckInRecord(
        student_id=student.student_id,
        dorm_id=dorm_id,
        bed_number=bed_number,
        check_in_date=student.check_in_date,
        check_out_date=date.today(),
        reason="退宿",
        operator_id=current_user.user_id
    )
    db.add(record)

    db.commit()
    return {"message": "退宿成功"}