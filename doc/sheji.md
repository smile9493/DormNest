这是完整的 **宿舍管理Web应用设计方案**，已整理为标准Markdown格式，方便你保存为 `.md` 文件或直接打印。

```markdown
# 宿舍管理 Web 应用系统设计方案

> **技术栈概览**：Python FastAPI（后端） + HTML/CSS/JavaScript（前端） + MySQL（数据库） + Nginx（反向代理） + Debian 12（服务器操作系统）

---

## 一、系统总体架构

系统采用经典的 **B/S 三层架构**（表现层-业务逻辑层-数据访问层），所有服务部署于同一台 Debian 服务器，通过 Nginx 统一流量入口。

```text
┌─────────────────────────────────────────────────────────────────┐
│                         用户浏览器                             │
│                    (HTML + CSS + JavaScript)                   │
│                     (LayUI / Bootstrap UI)                    │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTP / HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Nginx 反向代理服务器                         │
│              - 托管静态资源 (HTML/CSS/JS/图片)                 │
│              - 转发 /api/* 动态请求至后端                      │
│              - SSL 证书终止 (可选强制 HTTPS)                   │
│              - 负载均衡 (单机无需开启)                         │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FastAPI 后端应用 (Python)                     │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │  路由层 (API)  │→│ 业务逻辑层     │→│  数据访问层 (ORM) │  │
│  │  (Pydantic)   │  │  (核心服务)    │  │  (SQLAlchemy)    │  │
│  └───────────────┘  └───────────────┘  └──────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MySQL 数据库 (8.0)                         │
│     (宿舍楼/房间/学生/入住记录/报修/费用/用户认证)            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、功能模块设计

### 2.1 用户角色与权限矩阵

| 角色 | 核心职责 | 主要权限范围 |
|------|----------|--------------|
| **系统管理员** | 系统全维度运维与管理 | 所有模块的增删改查、数据导出、用户管理 |
| **学生** | 个人住宿信息查看与日常操作 | 查看个人信息、报修提交、费用缴纳、公告查阅 |
| **维修人员** | 接收并闭环处理报修工单 | 查看/接单/更新维修状态、填写维修备注 |

### 2.2 功能模块清单

| 模块 | 核心功能描述 |
|------|--------------|
| **宿舍资源管理** | 楼栋/房间的增删改查；房间状态（空闲/已住满/维修中）实时更新 |
| **入住与退宿管理** | 学生入住登记（自动分配床位）、换宿申请、退宿销户，记录历史轨迹 |
| **费用核算系统** | 住宿费/水电费月度核算，支持在线标记缴纳状态与逾期提醒 |
| **智能报修工单** | 学生提报故障（带图/文字）→ 维修人员抢单/派单 → 完成回访反馈 |
| **公告通知中心** | 管理员发布重要通知，支持置顶和定时发布 |
| **数据统计看板** | 宿舍入住率、各楼栋空房数、报修完成率、费用收缴率等可视化报表 |

---

## 三、数据库设计（MySQL）

### 3.1 核心 ER 关系概览

```text
building (宿舍楼) 1 ── N dormitory (宿舍) N ── 1 student (学生)
                                          │
                                          ├── N check_in_record (入住历史)
                                          ├── N repair (报修记录)
                                          └── N charge (费用记录)
```

### 3.2 核心表结构 SQL 脚本

```sql
-- 1. 宿舍楼表
CREATE TABLE building (
    build_id INT PRIMARY KEY AUTO_INCREMENT,
    build_name VARCHAR(30) NOT NULL COMMENT '楼栋名称 (如: 梅苑1栋)',
    dorm_count INT DEFAULT 0 COMMENT '房间总数',
    dorm_floor INT DEFAULT 0 COMMENT '楼层数',
    address VARCHAR(100) COMMENT '地址',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 宿舍表
CREATE TABLE dormitory (
    dorm_id INT PRIMARY KEY AUTO_INCREMENT,
    build_id INT NOT NULL COMMENT '所属楼栋ID',
    room_number VARCHAR(10) NOT NULL COMMENT '房间号 (如: 301)',
    floor INT COMMENT '所在楼层',
    bed_count INT DEFAULT 4 COMMENT '床位总数',
    occupied_beds INT DEFAULT 0 COMMENT '已住人数',
    status ENUM('available', 'full', 'maintenance') DEFAULT 'available' 
        COMMENT '房间状态',
    price DECIMAL(10,2) COMMENT '每月住宿费标准',
    FOREIGN KEY (build_id) REFERENCES building(build_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 学生信息表
CREATE TABLE student (
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
    status ENUM('living', 'graduated', 'leave') DEFAULT 'living' 
        COMMENT '在校住宿状态',
    FOREIGN KEY (dorm_id) REFERENCES dormitory(dorm_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. 入住历史记录表 (审计追踪)
CREATE TABLE check_in_record (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    dorm_id INT NOT NULL,
    bed_number INT,
    check_in_date DATE NOT NULL,
    check_out_date DATE,
    reason VARCHAR(50) COMMENT '操作原因: 入住/换宿/退宿',
    operator_id INT COMMENT '操作人ID',
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (dorm_id) REFERENCES dormitory(dorm_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. 报修工单表
CREATE TABLE repair (
    repair_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    dorm_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT COMMENT '故障描述',
    category VARCHAR(30) COMMENT '故障类型 (水电/家具/网络/其他)',
    status ENUM('pending', 'assigned', 'processing', 'completed', 'cancelled') 
        DEFAULT 'pending',
    assigned_to INT COMMENT '维修人员ID (关联user表)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    feedback TEXT COMMENT '学生维修后反馈',
    FOREIGN KEY (student_id) REFERENCES student(student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. 费用账单表
CREATE TABLE charge (
    charge_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    charge_type VARCHAR(20) NOT NULL COMMENT '费用类型 (住宿费/电费/水费)',
    amount DECIMAL(10,2) NOT NULL,
    charge_date DATE NOT NULL COMMENT '账单生成日期',
    due_date DATE COMMENT '缴费截止日',
    pay_status ENUM('unpaid', 'paid', 'overdue') DEFAULT 'unpaid',
    pay_date DATETIME,
    memo VARCHAR(100),
    FOREIGN KEY (student_id) REFERENCES student(student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. 系统用户表 (认证授权)
CREATE TABLE user (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt 加密存储',
    role ENUM('admin', 'student', 'repairman') NOT NULL,
    student_id INT COMMENT '若为学生角色，关联student表',
    real_name VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 四、后端 API 详细设计（FastAPI）

### 4.1 项目目录结构（推荐）

```text
dormitory-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI 应用入口
│   ├── config.py               # 配置类 (数据库连接、密钥等)
│   ├── dependencies.py         # 全局依赖注入 (如 DB Session)
│   ├── models/                 # SQLAlchemy ORM 模型
│   │   ├── building.py
│   │   ├── dormitory.py
│   │   ├── student.py
│   │   ├── repair.py
│   │   └── charge.py
│   ├── schemas/                # Pydantic 校验模型 (Request/Response)
│   │   ├── dormitory_schema.py
│   │   ├── student_schema.py
│   │   └── auth_schema.py
│   ├── crud/                   # 数据库增删改查操作函数
│   │   ├── crud_dormitory.py
│   │   └── crud_student.py
│   ├── api/                    # 路由层 (按模块拆分)
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── dormitory.py
│   │   │   │   ├── student.py
│   │   │   │   ├── repair.py
│   │   │   │   ├── charge.py
│   │   │   │   └── auth.py
│   │   │   └── __init__.py
│   └── utils/                  # 工具函数
│       ├── auth.py             # JWT 生成与验证
│       └── hash.py             # 密码加密
├── static/                     # 前端静态文件存放处 (由Nginx托管)
├── templates/                  # (可选) Jinja2 模板目录
├── .env                        # 环境变量
├── requirements.txt
└── run.py                      # 启动入口 (Uvicorn)
```

### 4.2 核心 API 端点规划

| 方法 | 端点 | 功能描述 | 权限要求 |
|------|------|----------|----------|
| POST | `/api/v1/auth/login` | 用户登录，返回 JWT Token | 公开 |
| GET | `/api/v1/dormitories` | 分页获取宿舍列表 (支持楼栋/状态筛选) | 所有已登录用户 |
| POST | `/api/v1/dormitories` | 新增宿舍房间 | 管理员 |
| PUT | `/api/v1/dormitories/{id}` | 修改宿舍信息 | 管理员 |
| GET | `/api/v1/students` | 分页获取学生列表 (支持学号/姓名搜索) | 管理员 |
| POST | `/api/v1/students/checkin` | 学生入住登记 (含床位自动分配逻辑) | 管理员 |
| POST | `/api/v1/students/checkout/{id}` | 学生退宿 (释放床位) | 管理员 |
| GET | `/api/v1/repairs` | 获取报修工单列表 (按状态筛选) | 管理员/维修员 |
| POST | `/api/v1/repairs` | 学生提交新报修申请 | 学生 (本人) |
| PUT | `/api/v1/repairs/{id}/status` | 更新工单状态 (接单/维修中/完成) | 维修员/管理员 |
| GET | `/api/v1/charges/me` | 查询当前登录学生的费用账单 | 学生 (本人) |
| GET | `/api/v1/charges/student/{id}` | 查询指定学生的所有费用 | 管理员 |
| POST | `/api/v1/charges/pay/{id}` | 标记账单为已缴纳 | 学生 (本人) |
| GET | `/api/v1/statistics/occupancy` | 获取总入住率/各楼栋统计 | 管理员 |
| GET | `/api/v1/announcements` | 获取公告列表 | 所有已登录用户 |

### 4.3 数据库连接与核心依赖代码示例

**config.py** (环境变量配置)：

```python
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "mysql+pymysql://root:123456@localhost:3306/dorm_db?charset=utf8mb4"
    )
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-me")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()
```

**main.py** (应用入口及依赖注入)：

```python
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.config import settings
from app.dependencies import get_db
from app.api.v1 import api_router

app = FastAPI(title="宿舍管理系统 API", version="1.0.0")

# 注册版本路由
app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    return {"status": "ok", "database": "connected"}
```

**dependencies.py** (数据库会话管理)：

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 4.4 Python 依赖清单 (requirements.txt)

```text
fastapi==0.115.6
uvicorn[standard]==0.34.0
sqlalchemy==2.0.36
pymysql==1.1.1
python-dotenv==1.0.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.20
pydantic-settings==2.6.0
```

---

## 五、前端页面设计方案

### 5.1 技术选型说明

由于采用前后端不分离（或半分离）模式，推荐以下两种实现路径：

- **路径A（推荐）**：采用 **纯静态 HTML + LayUI/Bootstrap**，通过 `fetch` 或 `axios` 调用后端 RESTful API 实现数据交互。静态资源全部由 Nginx 托管。
- **路径B**：采用 **FastAPI + Jinja2 模板引擎**，在后端直接渲染 HTML 页面返回，适合开发速度快但前后端耦合度稍高的场景。

### 5.2 核心页面清单

| 页面文件名 | 功能描述 |
|------------|----------|
| `login.html` | 登录/注册页面，输入用户名密码，接收 JWT Token 存入 localStorage |
| `index.html` | 后台仪表盘主页，展示总宿舍数、总人数、空房率、待处理报修数等卡片 |
| `dormitory_manage.html` | 宿舍楼栋与房间管理页面，支持搜索、新增、修改状态 (可用/维修) |
| `student_manage.html` | 学生信息管理页面，支持导入、查询、入住办理、退宿办理 |
| `checkin_form.html` | 入住办理表单页，选择楼栋-房间-床位，录入学生基本信息 |
| `repair_submit.html` | 学生端报修提交页，包含故障类型、描述、图片上传 |
| `repair_list.html` | 报修工单列表页 (管理/维修员视角)，支持状态筛选与处理操作 |
| `charge_manage.html` | 费用管理页，生成月度账单、查看缴纳状态、标记缴费 |
| `statistics.html` | 数据可视化看板，包含 ECharts 图表 (入住趋势、费用统计等) |
| `announcement.html` | 公告发布与展示页 |

### 5.3 前端与后端交互约定

- **认证方式**：所有 `/api/*` 请求在 Header 中携带 `Authorization: Bearer <JWT_TOKEN>`。
- **数据格式**：统一采用 JSON 格式进行数据交换。
- **状态码处理**：前端需统一拦截 401 (Token过期/无效) 并跳转至登录页。

```javascript
// JavaScript fetch 拦截示例
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem('access_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
        window.location.href = '/login.html';
        throw new Error('未授权，请重新登录');
    }
    return response.json();
}
```

---

## 六、Nginx 反向代理配置

在 Debian 系统中，配置文件位于 `/etc/nginx/sites-available/dormitory`，并通过软链接启用。

```nginx
server {
    listen 80;
    server_name dormitory.yourdomain.com;  # 替换为你的域名或 IP

    # 前端静态资源目录 (HTML/CSS/JS/图片)
    location / {
        root /var/www/dormitory/static;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API 动态请求反向代理至 FastAPI (默认端口 8000)
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 若上传大文件 (报修图片)，可调整超时与大小限制
        client_max_body_size 10M;
        proxy_read_timeout 60s;
    }

    # 后端健康检查路径 (可选)
    location /health {
        proxy_pass http://127.0.0.1:8000/health;
        access_log off;
    }

    # 静态资源缓存优化 (CSS/JS/图片缓存30天)
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|ttf)$ {
        root /var/www/dormitory/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

> **启用配置**：`sudo ln -s /etc/nginx/sites-available/dormitory /etc/nginx/sites-enabled/` 并执行 `sudo nginx -t` 检查语法，最后 `sudo systemctl reload nginx`。

---

## 七、Debian 12 服务器部署流程

### 7.1 基础环境准备 (一键安装)

```bash
# 更新系统软件包
sudo apt update && sudo apt upgrade -y

# 安装 Python 环境及开发工具
sudo apt install python3 python3-pip python3-venv git -y

# 安装 MySQL 数据库
sudo apt install mysql-server -y
sudo mysql_secure_installation  # 按提示设置 root 密码及安全选项

# 安装 Nginx 服务器
sudo apt install nginx -y
```

### 7.2 应用部署步骤

```bash
# 1. 创建工作目录并克隆/上传代码
sudo mkdir -p /var/www/dormitory
cd /var/www/dormitory

# 2. 创建 Python 虚拟环境并激活
python3 -m venv venv
source venv/bin/activate

# 3. 安装项目依赖
pip install -r requirements.txt

# 4. 配置环境变量 (.env 文件)
cat > .env <<EOF
DATABASE_URL=mysql+pymysql://root:你的密码@localhost:3306/dorm_db
SECRET_KEY=生成一个随机的复杂字符串
EOF

# 5. 初始化数据库 (导入 SQL 建表脚本)
mysql -u root -p < database/schema.sql

# 6. 启动测试 (开发环境验证)
uvicorn app.main:app --host 0.0.0.0 --port 8000
# 此时访问 http://服务器IP:8000/docs 可查看自动生成的 API 文档
```

### 7.3 生产环境进程守护 (Systemd 服务)

创建服务文件 `/etc/systemd/system/dormitory.service`：

```ini
[Unit]
Description=Dormitory Management FastAPI Service
After=network.target mysql.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/dormitory
Environment="PATH=/var/www/dormitory/venv/bin"
ExecStart=/var/www/dormitory/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启动与开机自启：

```bash
sudo systemctl daemon-reload
sudo systemctl start dormitory
sudo systemctl enable dormitory
sudo systemctl status dormitory  # 查看运行状态
```

---

## 八、安全加固与扩展建议

| 层面 | 建议措施 | 目的 |
|------|----------|------|
| **网络安全** | 配置 UFW 防火墙，仅开放 80(HTTP)、443(HTTPS)、22(SSH) 端口 | 减少攻击面 |
| **数据加密** | 使用 Let's Encrypt 申请 SSL 证书，Nginx 配置强制 HTTPS 跳转 | 防止中间人攻击 |
| **数据库安全** | 创建专用数据库用户 `dorm_user`，仅授予 `dorm_db` 的增删改查权限 | 权限最小化原则 |
| **密码策略** | 使用 `bcrypt` 进行密码哈希（cost=12），禁止明文存储 | 防止拖库泄露 |
| **接口防刷** | 在 Nginx 层配置 `limit_req` 限制单IP请求频率（如 10r/s） | 防止恶意暴力破解 |
| **日志监控** | 配置 FastAPI 日志输出至 `/var/log/dormitory/`，定期轮转备份 | 便于故障溯源 |

---

## 九、技术栈总览表

| 层级 | 技术组件 | 版本/说明 |
|------|----------|-----------|
| **前端框架** | HTML5 + CSS3 + Vanilla JS | 搭配 LayUI v2.8+ 或 Bootstrap v5 组件库 |
| **后端框架** | FastAPI | Python 3.10+ 异步高性能框架 |
| **数据库** | MySQL | 8.0 LTS 版本 |
| **ORM** | SQLAlchemy | 2.0 版，配合 PyMySQL 驱动 |
| **反向代理** | Nginx | 1.22+ (Debian 12 默认源) |
| **操作系统** | Debian | 12 (Bookworm) 稳定版 |
| **进程管理** | Systemd + Gunicorn | Gunicorn 作为 WSGI 服务器，UvicornWorker 作为工作进程 |
| **认证方案** | JWT (Bearer Token) | 采用 python-jose 库实现 |
| **密码加密** | Bcrypt | passlib 库实现，不可逆哈希 |
```

---

**文档版本**：V1.0  
**最后更新**：2026-07-05  
**适用场景**：高校/企业宿舍管理信息化系统建设
```