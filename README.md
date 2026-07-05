# DormNest - 宿舍管理系统

## 项目简介

DormNest 是一个基于 Web 的宿舍管理系统，旨在为高校或企业提供宿舍信息化管理解决方案。系统支持宿舍资源管理、学生入住退宿管理、费用核算、报修工单处理等核心功能。

## 技术栈

- **后端**: Python FastAPI
- **数据库**: MySQL 8.0
- **前端**: HTML5 + CSS3 + JavaScript (LayUI/Bootstrap)
- **反向代理**: Nginx
- **操作系统**: Debian 12

## 核心功能

### 1. 用户角色与权限
- **系统管理员**: 系统全维度运维与管理
- **学生**: 个人住宿信息查看与日常操作
- **维修人员**: 接收并处理报修工单

### 2. 功能模块
- **宿舍资源管理**: 楼栋/房间的增删改查，房间状态实时更新
- **入住与退宿管理**: 学生入住登记、换宿申请、退宿销户
- **费用核算系统**: 住宿费/水电费月度核算，在线缴纳
- **智能报修工单**: 学生提报故障 → 维修人员处理 → 完成反馈
- **公告通知中心**: 管理员发布重要通知
- **数据统计看板**: 入住率、空房数、报修完成率等可视化报表

## 项目结构

```
DormNest/
├── doc/                    # 项目文档
│   └── sheji.md           # 详细设计方案
├── app/                   # 后端应用代码 (待实现)
├── static/                # 前端静态资源 (待实现)
└── README.md              # 项目说明文档
```

## 快速开始

### 环境要求
- Python 3.10+
- MySQL 8.0+
- Nginx 1.22+

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/smile9493/DormNest.git
cd DormNest
```

2. 安装依赖
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

4. 初始化数据库
```bash
mysql -u root -p < database/schema.sql
```

5. 启动服务
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

访问 `http://localhost:8000` 即可查看系统。

## 详细文档

完整的系统设计方案请查看 [doc/sheji.md](./doc/sheji.md)，包含：
- 系统架构设计
- 数据库设计
- API 接口设计
- 前端页面设计
- 部署指南
- 安全加固建议

## 开发状态

🚧 项目正在开发中...

## 许可证

MIT License

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 联系方式

项目维护者: [@smile9493](https://github.com/smile9493)