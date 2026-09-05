param(
  [ValidateSet('dev','uat','sit','nft','preprod','prod')][string]$Env = 'dev',
  [switch]$Recreate
)

function Info($m){ Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Warn($m){ Write-Host "[WARN] $m" -ForegroundColor Yellow }
function Err($m){ Write-Host "[ERROR] $m" -ForegroundColor Red }

$repoRoot = Resolve-Path ".." | Select-Object -ExpandProperty Path
$envFileSource = Join-Path $repoRoot ".env.$Env"
$envFileTarget = Join-Path $repoRoot ".env"

if (-not (Test-Path $envFileSource)) {
  Err "Environment file $envFileSource not found. Create .env.$Env first or choose another environment."
  exit 1
}

try {
  Copy-Item -Path $envFileSource -Destination $envFileTarget -Force
  Info "Copied $envFileSource -> $envFileTarget"
} catch {
  Err "Failed to copy env file: $_"
  exit 1
}

# Optionally recreate DB volumes to force init scripts to run
if ($Recreate.IsPresent) {
  Info "Recreating containers and removing volumes (this will delete local DB data)."
  docker compose -f "$repoRoot\docker-compose.dev.yml" down -v
  if ($LASTEXITCODE -ne 0) { Warn "docker compose down -v returned exit code $LASTEXITCODE" }
}

Info "Starting docker compose stack (build if necessary)"
Push-Location $repoRoot
try {
  docker compose -f "docker-compose.dev.yml" up --build -d
  if ($LASTEXITCODE -ne 0) { Err "docker compose up failed with exit code $LASTEXITCODE"; exit $LASTEXITCODE }
} finally {
  Pop-Location
}

Info "All done. Use 'docker compose -f docker-compose.dev.yml ps' to see running services."