from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.dependencies import get_db
from app.utils.auth import require_role
from app.models.user import User
from app.models.building import Building
from app.models.dormitory import Dormitory
from app.models.student import Student
from app.models.repair import Repair
from app.models.charge import Charge
from typing import Dict

router = APIRouter()


@router.get("/occupancy")
def get_occupancy_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """获取入住率统计（管理员权限）"""
    
    # 总宿舍数和总床位数
    total_dormitories = db.query(func.count(Dormitory.dorm_id)).scalar()
    total_beds = db.query(func.sum(Dormitory.bed_count)).scalar()
    
    # 已入住人数
    occupied_beds = db.query(func.sum(Dormitory.occupied_beds)).scalar()
    
    # 入住率
    occupancy_rate = (occupied_beds / total_beds * 100) if total_beds else 0
    
    # 各楼栋统计
    buildings_stats = db.query(
        Building.build_name,
        func.count(Dormitory.dorm_id).label('total_rooms'),
        func.sum(Dormitory.bed_count).label('total_beds'),
        func.sum(Dormitory.occupied_beds).label('occupied_beds')
    ).join(Dormitory, Building.build_id == Dormitory.build_id).group_by(Building.build_id).all()
    
    buildings_data = []
    for stat in buildings_stats:
        building_rate = (stat.occupied_beds / stat.total_beds * 100) if stat.total_beds else 0
        buildings_data.append({
            "build_name": stat.build_name,
            "total_rooms": stat.total_rooms,
            "total_beds": stat.total_beds,
            "occupied_beds": stat.occupied_beds,
            "available_beds": stat.total_beds - stat.occupied_beds,
            "occupancy_rate": round(building_rate, 2)
        })
    
    return {
        "total_dormitories": total_dormitories,
        "total_beds": total_beds,
        "occupied_beds": occupied_beds,
        "available_beds": total_beds - occupied_beds if total_beds else 0,
        "occupancy_rate": round(occupancy_rate, 2),
        "buildings": buildings_data
    }


@router.get("/repairs")
def get_repair_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "repairman"]))
):
    """获取报修统计（管理员/维修员权限）"""
    
    # 各状态工单数
    status_counts = db.query(
        Repair.status,
        func.count(Repair.repair_id).label('count')
    ).group_by(Repair.status).all()
    
    status_data = {status: 0 for status in ['pending', 'assigned', 'processing', 'completed', 'cancelled']}
    for stat in status_counts:
        status_data[stat.status] = stat.count
    
    # 总工单数
    total_repairs = db.query(func.count(Repair.repair_id)).scalar()
    
    # 完成率
    completion_rate = (status_data['completed'] / total_repairs * 100) if total_repairs else 0
    
    return {
        "total_repairs": total_repairs,
        "pending": status_data['pending'],
        "assigned": status_data['assigned'],
        "processing": status_data['processing'],
        "completed": status_data['completed'],
        "cancelled": status_data['cancelled'],
        "completion_rate": round(completion_rate, 2)
    }


@router.get("/charges")
def get_charge_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """获取费用统计（管理员权限）"""
    
    # 各状态费用金额
    status_amounts = db.query(
        Charge.pay_status,
        func.sum(Charge.amount).label('total_amount'),
        func.count(Charge.charge_id).label('count')
    ).group_by(Charge.pay_status).all()
    
    status_data = {'paid': {'amount': 0, 'count': 0}, 'unpaid': {'amount': 0, 'count': 0}, 'overdue': {'amount': 0, 'count': 0}}
    for stat in status_amounts:
        status_data[stat.pay_status] = {
            'amount': float(stat.total_amount) if stat.total_amount else 0,
            'count': stat.count
        }
    
    # 总费用金额
    total_amount = db.query(func.sum(Charge.amount)).scalar()
    
    # 收缴率
    collection_rate = (status_data['paid']['amount'] / total_amount * 100) if total_amount else 0
    
    return {
        "total_amount": float(total_amount) if total_amount else 0,
        "paid": status_data['paid'],
        "unpaid": status_data['unpaid'],
        "overdue": status_data['overdue'],
        "collection_rate": round(collection_rate, 2)
    }


@router.get("/students")
def get_student_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """获取学生统计（管理员权限）"""
    
    # 各状态学生数
    status_counts = db.query(
        Student.status,
        func.count(Student.student_id).label('count')
    ).group_by(Student.status).all()
    
    status_data = {'living': 0, 'graduated': 0, 'leave': 0}
    for stat in status_counts:
        status_data[stat.status] = stat.count
    
    # 总学生数
    total_students = db.query(func.count(Student.student_id)).scalar()
    
    # 入住学生数
    living_students = db.query(func.count(Student.student_id)).filter(Student.dorm_id.isnot(None)).scalar()
    
    return {
        "total_students": total_students,
        "living": status_data['living'],
        "graduated": status_data['graduated'],
        "leave": status_data['leave'],
        "checked_in": living_students,
        "not_checked_in": total_students - living_students if total_students else 0
    }