from sqlalchemy import Column, Integer, String, DECIMAL, Date, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from app.dependencies import Base


class Charge(Base):
    """费用账单模型"""
    __tablename__ = "charge"

    charge_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("student.student_id"), nullable=False, comment="学生ID")
    charge_type = Column(String(20), nullable=False, comment="费用类型")
    amount = Column(DECIMAL(10, 2), nullable=False, comment="金额")
    charge_date = Column(Date, nullable=False, comment="账单生成日期")
    due_date = Column(Date, comment="缴费截止日期")
    pay_status = Column(
        Enum("unpaid", "paid", "overdue", name="charge_pay_status"),
        default="unpaid",
        comment="支付状态"
    )
    pay_date = Column(DateTime, comment="支付时间")
    pay_method = Column(String(20), comment="支付方式")
    memo = Column(String(100), comment="备注")
    created_at = Column(DateTime, server_default=func.now(), comment="创建时间")
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment="更新时间")

    def __repr__(self):
        return f"<Charge(charge_id={self.charge_id}, charge_type='{self.charge_type}', amount={self.amount})>"