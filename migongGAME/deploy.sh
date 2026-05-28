#!/bin/bash
set -e

echo "=== 校园迷宫奇遇记 - 部署脚本 ==="

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "[ERROR] 未安装 Docker，请先安装 Docker"
    echo "  Ubuntu: sudo apt install docker.io docker-compose-v2"
    echo "  CentOS: sudo yum install docker docker-compose"
    exit 1
fi

# Start Docker if not running
if ! docker info &> /dev/null; then
    echo "[INFO] 启动 Docker..."
    sudo systemctl start docker
fi

# Check .env
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "[WARN] .env 文件不存在！"
        echo "请先创建 .env 文件："
        echo "  cp .env.example .env"
        echo "  vim .env   # 填入你的 MONGO_URI"
        exit 1
    fi
fi

# Build and start
echo "[INFO] 构建并启动服务..."
docker compose up -d --build

# Wait for readiness
echo "[INFO] 等待服务启动..."
sleep 5

# Check health
if docker compose ps | grep -q "Up"; then
    echo ""
    echo "=== 部署完成 ==="
    echo "前端: http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_IP')"
    echo "后端: http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_IP'):3001/api"
    echo ""
    echo "查看日志: docker compose logs -f"
    echo "停止服务: docker compose down"
else
    echo "[ERROR] 服务未正常启动，检查日志:"
    docker compose logs --tail=30
fi
