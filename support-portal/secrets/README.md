Secrets template and 1Password import instructions

Files:
- 1password_import.csv — CSV template you can import into 1Password. Replace placeholder values before import.

How to use:
1. Open secrets/1password_import.csv in a spreadsheet editor (Excel/Google Sheets).
2. Replace placeholder values (CHANGE_ME_..., PLACEHOLDER_...) with your real secrets or set them as environment variables (preferred).
3. Export as CSV.
4. In 1Password → Tools → Import, choose CSV and follow the import steps (map columns if asked).
5. After import, mark items as "Secure Note" or appropriate item types in 1Password and store any kubeconfig files as File attachments.

Recommended items to add to 1Password (examples in CSV):
- DOCKERHUB_USERNAME and DOCKERHUB_TOKEN (for GitHub Actions)
- DB root passwords for dev/staging/production
- JWT secrets for services
- Kubeconfig files for UAT/SIT/NFT/PREPROD/PROD as file items

How to use secrets with this repo:
- Local dev (docker-compose): the compose file uses rootpw and change_this_local_secret placeholders. Replace them or set environment variables when running.
- GitHub Actions: set DOCKERHUB_USERNAME and DOCKERHUB_TOKEN in repository Settings → Secrets.
- Production: copy the required secrets from 1Password into your production secret manager (GitHub secrets, cloud secret manager, or Kubernetes secrets).

Security note:
- Do NOT commit real secrets to Git. This CSV is only a template with placeholders. Replace locally and import into your password manager, then delete local copies.
