PG Management - Fullstack (React + Spring Boot)

Overview
This workspace contains a Spring Boot (Java 17, Maven) backend under backend-java and a React frontend under frontend.
The original Node.js backend was removed per request.

Prerequisites
- Java 17
- Maven
- Node.js (16+), npm
- PostgreSQL

Database
Centralized SQL and environment configuration

- A single place holds the SQL initialization scripts for local MySQL databases used in development:
  - ./database/mysql/init/01-auth-db.sql  (auth-service schema)
  - ./database/mysql/init/02-pg-db.sql    (pg-service schema)
  - ./database/schema-all.sql             (master schema combining all service schemas)

- docker-compose.dev.yml mounts ./database/mysql/init into MySQL containers, so the SQL files are executed automatically on first container startup.

How to change the SQL
1. Edit the per-service SQL files in ./database/mysql/init (recommended). Each service's SQL is named with a numeric prefix so order is predictable (01-, 02-, ...).
2. If your environment requires a single script, edit ./database/schema-all.sql instead. This file is the concatenation of the per-service scripts.
3. After changing SQL, local Docker containers will not re-run initialization unless the database volume is recreated. To apply changes locally:
   - docker compose -f docker-compose.dev.yml down -v
   - docker compose -f docker-compose.dev.yml up --build
   This recreates the DB containers and runs the init SQL files again.

Environment-specific DB URLs and easy overrides

- Use the top-level .env file to control DB connection strings and credentials for each environment. Example variables are in .env.example. docker-compose reads those values (via env_file) for local development.

- For deployment (UAT/SIT/NFT/PREPROD/PROD), set each service's SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, and SPRING_DATASOURCE_PASSWORD using your deployment platform's secret manager (Kubernetes Secrets, cloud secret manager, or GitHub Actions secrets). The service property files already reference environment variables for non-dev profiles.

Recommended production approach (migrations)
- For production environments, use a migration tool such as Flyway or Liquibase instead of running raw SQL files. Migrations provide versioning, rollbacks, and repeatable deployments.
- I can add Flyway to each service (as a Maven dependency and configuration) so that migrations in src/main/resources/db/migration are applied at startup.

Quick local commands
- Recreate DBs with new SQL:
  docker compose -f docker-compose.dev.yml down -v
  docker compose -f docker-compose.dev.yml up --build

- Check DB init files:
  ls -la database/mysql/init
  cat database/schema-all.sql

If you'd like, I can:
- Add Flyway migrations to auth-service and pg-service and convert the SQL files into V1__*.sql migration files.
- Add a CI step to apply migrations during deployment using Flyway CLI.
- Generate seed data scripts to create an initial admin user and sample customers/tickets.

Notes
- CORS is enabled for http://localhost:3000 in the backend for development.
- JWT token is stored in localStorage by the frontend after login.
- Ensure the backend has at least one user in users table to log in, or implement registration flow.

Files of interest
- backend-java/: Spring Boot backend
  - src/main/resources/sql/schema.sql
  - src/main/java/com/supportportal/* — controllers, models, security
- frontend/: React app (Login, Dashboard, Customers, Tickets)

If you want, next steps I can do for you:
- Add Dockerfiles and docker-compose for dev
- Add Flyway migrations for database
- Seed scripts to create an initial admin user
- Expand frontend UI with better styling and validation
