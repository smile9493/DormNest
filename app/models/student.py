from sqlalchemy import Column, Integer, String, Enum, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.dependencies import Base


class Student(Base):
    """学生信息模型"""
    __tablename__ = "student"

    student_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_no = Column(String(20), unique=True, nullable=False, index=True, comment="学号")
    name = Column(String(50), nullable=False, comment="姓名")
    gender = Column(Enum("male", "female", name="student_gender"), nullable=False, comment="性别")
    phone = Column(String(15), comment="电话")
    department = Column(String(50), comment="院系")
    class_name = Column(String(50), comment="班级")
    dorm_id = Column(Integer, ForeignKey("dormitory.dorm_id", ondelete="SET NULL"), comment="当前宿舍ID")
    bed_number = Column(Integer, comment="当前床位号")
    check_in_date = Column(Date, comment="入住日期")
    status = Column(
        Enum("living", "graduated", "leave", name="student_status"),
        default="living",
        comment="在校住宿状态"
    )
    created_at = Column(DateTime, server_default=func.now(), comment="创建时间")
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment="更新时间")

    def __repr__(self):
        return f"<Student(student_id={self.student_id}, student_no='{self.student_no}', name='{self.name}')>"