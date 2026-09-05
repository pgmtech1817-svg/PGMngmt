<#
PowerShell helper to export selected environment variables into a CSV suitable for import into a password manager.

USAGE (local only):
- Set the environment variables you want to export in your shell (do NOT run on CI with real secrets committed)
- Run: .\store_env_secrets.ps1 -OutFile exported_secrets.csv

This script picks a set of commonly-named variables used in this repo. It only exports values present in the environment.
#>
param(
  [string]$OutFile = "exported_secrets.csv"
)

$keys = @(
  'DOCKERHUB_USERNAME', 'DOCKERHUB_TOKEN', 'GITHUB_PAT',
  'SPRING_DATASOURCE_URL', 'SPRING_DATASOURCE_USERNAME', 'SPRING_DATASOURCE_PASSWORD',
  'JWT_SECRET', 'APP_JWT_EXP_MS',
  'KUBE_CONFIG_UAT', 'KUBE_CONFIG_SIT', 'KUBE_CONFIG_NFT', 'KUBE_CONFIG_PREPROD', 'KUBE_CONFIG_PROD'
)

$result = @()

foreach ($k in $keys) {
  $v = [System.Environment]::GetEnvironmentVariable($k)
  if ([string]::IsNullOrEmpty($v)) { continue }
  $entry = [PSCustomObject]@{
    title = $k
    username = ''
    password = $v
    URL = ''
    notes = "Exported from environment variable $k"
    environment = 'local'
    service = ''
    type = 'secret'
  }
  $result += $entry
}

if ($result.Count -eq 0) {
  Write-Host "No matching environment variables found. Nothing exported." -ForegroundColor Yellow
} else {
  $result | Export-Csv -Path $OutFile -NoTypeInformation -Encoding UTF8
  Write-Host "Exported $($result.Count) secrets to $OutFile" -ForegroundColor Green
}
