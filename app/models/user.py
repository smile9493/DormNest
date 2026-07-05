from sqlalchemy import Column, Integer, String, Enum, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.dependencies import Base


class User(Base):
    """系统用户模型"""
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True, comment="用户名")
    password_hash = Column(String(255), nullable=False, comment="密码哈希")
    role = Column(
        Enum("admin", "student", "repairman", name="user_role"),
        nullable=False,
        comment="角色"
    )
    student_id = Column(Integer, ForeignKey("student.student_id", ondelete="SET NULL"), comment="关联学生ID")
    real_name = Column(String(50), comment="真实姓名")
    email = Column(String(100), comment="邮箱")
    phone = Column(String(15), comment="电话")
    is_active = Column(Boolean, default=True, comment="账户是否激活")
    last_login = Column(DateTime, comment="最后登录时间")
    created_at = Column(DateTime, server_default=func.now(), comment="创建时间")
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment="更新时间")

    def __repr__(self):
        return f"<User(user_id={self.user_id}, username='{self.username}', role='{self.role}')>"