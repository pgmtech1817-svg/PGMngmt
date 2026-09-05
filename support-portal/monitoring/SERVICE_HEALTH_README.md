Service health & monitoring guide

All services expose health and metrics endpoints for monitoring. Prometheus (included in docker-compose.dev.yml) scrapes these endpoints and Grafana can visualize them.

Services and endpoints (dev compose)
- auth-service: http://localhost:4000/actuator/health  (metrics: /actuator/prometheus)
- pg-service: http://localhost:4001/actuator/health   (metrics: /actuator/prometheus)
- occupant-service: http://localhost:4002/actuator/health  (metrics: /actuator/prometheus)
- payment-service: http://localhost:4003/actuator/health   (metrics: /actuator/prometheus)
- notification-service: http://localhost:4004/actuator/health (metrics: /actuator/prometheus)
- scheduler-service: http://localhost:4005/actuator/health (metrics: /actuator/prometheus)
- frontend (SPA): http://localhost:3000/health  (returns JSON {"status":"UP"})

Prometheus config (monitoring/prometheus/prometheus.yml)
- spring-services job scrapes /actuator/prometheus on ports: 4000..4005
- frontend-health job scrapes /health on frontend:80

Quick checks
- Run everything: docker compose -f docker-compose.dev.yml up --build
- Check health via curl:
  curl http://localhost:4000/actuator/health
  curl http://localhost:4001/actuator/health
  curl http://localhost:3000/health

- Check Prometheus scrape status:
  Open http://localhost:9090 -> Status -> Targets (should list all services and show UP)

Grafana
- Open http://localhost:3001
- Add Prometheus datasource (URL: http://prometheus:9090 if provisioning from inside compose) or http://localhost:9090 from host browser
- Create dashboards for service uptime and metrics (suggested queries in DOCS_API_EXTRACT.md)

Notes
- In production, use secured actuator endpoints or limit access via network policies/firewalls.
- Ensure SPRING_PROFILES_ACTIVE is set correctly in each environment (uat/sit/nft/preprod/prod) and Prometheus is configured to scrape the right hostnames/ports in that environment.
