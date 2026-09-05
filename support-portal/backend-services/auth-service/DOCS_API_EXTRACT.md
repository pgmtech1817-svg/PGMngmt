Auth Service - API & Extraction Guide

Purpose
This document describes the auth-service API endpoints, how to extract authentication tokens, logs and metrics data (Prometheus), and how to integrate the service into monitoring and the frontend. It also points to the Service implementation class and usage.

Service location
- Code: backend-services/auth-service/
- Main class: com.supportportal.auth.Application
- Service package: com.supportportal.auth
- Service implementation (business logic): com.supportportal.auth.service.UserServiceImpl

Environment variables (common)
- SPRING_DATASOURCE_URL - JDBC URL for DB (MySQL/Postgres)
- SPRING_DATASOURCE_USERNAME
- SPRING_DATASOURCE_PASSWORD
- app.jwtSecret - HMAC secret used for JWT signing
- app.jwtExpirationMs - expiration in milliseconds (default 28800000 = 8 hours)
- SPRING_PROFILES_ACTIVE - e.g., dev or prod

API Endpoints (auth-service)
1) POST /api/auth/login
- Description: Authenticate user and return JWT token and user info.
- Request body (JSON): { "email": "owner@example.com", "password": "plaintext" }
- Success response (200):
  {
    "token": "eyJhbGci...",
    "user": { "id": 1, "name": "Owner", "email": "owner@example.com", "role": "OWNER" }
  }
- Error responses:
  - 400 Bad Request when email/password missing
  - 401 Unauthorized when credentials invalid

Curl examples
- Login (returns token):
  curl -s -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"owner@example.com","password":"password"}'

Using token in subsequent calls
- Example: call PG service with token
  TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"owner@example.com","password":"password"}' | jq -r .token)
  curl -H "Authorization: Bearer $TOKEN" http://localhost:4001/api/customers

Where JWT is created (implementation)
- Class: com.supportportal.auth.service.UserServiceImpl
- Method: authenticate(String email, String password)
- Uses: io.jsonwebtoken.Jwts with HMAC-SHA key (app.jwtSecret)
- Token claims: id, name, role, subject=email, exp, iat

Service implementation file
- Path: backend-services/auth-service/src/main/java/com/supportportal/auth/service/UserServiceImpl.java
- Responsibilities:
  - Validate user exists (UserRepository.findByEmail)
  - Validate password with BCryptPasswordEncoder
  - Generate JWT token and return a map with token and user data

Metrics & Monitoring
- Actuator endpoints (enabled in dev profile):
  - /actuator/health  -> health
  - /actuator/info    -> application info
  - /actuator/prometheus -> Prometheus metrics payload

- Prometheus scrape config (monitoring/prometheus/prometheus.yml)
  - Scrapes: auth-service:4000 and pg-service:4001 at path /actuator/prometheus

- Important Prometheus metric names exposed by Micrometer / Spring Boot:
  - jvm_memory_used_bytes{area}
  - jvm_gc_pause_seconds_count
  - process_cpu_usage
  - process_cpu_seconds_total
  - http_server_requests_seconds_count (and _sum/_bucket for histograms)
  - spring_boot_web_server_requests_seconds_count
  - system_cpu_count

- Grafana suggestions (panels):
  - Service uptime / health (query: up{job="spring-services",instance=~"auth-service:.*"})
  - Request rate: increase(http_server_requests_seconds_count{uri!="/actuator/prometheus"}[5m])
  - Error rate (4xx/5xx): sum by(status)(rate(http_server_requests_seconds_count{status=~"5.*"}[5m]))
  - JVM heap usage: jvm_memory_used_bytes{area="heap"}

Logs
- In Docker Compose dev, logs are available via docker compose logs -f auth-service
- In production, send logs to centralized logging (ELK/Opensearch). Implement appender (Logback) to ship logs.

How to extract metrics and logs for debugging
1. Metrics (Prometheus)
   - Visit http://localhost:9090/ (Prometheus UI) → Execute query, e.g. up or http_server_requests_seconds_count
   - To view raw Prometheus metrics from the service:
     curl http://localhost:4000/actuator/prometheus

2. Health
   - curl http://localhost:4000/actuator/health
   - Example JSON: { "status": "UP", "components": { ... } }

3. Logs
   - docker compose -f docker-compose.dev.yml logs -f auth-service
   - grepping for errors: docker compose logs auth-service | Select-String -Pattern "ERROR"

Database extraction and seeding
- Dev: docker-compose mounts SQL scripts into MySQL containers (auth-db). On first startup, MySQL runs those .sql files to create tables.
- To inspect DB:
  - Connect with mysql client: mysql -h 127.0.0.1 -P 33061 -u root -p (use the password set in your local .env or the AUTH_DB_ROOT_PASSWORD environment variable; do NOT rely on the example default)
  - Check users: SELECT id, name, email, role, created_at FROM users;

Service wiring notes (how AuthController now calls service)
- AuthController depends on UserService (interface). The concrete UserServiceImpl is a @Service component and is injected by Spring.
- For unit testing, mock UserService in controller tests.

Security notes
- In dev, actuator endpoints are exposed without auth for convenience. In production, lock down /actuator/** endpoints (restrict to internal network or require auth).
- Keep app.jwtSecret secure in production (use vault/secret manager; do NOT hardcode)

Where to find the new files
- UserService interface: backend-services/auth-service/src/main/java/com/supportportal/auth/service/UserService.java
- UserServiceImpl: backend-services/auth-service/src/main/java/com/supportportal/auth/service/UserServiceImpl.java
- Updated AuthController: backend-services/auth-service/src/main/java/com/supportportal/auth/controller/AuthController.java
- Prometheus config: monitoring/prometheus/prometheus.yml
- Docker Compose includes Prometheus and Grafana: docker-compose.dev.yml

Example: complete login + call customers
1) Start compose: docker compose -f docker-compose.dev.yml up --build
2) Create a user in auth-db (use mysql client or seed script). Example raw SQL:
   INSERT INTO users (name, email, password_hash, role) VALUES ('Owner', 'owner@example.com', '$2a$10$...bcrypthash...', 'OWNER');
3) Request token:
   curl -s -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"owner@example.com","password":"password"}' | jq
4) Use token to call PG service:
   curl -H "Authorization: Bearer <token>" http://localhost:4001/api/customers

Support
If you want, I can:
- Add a seed script that creates an initial owner with a bcrypt password and inserts sample customers/tickets.
- Add automated Grafana provisioning with a basic dashboard for these services.
- Lock down actuator endpoints in production profile and provide service-to-service auth examples.

