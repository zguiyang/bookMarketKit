#!/bin/bash

###########################################
# Configuration Variables - All configurations are defined here
###########################################

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration
DB_NAME="bookmark"

# File path configuration
DOCKER_COMPOSE_FILE="docker-compose.yaml"
DOCKER_COMPOSE_EXAMPLE="docker-compose.example.yaml"
ENV_FILE=".env"
BACKEND_ENV_FILE="backend/.env.production"
FRONTEND_ENV_FILE="apps/web/.env.production"
CREDENTIALS_FILE="bookmark-credentials.txt"

# Port configuration
BACKEND_PORT=13091
FRONTEND_PORT=13090

###########################################
# Helper Functions
###########################################

# Ask user whether to overwrite existing configuration files
ask_overwrite() {
  local file=$1
  local description=$2
  
  if [ -f "$file" ]; then
    echo -e "${YELLOW}$description already exists.${NC}"
    read -p "Overwrite? (y/n): " choice
    case "$choice" in 
      y|Y ) return 0;;
      * ) return 1;;
    esac
  else
    return 0
  fi
}

# Generate random password
generate_random_password() {
  local length=$1
  openssl rand -hex $length | tr -dc 'a-zA-Z0-9'
}

# Check if necessary dependencies are installed
check_dependencies() {
  echo -e "${BLUE}=== Book Market Kit Docker Deployment Script ===${NC}\n"
  
  # Check if Docker is installed
  if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed. Please install Docker first.${NC}"
    echo "Visit https://docs.docker.com/get-docker/ for installation guide."
    exit 1
  fi

  # Check if Docker Compose is installed
  if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed. Please install Docker Compose first.${NC}"
    echo "Visit https://docs.docker.com/compose/install/ for installation guide."
    exit 1
  fi

  echo -e "${GREEN}✓ Docker environment check passed${NC}\n"
}

# Create or update configuration file
create_or_update_file() {
  local file=$1
  local description=$2
  local content=$3
  
  if [ -f "$file" ]; then
    if ask_overwrite "$file" "$description"; then
      echo "$content" > "$file"
      echo -e "${GREEN}✓ Updated $description${NC}"
      return 0
    else
      echo -e "${YELLOW}Keeping existing $description${NC}"
      return 1
    fi
  else
    echo "$content" > "$file"
    echo -e "${GREEN}✓ Created $description${NC}"
    return 0
  fi
}

# Run dependency check
check_dependencies

# Create necessary configuration files
echo -e "${YELLOW}Preparing configuration files...${NC}"

# Copy docker-compose configuration
copy_docker_compose_file() {
  if [ -f "$DOCKER_COMPOSE_FILE" ]; then
    if ask_overwrite "$DOCKER_COMPOSE_FILE" "Docker Compose configuration file"; then
      cp "$DOCKER_COMPOSE_EXAMPLE" "$DOCKER_COMPOSE_FILE"
      echo -e "${GREEN}✓ Updated $DOCKER_COMPOSE_FILE${NC}"
    else
      echo -e "${YELLOW}Keeping existing $DOCKER_COMPOSE_FILE${NC}"
    fi
  else
    cp "$DOCKER_COMPOSE_EXAMPLE" "$DOCKER_COMPOSE_FILE"
    echo -e "${GREEN}✓ Created $DOCKER_COMPOSE_FILE${NC}"
  fi
}

# Copy docker-compose configuration file
copy_docker_compose_file

# Generate or read credentials
generate_or_read_credentials() {
  # Default credentials
  MONGO_USERNAME="root"
  
  # If keeping existing file, read passwords from it to maintain consistency
  if [ -f "$ENV_FILE" ] && ! ask_overwrite "$ENV_FILE" "Environment configuration file"; then
    # Read passwords from existing .env file
    MONGO_USERNAME=$(grep MONGO_USERNAME "$ENV_FILE" | cut -d= -f2)
    MONGO_PASSWORD=$(grep MONGO_PASSWORD "$ENV_FILE" | cut -d= -f2)
    REDIS_PASSWORD=$(grep REDIS_PASSWORD "$ENV_FILE" | cut -d= -f2)
    AUTH_SECRET=$(grep AUTH_SECRET "$ENV_FILE" | cut -d= -f2)
    echo -e "${BLUE}Read password information from existing configuration file${NC}"
    return 1
  else
    # Generate new random passwords
    MONGO_PASSWORD=$(generate_random_password 12)
    REDIS_PASSWORD=$(generate_random_password 12)
    AUTH_SECRET=$(generate_random_password 24)
    return 0
  fi
}

