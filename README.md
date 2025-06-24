# Bookmark

> 🚀 A modern open-source intelligent bookmark management platform, built with Next.js & NestJS.

[中文版](./README.zh.md)

---

## Product Screenshots

> The following are sample UI screenshots

![Home Screenshot 1](https://pic1.imgdb.cn/item/6810b45c58cb8da5c8d45ebc.png)

![Home Screenshot 2](https://pic1.imgdb.cn/item/6810b45c58cb8da5c8d45ebd.png)

---

## Overview

Book Market Kit is a full-stack solution for web bookmark collection, smart categorization, and content summarization. It integrates AI-powered categorization, content summarization, tag-based filtering, and more, helping users efficiently manage and discover valuable web content.

---

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Zustand, Zod
- **Backend**: Fastify 5, TypeScript, MongoDB (mongoose), Redis, Zod

---

## Key Features

- **Smart Bookmark Management**: Save web bookmarks with one click and auto-categorize
- **AI Categorization**: AI analyzes bookmark content and recommends categories
- **Content Summarization**: AI generates summaries for web content and extracts key information
- **Tag System**: Add multiple tags to bookmarks for easy filtering
- **Global Search**: Fuzzy search bookmarks, tags, and categories by name
- **Category Management**: Custom categories with add, edit, and delete
- **Responsive Design**: Works seamlessly on desktop and mobile

---

## Development Progress (TODO)

- [x] Smart bookmark management
- [x] Tag system
- [x] Responsive UI
- [x] Batch import/export bookmarks
- [ ] AI-powered categorization
- [ ] Content summarization

---

## Getting Started

### Option 1: Docker One-Click Deployment

For the easiest setup experience, use our Docker one-click deployment:

1. **Prerequisites**

   - Docker and Docker Compose installed on your system
   - Git to clone the repository

2. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/bookMarketKit.git
   cd bookMarketKit
   ```

3. **Run the deployment script**

   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Access the application**
   - Frontend: http://localhost:13090
   - Backend API: http://localhost:13091

> The deployment script will automatically generate secure passwords for MongoDB and Redis, and will save these credentials to a file named `bookmark-credentials.txt` for your reference.
>
> **IMPORTANT SECURITY NOTE**: The `bookmark-credentials.txt` file contains sensitive information including database credentials and authentication secrets. This file is automatically added to `.gitignore` to prevent accidental commits. You should:
>
> - Keep a secure backup of this file
> - Never commit this file to version control
> - Restrict access to this file on your server
> - Consider using a password manager for production credentials

#### Docker Deployment Details

##### Configuration Files

- `docker-compose.example.yaml`: Template configuration file
- `Dockerfile`: Unified multi-stage Dockerfile for the entire Monorepo project
- `apps/web/.env.deploy`: Frontend environment variables
- `backend/.env.deploy`: Backend environment variables

##### Customizable Variables

The following variables can be customized in the deployment script (`deploy.sh`):

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `DB_NAME` | `bookmark` | MongoDB database name |
| `DOCKER_COMPOSE_FILE` | `docker-compose.yaml` | Docker Compose configuration file name |
| `DOCKER_COMPOSE_EXAMPLE` | `docker-compose.example.yaml` | Template Docker Compose file |
| `ENV_FILE` | `.env` | Main environment variables file |
| `BACKEND_ENV_FILE` | `backend/.env.deploy` | Backend environment configuration file |
| `FRONTEND_ENV_FILE` | `apps/web/.env.deploy` | Frontend environment configuration file |
| `CREDENTIALS_FILE` | `bookmark-credentials.txt` | File to store generated credentials |
| `BACKEND_PORT` | `13091` | Backend service port |
| `FRONTEND_PORT` | `13090` | Frontend service port |

You can modify these variables directly in the `deploy.sh` file before running it, or override the port variables using environment variables as described in the [Customizing Ports](#customizing-ports) section.

##### Monorepo Architecture and Docker Build

This project uses a Monorepo architecture with a unified Docker build process:

- The unified `Dockerfile` handles building shared packages, frontend, and backend in a single build process
- Multi-stage builds are used to create optimized production images
- Shared packages in the `packages/` directory are built first and then used by both frontend and backend

##### Data Persistence

Application data is stored in Docker volumes:

- `mongo-data`: MongoDB data
- `redis-data`: Redis data
- `backend-uploads`: Uploaded files

##### Production Deployment Considerations

1. **Security**:

   - Change all default passwords
   - Consider using Docker Secrets for sensitive information
   - Restrict container network access

2. **Performance**:

   - Adjust container resource limits based on server capacity
   - Use production-grade configurations for MongoDB and Redis

3. **Reliability**:

   - Set up container health checks
   - Configure automatic restart policies
   - Implement backup strategies

4. **HTTPS**:
   - Configure HTTPS in production environments
   - Consider using Nginx as a reverse proxy with SSL

### Option 2: Manual Development Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start development**

   ```bash
   # Start both frontend and backend
   pnpm dev

   # Frontend only
   pnpm web:dev

   # Backend only
   pnpm backend:dev
   ```

3. **Build & Production**
   ```bash
   pnpm build
   pnpm start
   ```

---

## Docker Management Commands

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down

# View logs
docker-compose logs -f

# Restart a specific service
docker-compose restart [service_name]

# Rebuild and start services
docker-compose up -d --build

# Stop and remove volumes (will delete all data!)
docker-compose down -v
```

### Customizing Ports

You can customize the ports used by the application:

1. **Using environment variables during deployment**:

   ```bash
   # Example: Use custom ports
   FRONTEND_PORT=4000 BACKEND_PORT=9000 ./deploy.sh
   ```

2. **Manually editing configuration files**:
   - Edit port values in `deploy.sh`
   - Update port mappings in `docker-compose.yaml`
   - Update environment variables in `.env.deploy` files

### Troubleshooting

- **Container fails to start**: Check logs with `docker-compose logs [service_name]`
- **Database connection issues**: Verify environment variables in `.env` and `.env.deploy` files
- **Port conflicts**: Change port mappings in `docker-compose.yaml` if ports are already in use, or use the environment variables as described above

---

## Contributing

We welcome community contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

[ISC](./LICENSE)
