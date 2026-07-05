from fastapi import APIRouter
from app.api.v1.endpoints import auth, building, dormitory, student, user

# 创建 API 路由器
api_router = APIRouter()

# 注册各模块路由
api_router.include_router(auth.router, prefix="/auth", tags=["认证"])
api_router.include_router(user.router, prefix="/users", tags=["用户管理"])
api_router.include_router(building.router, prefix="/buildings", tags=["宿舍楼管理"])
api_router.include_router(dormitory.router, prefix="/dormitories", tags=["宿舍房间管理"])
api_router.include_router(student.router, prefix="/students", tags=["学生管理"])