# Generate or read credentials
generate_or_read_credentials

# Create main environment configuration file
ENV_CONTENT="MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}
MONGO_DATABASE=${DB_NAME}
REDIS_PASSWORD=${REDIS_PASSWORD}
AUTH_SECRET=${AUTH_SECRET}"

create_or_update_file "$ENV_FILE" "Environment configuration file" "$ENV_CONTENT"

# Prepare backend environment configuration
BACKEND_ENV_CONTENT="PORT=${BACKEND_PORT}
DATABASE_URI=mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:27017/${DB_NAME}?authSource=admin
REDIS_URL=redis://redis:6379
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_DB=0
WEB_URL=http://web:${FRONTEND_PORT}
AUTH_SECRET=${AUTH_SECRET}

# If you need to use OAuth login, configure the following environment variables
# GITHUB_CLIENT_ID=your_github_client_id
# GITHUB_CLIENT_SECRET=your_github_client_secret
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret"

create_or_update_file "$BACKEND_ENV_FILE" "Backend environment configuration file" "$BACKEND_ENV_CONTENT"

# Prepare frontend environment configuration
FRONTEND_ENV_CONTENT="# Frontend Docker Environment Variables

# API URL - Browser accesses backend API through localhost
NEXT_PUBLIC_API_URL=http://localhost:${BACKEND_PORT}

# External access uses localhost
NEXT_PUBLIC_WEB_URL=http://localhost:${FRONTEND_PORT}"

create_or_update_file "$FRONTEND_ENV_FILE" "Frontend environment configuration file" "$FRONTEND_ENV_CONTENT"

# Save credentials to file
CREDENTIALS_CONTENT="=== Book Market Kit Credentials Information ===

MongoDB:
  Username: ${MONGO_USERNAME}
  Password: ${MONGO_PASSWORD}
  Database: ${DB_NAME}

Redis:
  Password: ${REDIS_PASSWORD}

Authentication Key:
  AUTH_SECRET: ${AUTH_SECRET}

Please keep this file safe!"

create_or_update_file "$CREDENTIALS_FILE" "Credentials information file" "$CREDENTIALS_CONTENT"

# Display deployment success information
show_success_info() {
  echo -e "\n${GREEN}=== Deployment Successful! ===${NC}"
  echo -e "Application access addresses:"
  echo -e "  Frontend: http://localhost:${FRONTEND_PORT}"
  echo -e "  Backend: http://localhost:${BACKEND_PORT}"
  echo -e "\nDatabase credentials:"
  echo -e "  MongoDB username: ${MONGO_USERNAME}"
  echo -e "  MongoDB password: ${MONGO_PASSWORD}"
  echo -e "  MongoDB database: ${DB_NAME}"
  echo -e "  Redis password: ${REDIS_PASSWORD}"
  echo -e "  AUTH_SECRET: ${AUTH_SECRET}"
  echo -e "\nCredentials have been saved to ${CREDENTIALS_FILE} file"
  echo -e "\nCommon commands:"
  echo -e "  View container status: docker-compose ps"
  echo -e "  View logs: docker-compose logs"
  echo -e "  Stop services: docker-compose down"
  echo -e "  Restart services: docker-compose restart"
}

# Display deployment failure information
show_failure_info() {
  echo -e "\n${RED}Deployment failed, please check logs for details.${NC}"
  echo -e "Use 'docker-compose logs' to view detailed logs."
  exit 1
}

echo -e "\n${BLUE}=== Starting to build and launch services ===${NC}"
echo -e "${YELLOW}This may take a few minutes, please wait patiently...${NC}"

# Export port variables for docker-compose to use
export FRONTEND_PORT=${FRONTEND_PORT}
export BACKEND_PORT=${BACKEND_PORT}

# Start services
docker-compose up -d --build

# Check if services started successfully
if [ $? -eq 0 ]; then
  show_success_info
else
  show_failure_info
fi