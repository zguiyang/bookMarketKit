#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 询问用户是否覆盖已存在的配置文件
ask_overwrite() {
  local file=$1
  local description=$2
  
  if [ -f "$file" ]; then
    echo -e "${YELLOW}$description 已存在。${NC}"
    read -p "是否覆盖? (y/n): " choice
    case "$choice" in 
      y|Y ) return 0;;
      * ) return 1;;
    esac
  else
    return 0
  fi
}

echo -e "${BLUE}=== Book Market Kit Docker 部署脚本 ===${NC}\n"

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装。请先安装 Docker。${NC}"
    echo "访问 https://docs.docker.com/get-docker/ 获取安装指南。"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}错误: Docker Compose 未安装。请先安装 Docker Compose。${NC}"
    echo "访问 https://docs.docker.com/compose/install/ 获取安装指南。"
    exit 1
fi

echo -e "${GREEN}✓ Docker 环境检查通过${NC}\n"

# 创建必要的配置文件
echo -e "${YELLOW}正在准备配置文件...${NC}"

# 复制 docker-compose 配置
if [ -f "docker-compose.yaml" ]; then
    if ask_overwrite "docker-compose.yaml" "docker-compose.yaml 配置文件"; then
        cp docker-compose.example.yaml docker-compose.yaml
        echo -e "${GREEN}✓ 已更新 docker-compose.yaml${NC}"
    else
        echo -e "${YELLOW}保留现有 docker-compose.yaml${NC}"
    fi
else
    cp docker-compose.example.yaml docker-compose.yaml
    echo -e "${GREEN}✓ 已创建 docker-compose.yaml${NC}"
fi

# 生成随机密码（只包含字母和数字）
MONGO_PASSWORD=$(openssl rand -hex 12 | tr -dc 'a-zA-Z0-9')
MONGO_USERNAME="root"
REDIS_PASSWORD=$(openssl rand -hex 12 | tr -dc 'a-zA-Z0-9')
AUTH_SECRET=$(openssl rand -hex 24 | tr -dc 'a-zA-Z0-9')

# 创建 .env 文件
if [ -f ".env" ]; then
    if ask_overwrite ".env" ".env 配置文件"; then
        cat > .env << EOL
MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}
MONGO_DATABASE=bookmark
REDIS_PASSWORD=${REDIS_PASSWORD}
AUTH_SECRET=${AUTH_SECRET}
EOL
        echo -e "${GREEN}✓ 已更新 .env 文件${NC}"
    else
        echo -e "${YELLOW}保留现有 .env 文件${NC}"
        # 如果保留现有文件，需要从中读取密码以保持一致性
        if [ -f ".env" ]; then
            # 从现有的.env文件中读取密码
            MONGO_USERNAME=$(grep MONGO_USERNAME .env | cut -d= -f2)
            MONGO_PASSWORD=$(grep MONGO_PASSWORD .env | cut -d= -f2)
            REDIS_PASSWORD=$(grep REDIS_PASSWORD .env | cut -d= -f2)
            AUTH_SECRET=$(grep AUTH_SECRET .env | cut -d= -f2)
            echo -e "${BLUE}已从现有配置文件读取密码信息${NC}"
        fi
    fi
else
    cat > .env << EOL
MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}
MONGO_DATABASE=bookmark
REDIS_PASSWORD=${REDIS_PASSWORD}
AUTH_SECRET=${AUTH_SECRET}
EOL
    echo -e "${GREEN}✓ 已创建 .env 文件${NC}"
fi

# 准备后端环境配置
if [ -f "backend/.env.docker" ]; then
    if ask_overwrite "backend/.env.docker" "后端环境配置文件"; then
        cat > backend/.env.docker << EOL
PORT=8000
DATABASE_URI=mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:27017/bookmark?authSource=admin
REDIS_URL=redis://redis:6379
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_DB=0
WEB_URL=http://web:3000
AUTH_SECRET=${AUTH_SECRET}

# 如需使用 OAuth 登录，请配置以下环境变量
# GITHUB_CLIENT_ID=your_github_client_id
# GITHUB_CLIENT_SECRET=your_github_client_secret
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
EOL
        echo -e "${GREEN}✓ 已更新后端环境配置${NC}"
    else
        echo -e "${YELLOW}保留现有后端环境配置${NC}"
    fi
