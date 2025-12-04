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
# or for development:
# docker compose exec app npx prisma migrate dev --name init
```
## Stop containers
```sh
docker compose down
```

# 🐳 Docker Hub Image
A ready-to-use image is available:
```sh
docker pull iskonplus/nodejs2025q2-service-app:latest
```

## Example run (requires external PostgreSQL):
```sh
docker run -d \
  -p 4000:4000 \
  --name home-library-app \
  --env-file .env \
  iskonplus/nodejs2025q2-service-app:latest
```
⚠ Note: During evaluation the provided docker-compose.yml is used (app + db on the same network).
The standalone image requires its own PostgreSQL instance.

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
