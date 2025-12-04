# Home Library Service

A REST service for managing a “home library”: users, artists, albums, tracks, and favorites.

Tech stack: **Node.js 24**, **NestJS**, **PostgreSQL**, **Prisma**, **Docker**.

---

## Requirements

- Node.js >= 24.x  
- npm >= 10  
- Docker + Docker Compose  

## Rename `.env.example` `.env`
## Running locally (without Docker)
### install dependencies
```
npm install
```

### generate Prisma client
```
npx prisma generate
```

### apply database migrations in dev mode
```
npx prisma migrate dev --name init
```

### start application
```
npm run start:dev
```

The application will be available at:
	•	API root: http://localhost:4000
	•	Swagger documentation: http://localhost:4000/doc

## Running in Docker
### Build and start containers:
```
docker compose build
docker compose up -d
```	

The application will be available at:
	•	API: http://localhost:4000
	•	Swagger: http://localhost:4000/doc

### Apply migrations inside the app container:
```
docker compose exec app npx prisma migrate deploy
# or for development:
docker compose exec app npx prisma migrate dev --name init
```
### Stop containers:
```
docker compose down
```

## Docker Hub
### A ready-to-use image is available on Docker Hub:
```
docker pull iskonplus/nodejs2025q2-service-app:latest
```
### Example run:
```
docker run -d \
  -p 4000:4000 \
  --name home-library-app \
  --env-file .env \
  iskonplus/nodejs2025q2-service-app:latest
```
Note: The app container requires PostgreSQL.
During evaluation, the provided docker-compose.yml is used (app + db on the same network).

## npm Scripts
	•	npm run start:dev — start NestJS in development mode
	•	npm run build — build the application
	•	npm run start:prod — run compiled application (node dist/main)
	•	npm test — run tests
	•	npm run lint — run linter
	•	npm run audit — check package vulnerabilities

## Testing
```
npm test
```
All tests should pass both locally and when using Docker (after the DB is running).