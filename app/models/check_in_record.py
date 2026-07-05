from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.dependencies import Base


class CheckInRecord(Base):
    """入住历史记录模型"""
    __tablename__ = "check_in_record"

    record_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("student.student_id"), nullable=False, comment="学生ID")
    dorm_id = Column(Integer, ForeignKey("dormitory.dorm_id"), nullable=False, comment="宿舍ID")
    bed_number = Column(Integer, comment="床位号")
    check_in_date = Column(Date, nullable=False, comment="入住日期")
    check_out_date = Column(Date, comment="退宿日期")
    reason = Column(String(50), comment="操作原因")
    operator_id = Column(Integer, comment="操作人ID")
    created_at = Column(DateTime, server_default=func.now(), comment="创建时间")

    def __repr__(self):
        return f"<CheckInRecord(record_id={self.record_id}, student_id={self.student_id})>"