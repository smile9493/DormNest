from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db
from app.models.building import Building
from app.schemas.building_schema import BuildingResponse, BuildingCreate, BuildingUpdate
from app.utils.auth import require_role, get_current_active_user
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[BuildingResponse])
def get_buildings(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取宿舍楼列表"""
    buildings = db.query(Building).offset(skip).limit(limit).all()
    return buildings


@router.get("/{build_id}", response_model=BuildingResponse)
def get_building(
    build_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取单个宿舍楼信息"""
    building = db.query(Building).filter(Building.build_id == build_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="宿舍楼不存在")
    return building


@router.post("/", response_model=BuildingResponse)
def create_building(
    building: BuildingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """创建宿舍楼（管理员权限）"""
    db_building = Building(**building.dict())
    db.add(db_building)
    db.commit()
    db.refresh(db_building)
    return db_building


@router.put("/{build_id}", response_model=BuildingResponse)
def update_building(
    build_id: int,
    building_update: BuildingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """更新宿舍楼信息（管理员权限）"""
    db_building = db.query(Building).filter(Building.build_id == build_id).first()
    if not db_building:
        raise HTTPException(status_code=404, detail="宿舍楼不存在")

    for key, value in building_update.dict(exclude_unset=True).items():
        setattr(db_building, key, value)

    db.commit()
    db.refresh(db_building)
    return db_building


@router.delete("/{build_id}")
def delete_building(
    build_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """删除宿舍楼（管理员权限）"""
    db_building = db.query(Building).filter(Building.build_id == build_id).first()
    if not db_building:
        raise HTTPException(status_code=404, detail="宿舍楼不存在")

    db.delete(db_building)
    db.commit()
    return {"message": "宿舍楼已删除"}