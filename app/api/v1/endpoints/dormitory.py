from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.dependencies import get_db
from app.models.dormitory import Dormitory
from app.models.building import Building
from app.schemas.dormitory_schema import (
    DormitoryResponse,
    DormitoryCreate,
    DormitoryUpdate,
    DormitoryWithBuildingResponse
)
from app.utils.auth import require_role, get_current_active_user
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[DormitoryWithBuildingResponse])
def get_dormitories(
    skip: int = 0,
    limit: int = 100,
    build_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取宿舍房间列表（支持筛选）"""
    query = db.query(
        Dormitory.dorm_id,
        Dormitory.build_id,
        Dormitory.room_number,
        Dormitory.floor,
        Dormitory.bed_count,
        Dormitory.occupied_beds,
        Dormitory.status,
        Dormitory.price,
        Dormitory.created_at,
        Dormitory.updated_at,
        Building.build_name.label("building_name")
    ).join(Building, Dormitory.build_id == Building.build_id)

    if build_id:
        query = query.filter(Dormitory.build_id == build_id)
    if status:
        query = query.filter(Dormitory.status == status)

    dormitories = query.offset(skip).limit(limit).all()

    # 转换结果，添加计算字段
    result = []
    for dorm in dormitories:
        available_beds = dorm.bed_count - dorm.occupied_beds
        occupancy_rate = (dorm.occupied_beds / dorm.bed_count * 100) if dorm.bed_count > 0 else 0

        dorm_dict = {
            "dorm_id": dorm.dorm_id,
            "build_id": dorm.build_id,
            "room_number": dorm.room_number,
            "floor": dorm.floor,
            "bed_count": dorm.bed_count,
            "occupied_beds": dorm.occupied_beds,
            "status": dorm.status,
            "price": dorm.price,
            "created_at": dorm.created_at,
            "updated_at": dorm.updated_at,
            "building_name": dorm.building_name,
            "available_beds": available_beds,
            "occupancy_rate": occupancy_rate
        }
        result.append(dorm_dict)

    return result


@router.get("/{dorm_id}", response_model=DormitoryResponse)
def get_dormitory(
    dorm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取单个宿舍房间信息"""
    dormitory = db.query(Dormitory).filter(Dormitory.dorm_id == dorm_id).first()
    if not dormitory:
        raise HTTPException(status_code=404, detail="宿舍房间不存在")
    return dormitory


@router.post("/", response_model=DormitoryResponse)
def create_dormitory(
    dormitory: DormitoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """创建宿舍房间（管理员权限）"""
    # 检查楼栋是否存在
    building = db.query(Building).filter(Building.build_id == dormitory.build_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="宿舍楼不存在")

    # 检查房间号是否已存在
    existing_dorm = db.query(Dormitory).filter(
        Dormitory.build_id == dormitory.build_id,
        Dormitory.room_number == dormitory.room_number
    ).first()
    if existing_dorm:
        raise HTTPException(status_code=400, detail="该楼栋房间号已存在")

    db_dormitory = Dormitory(**dormitory.dict())
    db.add(db_dormitory)
    db.commit()
    db.refresh(db_dormitory)
    return db_dormitory


@router.put("/{dorm_id}", response_model=DormitoryResponse)
def update_dormitory(
    dorm_id: int,
    dormitory_update: DormitoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """更新宿舍房间信息（管理员权限）"""
    db_dormitory = db.query(Dormitory).filter(Dormitory.dorm_id == dorm_id).first()
    if not db_dormitory:
        raise HTTPException(status_code=404, detail="宿舍房间不存在")

    for key, value in dormitory_update.dict(exclude_unset=True).items():
        setattr(db_dormitory, key, value)

    db.commit()
    db.refresh(db_dormitory)
    return db_dormitory


@router.delete("/{dorm_id}")
def delete_dormitory(
    dorm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """删除宿舍房间（管理员权限）"""
    db_dormitory = db.query(Dormitory).filter(Dormitory.dorm_id == dorm_id).first()
    if not db_dormitory:
        raise HTTPException(status_code=404, detail="宿舍房间不存在")

    # 检查是否还有学生居住
    if db_dormitory.occupied_beds > 0:
        raise HTTPException(status_code=400, detail="宿舍仍有学生居住，无法删除")

    db.delete(db_dormitory)
    db.commit()
    return {"message": "宿舍房间已删除"}