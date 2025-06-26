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
ENV_FILE=".env"
BACKEND_ENV_FILE="backend/.env.production"
FRONTEND_ENV_FILE="apps/web/.env.production"
BACKEND_ENV_EXAMPLE="backend/.env.example"
FRONTEND_ENV_EXAMPLE="apps/web/.env.example"
CREDENTIALS_FILE="bookmark-credentials.txt"

# Port configuration
BACKEND_PORT=13091
FRONTEND_PORT=13090
NGINX_PORT=13092

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

# Check if docker-compose.yaml exists
if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
  echo -e "${RED}Error: $DOCKER_COMPOSE_FILE does not exist. Please make sure it's available in the project root.${NC}"
  exit 1
fi

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

# Create environment files from example files
create_env_file_from_example() {
  local example_file=$1
  local target_file=$2
  local description=$3
  local env_vars=$4

  # Check if example file exists
  if [ ! -f "$example_file" ]; then
    echo -e "${RED}Error: Example file $example_file does not exist.${NC}"
    exit 1
  fi

  # Create a temporary file with variables replaced
  local temp_file=$(mktemp)

  # Copy the example file to temp file
  cp "$example_file" "$temp_file"

  # Replace placeholders with actual values
  for var in $env_vars; do
    var_name=$(echo $var | cut -d= -f1)
    var_value=$(echo $var | cut -d= -f2-)

    # Replace placeholders in the format <placeholder> with actual values
    sed -i.bak "s|<$var_name>|$var_value|g" "$temp_file"

    # Also set environment variables directly
    if grep -q "^$var_name=" "$temp_file"; then
      sed -i.bak "s|^$var_name=.*|$var_name=$var_value|g" "$temp_file"
    fi
  done

  # Remove backup files created by sed
  rm -f "$temp_file.bak"

  # Copy to target location
  if [ -f "$target_file" ]; then
    if ask_overwrite "$target_file" "$description"; then
      cp "$temp_file" "$target_file"
      echo -e "${GREEN}✓ Updated $description${NC}"
    else
      echo -e "${YELLOW}Keeping existing $description${NC}"
    fi
  else
    cp "$temp_file" "$target_file"
    echo -e "${GREEN}✓ Created $description${NC}"
  fi

  # Remove temporary file
  rm "$temp_file"
}

# Create environment files from example files
BACKEND_ENV_VARS="PORT=$BACKEND_PORT DATABASE_URI=mongodb://$MONGO_USERNAME:$MONGO_PASSWORD@mongo:27017/$DB_NAME?authSource=admin REDIS_PASSWORD=$REDIS_PASSWORD AUTH_SECRET=$AUTH_SECRET"
create_env_file_from_example "$BACKEND_ENV_EXAMPLE" "$BACKEND_ENV_FILE" "Backend environment configuration file" "$BACKEND_ENV_VARS"

FRONTEND_ENV_VARS="NEXT_PUBLIC_WEB_URL=http://localhost:$NGINX_PORT NEXT_PUBLIC_API_URL=http://localhost:$NGINX_PORT NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:$NGINX_PORT"
create_env_file_from_example "$FRONTEND_ENV_EXAMPLE" "$FRONTEND_ENV_FILE" "Frontend environment configuration file" "$FRONTEND_ENV_VARS"

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

# Display configuration success information
show_success_info() {
  echo -e "\n${GREEN}=== Configuration Information ===${NC}"
  echo -e "After configuring the environment files and starting the application, you can access it at:"
  echo -e "  Web Application: http://localhost:${NGINX_PORT}"
  echo -e "\nDatabase credentials:"
  echo -e "  MongoDB username: ${MONGO_USERNAME}"
  echo -e "  MongoDB password: ${MONGO_PASSWORD}"
  echo -e "  MongoDB database: ${DB_NAME}"
  echo -e "  Redis password: ${REDIS_PASSWORD}"
  echo -e "  AUTH_SECRET: ${AUTH_SECRET}"
  echo -e "\nCredentials have been saved to ${CREDENTIALS_FILE} file"
  echo -e "\n${YELLOW}Important:${NC} Remember to configure the generated environment files before starting the application:"
  echo -e "  - ${BLUE}backend/.env.production${NC}: Configure OAuth credentials and other backend settings"
  echo -e "  - ${BLUE}apps/web/.env.production${NC}: Configure frontend settings if needed"
  echo -e "\nCommon docker-compose commands:"
  echo -e "  Start services: docker-compose up -d"
  echo -e "  View container status: docker-compose ps"
  echo -e "  View logs: docker-compose logs"
  echo -e "  Stop services: docker-compose down"
  echo -e "  Restart services: docker-compose restart"
}


echo -e "\n${GREEN}=== Configuration completed successfully! ===${NC}"
echo -e "${YELLOW}Before starting the application, please review and configure the generated environment files:${NC}"
echo -e "  ${BLUE}backend/.env.production${NC} - Configure OAuth credentials and other backend settings"
echo -e "  ${BLUE}apps/web/.env.production${NC} - Configure frontend settings if needed"
echo -e "\n${YELLOW}After configuring the environment files, start the application with:${NC}"
echo -e "  docker-compose up -d --build"

# Show success info
show_success_info
