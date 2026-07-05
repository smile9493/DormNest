from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.dependencies import get_db
from app.models.user import User
from app.schemas.auth_schema import LoginRequest, Token, LoginResponse
from app.utils.auth import create_access_token
from app.utils.hash import verify_password
from app.config import settings

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """用户登录"""
    # 查找用户
    user = db.query(User).filter(User.username == request.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 验证密码
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 检查用户是否激活
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="用户账户已被禁用"
        )

    # 创建访问令牌
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"username": user.username, "role": user.role, "user_id": user.user_id},
        expires_delta=access_token_expires
    )

    # 返回 token 和用户信息
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.user_id,
            "username": user.username,
            "real_name": user.real_name,
            "role": user.role,
            "email": user.email,
            "phone": user.phone
        }
    }


@router.post("/register", status_code=501)
def register():
    """用户注册（待实现）"""
    raise HTTPException(status_code=501, detail="注册功能尚未实现")