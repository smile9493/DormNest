from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db
from app.models.user import User
from app.schemas.user_schema import UserResponse, UserCreate, UserUpdate
from app.utils.auth import require_role
from app.utils.hash import hash_password

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
def get_users(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """获取用户列表（管理员权限）"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """获取单个用户信息（管理员权限）"""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user


@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """创建用户（管理员权限）"""
    # 检查用户名是否已存在
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="用户名已存在")

    # 创建新用户
    hashed_password = hash_password(user.password)
    db_user = User(
        username=user.username,
        password_hash=hashed_password,
        role=user.role,
        real_name=user.real_name,
        email=user.email,
        phone=user.phone,
        student_id=user.student_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """更新用户信息（管理员权限）"""
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="用户不存在")

    # 禁止管理员停用自己的账号
    if user_id == current_user.user_id and user_update.is_active is False:
        raise HTTPException(status_code=400, detail="不能停用自己的账号")

    # 更新字段
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """删除用户（管理员权限）"""
    # 禁止管理员删除自己的账号
    if user_id == current_user.user_id:
        raise HTTPException(status_code=400, detail="不能删除自己的账号")

    db_user = db.query(User).filter(User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="用户不存在")

    db.delete(db_user)
    db.commit()
    return {"message": "用户已删除"}