else
    cat > backend/.env.docker << EOL
PORT=8000
DATABASE_URI=mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:27017/bookmark?authSource=admin
REDIS_URL=redis://redis:6379
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_DB=0
WEB_URL=http://web:3000
AUTH_SECRET=${AUTH_SECRET}

# 如需使用 OAuth 登录，请配置以下环境变量
# GITHUB_CLIENT_ID=your_github_client_id
# GITHUB_CLIENT_SECRET=your_github_client_secret
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
EOL
    echo -e "${GREEN}✓ 已创建后端环境配置${NC}"
fi

# 准备前端环境配置
if [ -f "apps/web/.env.docker" ]; then
    if ask_overwrite "apps/web/.env.docker" "前端环境配置文件"; then
        cat > apps/web/.env.docker << EOL
# Frontend Docker Environment Variables

# API URL - 浏览器通过localhost访问后端API
NEXT_PUBLIC_API_URL=http://localhost:8000

# 外部访问使用localhost
NEXT_PUBLIC_WEB_URL=http://localhost:3000
EOL
        echo -e "${GREEN}✓ 已更新前端环境配置${NC}"
    else
        echo -e "${YELLOW}保留现有前端环境配置${NC}"
    fi
else
    cat > apps/web/.env.docker << EOL
# Frontend Docker Environment Variables

# API URL - 浏览器通过localhost访问后端API
NEXT_PUBLIC_API_URL=http://localhost:8000

# 外部访问使用localhost
NEXT_PUBLIC_WEB_URL=http://localhost:3000
EOL
    echo -e "${GREEN}✓ 已创建前端环境配置${NC}"
fi

# 保存凭据到文件
if [ -f "bookmark-credentials.txt" ]; then
    if ask_overwrite "bookmark-credentials.txt" "凭据信息文件"; then
        cat > bookmark-credentials.txt << EOL
=== Book Market Kit 凭据信息 ===

MongoDB:
  用户名: ${MONGO_USERNAME}
  密码: ${MONGO_PASSWORD}
  数据库: bookmark

Redis:
  密码: ${REDIS_PASSWORD}

认证密钥:
  AUTH_SECRET: ${AUTH_SECRET}

请妥善保管此文件！
EOL
        echo -e "${GREEN}✓ 已更新凭据信息${NC}"
    else
        echo -e "${YELLOW}保留现有凭据信息${NC}"
    fi
else
    cat > bookmark-credentials.txt << EOL
=== Book Market Kit 凭据信息 ===

MongoDB:
  用户名: ${MONGO_USERNAME}
  密码: ${MONGO_PASSWORD}
  数据库: bookmark

Redis:
  密码: ${REDIS_PASSWORD}

认证密钥:
  AUTH_SECRET: ${AUTH_SECRET}

请妥善保管此文件！
EOL
    echo -e "${GREEN}✓ 已保存凭据到 bookmark-credentials.txt${NC}"
fi

echo -e "\n${BLUE}=== 开始构建和启动服务 ===${NC}"
echo -e "${YELLOW}这可能需要几分钟时间，请耐心等待...${NC}"

# 启动服务
docker-compose up -d --build

# 检查服务是否成功启动
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}=== 部署成功! ===${NC}"
    echo -e "应用访问地址:"
    echo -e "  前端: http://localhost:3000"
    echo -e "  后端: http://localhost:8000"
    echo -e "\n数据库凭据:"
    echo -e "  MongoDB Root 密码: ${MONGO_PASSWORD}"
    echo -e "  MongoDB 数据库: bookmark"
    echo -e "  Redis 密码: ${REDIS_PASSWORD}"
    echo -e "  AUTH_SECRET: ${AUTH_SECRET}"
    echo -e "\n凭据已保存到 bookmark-credentials.txt 文件"
    echo -e "\n常用命令:"
    echo -e "  查看容器状态: docker-compose ps"
    echo -e "  查看日志: docker-compose logs"
    echo -e "  停止服务: docker-compose down"
    echo -e "  重启服务: docker-compose restart"
else
    echo -e "\n${RED}部署失败，请检查日志获取详细信息。${NC}"
    echo -e "使用 'docker-compose logs' 查看详细日志。"
    exit 1
fi