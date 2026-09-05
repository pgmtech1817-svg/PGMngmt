Frontend Docker & deployment

This document explains how the frontend is built and deployed as a separate service.

Dockerfile
- Location: frontend/Dockerfile
- Multi-stage build:
  - Build stage: uses node:18 to run npm ci and npm run build
  - Runtime stage: uses nginx to serve the static build
- Nginx config: frontend/nginx.conf (copies to /etc/nginx/conf.d/default.conf)

Local dev via docker-compose
- docker-compose.dev.yml includes the frontend service and maps host port 3000 -> container port 80
- Start: docker compose -f docker-compose.dev.yml up --build
- Frontend will be accessible at http://localhost:3000

CI/CD
- GitHub Actions workflow (.github/workflows/ci-cd.yml) builds and pushes the frontend image when pushing to the tracked branches.
- Image pushed to: docker.io/<DOCKERHUB_USERNAME>/frontend:<branch>

API base URL configuration
- The frontend is built with a static API base URL extracted at runtime from the environment. For development the nginx proxy in docker-compose forwards /api to auth-service and pg-service; in production provide a different configuration (API gateway or environment-specific config).
- To point the frontend at specific backend endpoints in production, deploy nginx config or a small env-based replacement to rewrite /api calls to the proper backend gateway.

Note on separate deployment
- Frontend image is independent and can be deployed on its own (e.g., serve static files from CDN or simple nginx container).
- Backend and frontend deployments should be coordinated via environment configuration (set backend URLs in frontend or route via gateway).
