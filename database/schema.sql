-- ============================================
-- 宿舍管理系统数据库初始化脚本
-- Database: dorm_db
-- Version: 1.0
-- Date: 2026-07-05
-- ============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS dorm_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE dorm_db;

-- 1. 宿舍楼表
CREATE TABLE IF NOT EXISTS building (
    build_id INT PRIMARY KEY AUTO_INCREMENT,
    build_name VARCHAR(30) NOT NULL COMMENT '楼栋名称 (如: 梅苑1栋)',
    dorm_count INT DEFAULT 0 COMMENT '房间总数',
    dorm_floor INT DEFAULT 0 COMMENT '楼层数',
    address VARCHAR(100) COMMENT '地址',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_build_name (build_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宿舍楼信息表';

-- 2. 宿舍表
CREATE TABLE IF NOT EXISTS dormitory (
    dorm_id INT PRIMARY KEY AUTO_INCREMENT,
    build_id INT NOT NULL COMMENT '所属楼栋ID',
    room_number VARCHAR(10) NOT NULL COMMENT '房间号 (如: 301)',
    floor INT COMMENT '所在楼层',
    bed_count INT DEFAULT 4 COMMENT '床位总数',
    occupied_beds INT DEFAULT 0 COMMENT '已住人数',
    status ENUM('available', 'full', 'maintenance') DEFAULT 'available' COMMENT '房间状态',
    price DECIMAL(10,2) COMMENT '每月住宿费标准',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (build_id) REFERENCES building(build_id) ON DELETE CASCADE,
    UNIQUE KEY uk_build_room (build_id, room_number),
    INDEX idx_status (status),
    INDEX idx_build_id (build_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宿舍房间信息表';

-- 3. 学生信息表
CREATE TABLE IF NOT EXISTS student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    student_no VARCHAR(20) UNIQUE NOT NULL COMMENT '学号',
    name VARCHAR(50) NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    phone VARCHAR(15),
    department VARCHAR(50) COMMENT '院系',
    class_name VARCHAR(50) COMMENT '班级',
    dorm_id INT COMMENT '当前宿舍ID (外键)',
    bed_number INT COMMENT '当前床位号',
    check_in_date DATE COMMENT '入住日期',
    status ENUM('living', 'graduated', 'leave') DEFAULT 'living' COMMENT '在校住宿状态',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dorm_id) REFERENCES dormitory(dorm_id) ON DELETE SET NULL,
    INDEX idx_student_no (student_no),
    INDEX idx_dorm_id (dorm_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生信息表';

-- 4. 入住历史记录表 (审计追踪)
CREATE TABLE IF NOT EXISTS check_in_record (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    dorm_id INT NOT NULL,
    bed_number INT,
    check_in_date DATE NOT NULL,
    check_out_date DATE,
    reason VARCHAR(50) COMMENT '操作原因: 入住/换宿/退宿',
    operator_id INT COMMENT '操作人ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (dorm_id) REFERENCES dormitory(dorm_id),
    INDEX idx_student_id (student_id),
    INDEX idx_dorm_id (dorm_id),
    INDEX idx_check_in_date (check_in_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='入住历史记录表';

-- 5. 报修工单表
CREATE TABLE IF NOT EXISTS repair (
    repair_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    dorm_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT COMMENT '故障描述',
    category VARCHAR(30) COMMENT '故障类型 (水电/家具/网络/其他)',
    status ENUM('pending', 'assigned', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium' COMMENT '优先级',
    assigned_to INT COMMENT '维修人员ID (关联user表)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at DATETIME,
    feedback TEXT COMMENT '学生维修后反馈',
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (dorm_id) REFERENCES dormitory(dorm_id),
    INDEX idx_status (status),
    INDEX idx_student_id (student_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='报修工单表';

-- 6. 费用账单表
CREATE TABLE IF NOT EXISTS charge (
    charge_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    charge_type VARCHAR(20) NOT NULL COMMENT '费用类型 (住宿费/电费/水费)',
    amount DECIMAL(10,2) NOT NULL,
    charge_date DATE NOT NULL COMMENT '账单生成日期',
    due_date DATE COMMENT '缴费截止日',
    pay_status ENUM('unpaid', 'paid', 'overdue') DEFAULT 'unpaid',
    pay_date DATETIME,
    pay_method VARCHAR(20) COMMENT '支付方式',
    memo VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    INDEX idx_student_id (student_id),
    INDEX idx_pay_status (pay_status),
    INDEX idx_charge_date (charge_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='费用账单表';

-- 7. 公告通知表
CREATE TABLE IF NOT EXISTS announcement (
    announcement_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL COMMENT '公告标题',
    content TEXT NOT NULL COMMENT '公告内容',
    category VARCHAR(30) COMMENT '公告类型',
    is_top BOOLEAN DEFAULT FALSE COMMENT '是否置顶',
    status ENUM('draft', 'published', 'archived') DEFAULT 'published',
    publisher_id INT NOT NULL COMMENT '发布人ID (关联user表)',
    publish_time DATETIME COMMENT '发布时间',
    expire_time DATETIME COMMENT '过期时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_is_top (is_top),
    INDEX idx_publish_time (publish_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告通知表';

-- 8. 系统用户表 (认证授权)
CREATE TABLE IF NOT EXISTS user (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt 加密存储',
    role ENUM('admin', 'student', 'repairman') NOT NULL,
    student_id INT COMMENT '若为学生角色，关联student表',
    real_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(15),
    is_active BOOLEAN DEFAULT TRUE COMMENT '账户是否激活',
    last_login DATETIME COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE SET NULL,
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户表';

-- ============================================
-- 初始化数据
-- ============================================

-- 插入默认管理员账户 (密码: admin123，需要在应用中重新哈希)
-- 注意：实际部署时应该使用应用生成的bcrypt哈希值
INSERT INTO user (username, password_hash, role, real_name) VALUES
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU2W9CqPZKM.', 'admin', '系统管理员');

-- 插入示例楼栋数据
INSERT INTO building (build_name, dorm_count, dorm_floor, address) VALUES
('梅苑1栋', 40, 5, '校园东区'),
('梅苑2栋', 40, 5, '校园东区'),
('兰苑1栋', 40, 5, '校园西区'),
('兰苑2栋', 40, 5, '校园西区');

-- 插入示例宿舍数据 (以梅苑1栋为例，每层8间房)
INSERT INTO dormitory (build_id, room_number, floor, bed_count, occupied_beds, status, price)
SELECT
    b.build_id,
    CONCAT(floor_num * 100 + room_num) as room_number,
    floor_num as floor,
    4 as bed_count,
    0 as occupied_beds,
    'available' as status,
    1200.00 as price
FROM building b
CROSS JOIN (
    SELECT 1 as floor_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
) floors
CROSS JOIN (
    SELECT 1 as room_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8
) rooms
WHERE b.build_name = '梅苑1栋';

-- ============================================
-- 创建视图
-- ============================================

-- 宿舍入住情况视图
CREATE OR REPLACE VIEW v_dormitory_occupancy AS
SELECT
    d.dorm_id,
    d.room_number,
    d.build_id,
    b.build_name,
    d.floor,
    d.bed_count,
    d.occupied_beds,
    (d.bed_count - d.occupied_beds) as available_beds,
    d.status,
    d.price,
    ROUND((d.occupied_beds / d.bed_count) * 100, 2) as occupancy_rate
FROM dormitory d
JOIN building b ON d.build_id = b.build_id;

-- 学生住宿信息视图
CREATE OR REPLACE VIEW v_student_accommodation AS
SELECT
    s.student_id,
    s.student_no,
    s.name,
    s.gender,
    s.phone,
    s.department,
    s.class_name,
    s.status as student_status,
    s.check_in_date,
    b.build_name,
    d.room_number,
    s.bed_number,
    d.price
FROM student s
LEFT JOIN dormitory d ON s.dorm_id = d.dorm_id
LEFT JOIN building b ON d.build_id = b.build_id;

-- ============================================
-- 创建存储过程
-- ============================================

DELIMITER //

-- 自动分配床位存储过程
CREATE PROCEDURE sp_assign_bed(
    IN p_student_id INT,
    IN p_dorm_id INT,
    OUT p_result VARCHAR(100)
)
BEGIN
    DECLARE v_available_beds INT;
    DECLARE v_bed_number INT;

    -- 检查宿舍是否有空床位
    SELECT (bed_count - occupied_beds) INTO v_available_beds
    FROM dormitory WHERE dorm_id = p_dorm_id FOR UPDATE;

    IF v_available_beds > 0 THEN
        -- 找到最小可用床位号
        SELECT MIN(bed_number) INTO v_bed_number
        FROM (
            SELECT 1 as bed_number UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
        ) AS all_beds
        WHERE bed_number NOT IN (
            SELECT bed_number FROM student WHERE dorm_id = p_dorm_id AND bed_number IS NOT NULL
        );

        -- 更新学生住宿信息
        UPDATE student SET
            dorm_id = p_dorm_id,
            bed_number = v_bed_number,
            check_in_date = CURDATE(),
            status = 'living'
        WHERE student_id = p_student_id;

        -- 更新宿舍入住人数
        UPDATE dormitory SET
            occupied_beds = occupied_beds + 1,
            status = CASE WHEN occupied_beds + 1 >= bed_count THEN 'full' ELSE 'available' END
        WHERE dorm_id = p_dorm_id;

        SET p_result = CONCAT('分配成功，床位号: ', v_bed_number);
    ELSE
        SET p_result = '该宿舍已满，无法分配';
    END IF;
END //

-- 退宿存储过程
CREATE PROCEDURE sp_checkout(
    IN p_student_id INT,
    OUT p_result VARCHAR(100)
)
BEGIN
    DECLARE v_dorm_id INT;
    DECLARE v_bed_number INT;

    -- 获取学生当前宿舍信息
    SELECT dorm_id, bed_number INTO v_dorm_id, v_bed_number
    FROM student WHERE student_id = p_student_id;

    IF v_dorm_id IS NOT NULL THEN
        -- 记录退宿历史
        INSERT INTO check_in_record (student_id, dorm_id, bed_number, check_in_date, check_out_date, reason)
        SELECT student_id, dorm_id, bed_number, check_in_date, CURDATE(), '退宿'
        FROM student WHERE student_id = p_student_id;

        -- 更新学生信息
        UPDATE student SET
            dorm_id = NULL,
            bed_number = NULL,
            check_in_date = NULL,
            status = 'leave'
        WHERE student_id = p_student_id;

        -- 更新宿舍状态
        UPDATE dormitory SET
            occupied_beds = occupied_beds - 1,
            status = 'available'
        WHERE dorm_id = v_dorm_id;

        SET p_result = '退宿成功';
    ELSE
        SET p_result = '该学生未入住宿舍';
    END IF;
END //

DELIMITER ;

-- ============================================
-- 创建触发器
-- ============================================

-- 更新楼栋房间数量触发器
DELIMITER //

CREATE TRIGGER tr_update_building_count_after_insert
AFTER INSERT ON dormitory
FOR EACH ROW
BEGIN
    UPDATE building SET dorm_count = (
        SELECT COUNT(*) FROM dormitory WHERE build_id = NEW.build_id
    ) WHERE build_id = NEW.build_id;
END //

CREATE TRIGGER tr_update_building_count_after_delete
AFTER DELETE ON dormitory
FOR EACH ROW
BEGIN
    UPDATE building SET dorm_count = (
        SELECT COUNT(*) FROM dormitory WHERE build_id = OLD.build_id
    ) WHERE build_id = OLD.build_id;
END //

DELIMITER ;