from sqlalchemy import Column, Integer, String, Enum, DECIMAL, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.dependencies import Base


class Dormitory(Base):
    """宿舍房间模型"""
    __tablename__ = "dormitory"

    dorm_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    build_id = Column(Integer, ForeignKey("building.build_id", ondelete="CASCADE"), nullable=False, comment="所属楼栋ID")
    room_number = Column(String(10), nullable=False, comment="房间号")
    floor = Column(Integer, comment="所在楼层")
    bed_count = Column(Integer, default=4, comment="床位总数")
    occupied_beds = Column(Integer, default=0, comment="已住人数")
    status = Column(
        Enum("available", "full", "maintenance", name="dormitory_status"),
        default="available",
        comment="房间状态"
    )
    price = Column(DECIMAL(10, 2), comment="每月住宿费标准")
    created_at = Column(DateTime, server_default=func.now(), comment="创建时间")
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment="更新时间")

    def __repr__(self):
        return f"<Dormitory(dorm_id={self.dorm_id}, room_number='{self.room_number}')>"

    @property
    def available_beds(self):
        """可用床位数"""
        return self.bed_count - self.occupied_beds

    @property
    def occupancy_rate(self):
        """入住率"""
        if self.bed_count == 0:
            return 0
        return (self.occupied_beds / self.bed_count) * 100