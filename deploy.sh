#!/bin/bash

###########################################
# 配置变量 - 所有配置集中在此处定义
###########################################

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 数据库配置
DB_NAME="bookmark"

# 文件路径配置
DOCKER_COMPOSE_FILE="docker-compose.yaml"
DOCKER_COMPOSE_EXAMPLE="docker-compose.example.yaml"
ENV_FILE=".env"
BACKEND_ENV_FILE="backend/.env.deploy"
FRONTEND_ENV_FILE="apps/web/.env.deploy"
CREDENTIALS_FILE="bookmark-credentials.txt"

# 端口配置
BACKEND_PORT=13091
FRONTEND_PORT=13090

###########################################
# 辅助函数
###########################################

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

# 生成随机密码
generate_random_password() {
  local length=$1
  openssl rand -hex $length | tr -dc 'a-zA-Z0-9'
}

# 检查必要的依赖是否安装
check_dependencies() {
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
}

# 创建或更新配置文件
create_or_update_file() {
  local file=$1
  local description=$2
  local content=$3
  
  if [ -f "$file" ]; then
    if ask_overwrite "$file" "$description"; then
      echo "$content" > "$file"
      echo -e "${GREEN}✓ 已更新 $description${NC}"
      return 0
    else
      echo -e "${YELLOW}保留现有 $description${NC}"
      return 1
    fi
  else
    echo "$content" > "$file"
    echo -e "${GREEN}✓ 已创建 $description${NC}"
    return 0
  fi
}

# 运行依赖检查
check_dependencies

# 创建必要的配置文件
echo -e "${YELLOW}正在准备配置文件...${NC}"

# 复制 docker-compose 配置
copy_docker_compose_file() {
  if [ -f "$DOCKER_COMPOSE_FILE" ]; then
    if ask_overwrite "$DOCKER_COMPOSE_FILE" "Docker Compose 配置文件"; then
      cp "$DOCKER_COMPOSE_EXAMPLE" "$DOCKER_COMPOSE_FILE"
      echo -e "${GREEN}✓ 已更新 $DOCKER_COMPOSE_FILE${NC}"
    else
      echo -e "${YELLOW}保留现有 $DOCKER_COMPOSE_FILE${NC}"
    fi
  else
    cp "$DOCKER_COMPOSE_EXAMPLE" "$DOCKER_COMPOSE_FILE"
    echo -e "${GREEN}✓ 已创建 $DOCKER_COMPOSE_FILE${NC}"
  fi
}

# 复制 docker-compose 配置文件
copy_docker_compose_file

# 生成或读取凭据
generate_or_read_credentials() {
  # 默认凭据
  MONGO_USERNAME="root"
  
  # 如果保留现有文件，从中读取密码以保持一致性
  if [ -f "$ENV_FILE" ] && ! ask_overwrite "$ENV_FILE" "环境配置文件"; then
    # 从现有的.env文件中读取密码
    MONGO_USERNAME=$(grep MONGO_USERNAME "$ENV_FILE" | cut -d= -f2)
    MONGO_PASSWORD=$(grep MONGO_PASSWORD "$ENV_FILE" | cut -d= -f2)
    REDIS_PASSWORD=$(grep REDIS_PASSWORD "$ENV_FILE" | cut -d= -f2)
    AUTH_SECRET=$(grep AUTH_SECRET "$ENV_FILE" | cut -d= -f2)
    echo -e "${BLUE}已从现有配置文件读取密码信息${NC}"
    return 1
  else
    # 生成新的随机密码
    MONGO_PASSWORD=$(generate_random_password 12)
    REDIS_PASSWORD=$(generate_random_password 12)
    AUTH_SECRET=$(generate_random_password 24)
    return 0
  fi
}

# 生成或读取凭据
generate_or_read_credentials

# 创建主环境配置文件
ENV_CONTENT="MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}
MONGO_DATABASE=${DB_NAME}
REDIS_PASSWORD=${REDIS_PASSWORD}
AUTH_SECRET=${AUTH_SECRET}"

create_or_update_file "$ENV_FILE" "环境配置文件" "$ENV_CONTENT"

# 准备后端环境配置
BACKEND_ENV_CONTENT="PORT=${BACKEND_PORT}
DATABASE_URI=mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:27017/${DB_NAME}?authSource=admin
REDIS_URL=redis://redis:6379
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_DB=0
WEB_URL=http://web:${FRONTEND_PORT}
AUTH_SECRET=${AUTH_SECRET}

# 如需使用 OAuth 登录，请配置以下环境变量
# GITHUB_CLIENT_ID=your_github_client_id
# GITHUB_CLIENT_SECRET=your_github_client_secret
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret"

create_or_update_file "$BACKEND_ENV_FILE" "后端环境配置文件" "$BACKEND_ENV_CONTENT"

# 准备前端环境配置
FRONTEND_ENV_CONTENT="# Frontend Docker Environment Variables

# API URL - 浏览器通过localhost访问后端API
NEXT_PUBLIC_API_URL=http://localhost:${BACKEND_PORT}

# 外部访问使用localhost
NEXT_PUBLIC_WEB_URL=http://localhost:${FRONTEND_PORT}"

create_or_update_file "$FRONTEND_ENV_FILE" "前端环境配置文件" "$FRONTEND_ENV_CONTENT"

# 保存凭据到文件
CREDENTIALS_CONTENT="=== Book Market Kit 凭据信息 ===

MongoDB:
  用户名: ${MONGO_USERNAME}
  密码: ${MONGO_PASSWORD}
  数据库: ${DB_NAME}

Redis:
  密码: ${REDIS_PASSWORD}

认证密钥:
  AUTH_SECRET: ${AUTH_SECRET}

请妥善保管此文件！"

create_or_update_file "$CREDENTIALS_FILE" "凭据信息文件" "$CREDENTIALS_CONTENT"

# 显示部署成功信息
show_success_info() {
  echo -e "\n${GREEN}=== 部署成功! ===${NC}"
  echo -e "应用访问地址:"
  echo -e "  前端: http://localhost:${FRONTEND_PORT}"
  echo -e "  后端: http://localhost:${BACKEND_PORT}"
  echo -e "\n数据库凭据:"
  echo -e "  MongoDB 用户名: ${MONGO_USERNAME}"
  echo -e "  MongoDB 密码: ${MONGO_PASSWORD}"
  echo -e "  MongoDB 数据库: ${DB_NAME}"
  echo -e "  Redis 密码: ${REDIS_PASSWORD}"
  echo -e "  AUTH_SECRET: ${AUTH_SECRET}"
  echo -e "\n凭据已保存到 ${CREDENTIALS_FILE} 文件"
  echo -e "\n常用命令:"
  echo -e "  查看容器状态: docker-compose ps"
  echo -e "  查看日志: docker-compose logs"
  echo -e "  停止服务: docker-compose down"
  echo -e "  重启服务: docker-compose restart"
}

# 显示部署失败信息
show_failure_info() {
  echo -e "\n${RED}部署失败，请检查日志获取详细信息。${NC}"
  echo -e "使用 'docker-compose logs' 查看详细日志。"
  exit 1
}

echo -e "\n${BLUE}=== 开始构建和启动服务 ===${NC}"
echo -e "${YELLOW}这可能需要几分钟时间，请耐心等待...${NC}"

# 导出端口变量，使docker-compose可以使用
export FRONTEND_PORT=${FRONTEND_PORT}
export BACKEND_PORT=${BACKEND_PORT}

# 启动服务
docker-compose up -d --build

# 检查服务是否成功启动
if [ $? -eq 0 ]; then
  show_success_info
else
  show_failure_info
fi