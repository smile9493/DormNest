#!/bin/bash

# DormNest 宿舍管理系统部署脚本
# 适用于 Debian 12 系统

echo "=========================================="
echo "DormNest 宿舍管理系统部署脚本"
echo "=========================================="

# 更新系统软件包
echo "1. 更新系统软件包..."
sudo apt update && sudo apt upgrade -y

# 安装基础环境
echo "2. 安装基础环境..."
sudo apt install python3 python3-pip python3-venv git -y

# 安装 MySQL
echo "3. 安装 MySQL 数据库..."
sudo apt install mysql-server -y
sudo mysql_secure_installation

# 安装 Nginx
echo "4. 安装 Nginx..."
sudo apt install nginx -y

# 创建工作目录
echo "5. 创建工作目录..."
sudo mkdir -p /var/www/dormitory
sudo chown -R $USER:$USER /var/www/dormitory

# 复制项目文件（假设当前在项目目录）
echo "6. 复制项目文件..."
cp -r . /var/www/dormitory/

# 创建虚拟环境
echo "7. 创建 Python 虚拟环境..."
cd /var/www/dormitory
python3 -m venv venv
source venv/bin/activate

# 安装依赖
echo "8. 安装项目依赖..."
pip install -r requirements.txt

# 配置环境变量
echo "9. 配置环境变量..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "请编辑 .env 文件配置数据库连接信息!"
fi

# 初始化数据库
echo "10. 初始化数据库..."
echo "请手动执行以下命令初始化数据库:"
echo "mysql -u root -p < database/schema.sql"

# 配置 Nginx
echo "11. 配置 Nginx..."
sudo cp deploy/nginx.conf /etc/nginx/sites-available/dormitory
sudo ln -sf /etc/nginx/sites-available/dormitory /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 配置 Systemd 服务
echo "12. 配置 Systemd 服务..."
sudo cp deploy/dormitory.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable dormitory
sudo systemctl start dormitory

echo "=========================================="
echo "部署完成！"
echo "=========================================="
echo ""
echo "重要提示："
echo "1. 请编辑 /var/www/dormitory/.env 配置数据库信息"
echo "2. 执行: mysql -u root -p < database/schema.sql 初始化数据库"
echo "3. 访问: http://your-domain 查看系统"
echo "4. 默认管理员账号: admin / admin123"
echo ""
echo "服务管理命令："
echo "sudo systemctl status dormitory    # 查看状态"
echo "sudo systemctl restart dormitory   # 重启服务"
echo "sudo systemctl stop dormitory      # 停止服务"
echo "==========================================