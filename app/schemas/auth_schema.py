from pydantic import BaseModel
from typing import Optional


class Token(BaseModel):
    """Token响应模型"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Token数据模型"""
    username: Optional[str] = None
    role: Optional[str] = None


class LoginRequest(BaseModel):
    """登录请求模型"""
    username: str
    password: str


class PasswordChange(BaseModel):
    """修改密码请求模型"""
    old_password: str
    new_password: str