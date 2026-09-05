Backend services overview

This folder contains microservice projects (Spring Boot):
- auth-service (port 4000)
- pg-service (port 4001)
- occupant-service (placeholder)
- payment-service (placeholder)
- notification-service (placeholder)
- scheduler-service (placeholder)

Local development using Docker Compose (MySQL)
- docker-compose.dev.yml will bring up two MySQL containers and build auth-service and pg-service locally.
- Run: docker compose -f docker-compose.dev.yml up --build
- This creates local databases and runs the services. SQL schema files are mounted to MySQL containers to initialize the DBs.

Environment-specific Spring Boot profiles
- Each service includes application-dev.properties for local development (uses MySQL containers), application-uat.properties, application-sit.properties, application-nft.properties for UAT/SIT/NFT environments, and application-prod.properties that rely on environment variables for production.
- All non-dev profiles expect environment variables to provide DB URLs and credentials. Override SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD in each environment.

Secrets & Local development
- Do NOT store real passwords or secrets in YAML files (docker-compose or k8s manifests). docker-compose.dev.yml used to include plaintext passwords; it has been updated to reference environment variables instead.
- Use a local .env file (copy .env.example -> .env) for dev only. Ensure .env is listed in .gitignore (already done).
- For CI and production, use the platform's secret manager (GitHub Secrets, Kubernetes Secrets, cloud secret manager, or a vault). Do not commit secret values to the repo.

CI/CD (GitHub Actions)
- .github/workflows/ci-cd.yml builds both services and pushes Docker images to Docker Hub.
- Branch → environment mapping (workflow assigns deployment environment based on branch):
  - push to uat -> environment 'uat'
  - push to sit -> 'sit'
  - push to nft -> 'nft'
  - push to preprod -> 'preprod' (use environment protection rules for approvals)
  - push to main -> 'prod'
- How to wire profiles during deployment:
  - Set SPRING_PROFILES_ACTIVE to the target environment name (uat, sit, nft, preprod, prod) in your deployment (Kubernetes deployment manifest, systemd service, or container env).
  - Ensure the container image is started with the appropriate environment variables for DB and secrets.
- The deploy job is a placeholder: configure deploy steps (kubectl apply with KUBE_CONFIG_* secrets, Helm, or SSH) and set repository secrets (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN, and KUBE_CONFIG_* or SSH keys).

If you need, I can:
- Replace docker-compose usage with Docker secrets or bind-mounted files for even safer local secret handling.
- Add an example Kubernetes Secret manifest and a SOPS-encrypted secret file (KMS/GPG) so you can store encrypted secrets in the repo safely.
- Add automation to sync from 1Password to GitHub Secrets via 1Password CLI (requires a 1Password Connect token).

Secrets required for CI/CD (set in GitHub repo settings):
- DOCKERHUB_USERNAME
- DOCKERHUB_TOKEN
- Optional: KUBE_CONFIG_UAT, KUBE_CONFIG_SIT, KUBE_CONFIG_NFT, KUBE_CONFIG_PREPROD, KUBE_CONFIG_PROD

If you'd like, next actions I can take:
- Implement the deploy job for Kubernetes (create k8s manifests and use kubectl with kubeconfig secrets)
- Add Helm charts and a GitHub Actions deploy step using kubectl/helm
- Implement the remaining services with DB schema and endpoints
- Add service-to-service authentication (mTLS or service tokens)
