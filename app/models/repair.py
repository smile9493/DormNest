from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.dependencies import Base


class Repair(Base):
    """报修工单模型"""
    __tablename__ = "repair"

    repair_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("student.student_id"), nullable=False, comment="学生ID")
    dorm_id = Column(Integer, ForeignKey("dormitory.dorm_id"), nullable=False, comment="宿舍ID")
    title = Column(String(100), nullable=False, comment="故障标题")
    description = Column(Text, comment="故障描述")
    category = Column(String(30), comment="故障类型")
    status = Column(
        Enum("pending", "assigned", "processing", "completed", "cancelled", name="repair_status"),
        default="pending",
        comment="工单状态"
    )
    priority = Column(
        Enum("low", "medium", "high", "urgent", name="repair_priority"),
        default="medium",
        comment="优先级"
    )
    assigned_to = Column(Integer, comment="维修人员ID")
    created_at = Column(DateTime, server_default=func.now(), comment="创建时间")
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment="更新时间")
    completed_at = Column(DateTime, comment="完成时间")
    feedback = Column(Text, comment="学生反馈")

    def __repr__(self):
        return f"<Repair(repair_id={self.repair_id}, title='{self.title}', status='{self.status}')>"