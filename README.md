# Home Library Service

A REST API for managing a “home library”: users, artists, albums, tracks, and favorites.

Tech stack: **Node.js 24**, **NestJS**, **PostgreSQL**, **Prisma**, **Docker**.

---

## Requirements

- Node.js ≥ 24.x  
- npm ≥ 10  
- Docker & Docker Compose  

---
# Before start
Copy `.env.example` → `.env` before running.
```sh
npm install
```

# 🚀 Running the Application (Docker — REQUIRED for database)

This is the **main and correct** way to run the project.  
PostgreSQL and Prisma migrations are executed **only inside Docker**.

### Build and start containers
Start docker app before
```sh
docker compose build
docker compose up -d
```
The application will be available at:
	•	API: http://localhost:4000
	•	Swagger: http://localhost:4000/doc

## Run Prisma migrations
```sh
docker compose exec app npx prisma migrate deploy
```
## Stop containers
```sh
docker compose down
```

# 🐳 Docker Hub Image
### 1. A ready-to-use image is available:
```sh
docker pull iskonplus/nodejs2025q2-service-app:latest
```

### 2. Create a shared network
```sh
docker network create home-library-network
```
### 3. Run PostgreSQL
```sh
docker run -d \
  --name home-library-db \
  --network home-library-network \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=home_library \
  -v home_library_pgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:16-alpine
```
### 4. Run app from Docker Hub
```sh
docker run -d \
  --name home-library-app \
  --network home-library-network \
  -p 4000:4000 \
  -e DATABASE_URL="postgresql://postgres:postgres@home-library-db:5432/home_library?schema=public" \
  iskonplus/nodejs2025q2-service-app:latest
```

### 5. Apply migrations (required!)
```sh
docker exec home-library-app npx prisma migrate deploy
```
⚠ Note:
⚠ The API works here:
👉 http://localhost:4000
👉 Swagger: http://localhost:4000/doc


# 📜 npm Scripts
Script						Description
---
npm run start:dev			Run NestJS in dev mode (no DB)
npm run build				Build the application
npm run start:prod			Run compiled app
npm test					Run tests
npm run lint				Run linter
npm run audit				Security audit

# 🧪 Testing
Before running tests, start Docker containers:
```sh
docker compose up -d
docker compose exec app npx prisma migrate deploy
npm test
```
