<#
collect_secrets.ps1

Reads the ALL_SECRETS_TEMPLATE.csv (placeholders) and attempts to collect real secret values into a single export file suitable for import into a password manager.

Behavior:
- For each entry in ALL_SECRETS_TEMPLATE.csv (ignores lines starting with '#'):
  - If 'username' column contains an ENV VAR name (all uppercase with underscores), the script will try to read that env var and use its value.
  - Also tries an ENV VAR derived from the title by uppercasing and replacing non-alphanumeric with underscore.
  - If no env var found, prompts the user to enter the secret securely (input hidden).
- The script writes two possible outputs in secrets/:
  - EXPORT_SECRETS_encrypted.csv : password values encrypted using Windows DPAPI (ConvertFrom-SecureString) - safe to keep locally for the same user account.
  - EXPORT_SECRETS.csv : plaintext export (only written if user confirms explicitly). DO NOT commit this file.

IMPORTANT SECURITY NOTES:
- Do NOT commit any exported CSV that contains real secrets to source control.
- The encrypted file uses Windows Data Protection API and is only decryptable by the same Windows user on the same machine. Use this only for local transfer to your password manager.
- If you need portable encryption, export plaintext and encrypt with your secure tooling (GPG) before transfer, or use 1Password CLI to add items directly.

Usage:
  powershell -ExecutionPolicy Bypass -File .\secrets\collect_secrets.ps1

#>

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$template = Join-Path $scriptDir "ALL_SECRETS_TEMPLATE.csv"
if (-not (Test-Path $template)) { Write-Error "Template file not found: $template"; exit 1 }

Write-Host "Reading template: $template"
$lines = Get-Content $template | Where-Object { -not ($_ -match '^\s*#') -and ($_ -match '\S') }
$csv = $lines -join "`n" | ConvertFrom-Csv

$result = @()

function PromptSecure([string]$prompt) {
    $ss = Read-Host -AsSecureString -Prompt $prompt
    if ($ss.Length -eq 0) { return $null }
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($ss)
    try { [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) } finally { [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

foreach ($row in $csv) {
    $title = $row.title
    $usernameField = $row.username
    $envCandidates = @()
    if ($usernameField -and $usernameField -match '^[A-Z0-9_]+$') { $envCandidates += $usernameField }
    $sanitized = ($title.ToUpper() -replace '[^A-Z0-9]','_')
    $envCandidates += $sanitized

    $found = $false
    $value = $null
    foreach ($envName in $envCandidates | Select -Unique) {
        $v = [System.Environment]::GetEnvironmentVariable($envName)
        if ($v) { $value = $v; $found = $true; Write-Host "Found env var: $envName -> using value"; break }
    }

    if (-not $found) {
        Write-Host "\nSecret: $title"
        if ($row.URL) { Write-Host "  URL: $($row.URL)" }
        if ($row.notes) { Write-Host "  Notes: $($row.notes)" }
        $entered = PromptSecure "Enter value (leave empty to skip)"
        if ($entered) { $value = $entered }
    }

    $obj = [PSCustomObject]@{
        title = $row.title
        username = $row.username
        password = $value
        URL = $row.URL
        notes = $row.notes
        environment = $row.environment
        service = $row.service
        type = $row.type
    }
    $result += $obj
}

# Filter to rows where password is not null or empty
$filled = $result | Where-Object { $_.password -ne $null -and $_.password -ne '' }

if ($filled.Count -eq 0) {
    Write-Host "No secrets collected. Exiting." -ForegroundColor Yellow
    exit 0
}

$outEncrypted = Join-Path $scriptDir "EXPORT_SECRETS_encrypted.csv"
$outPlain = Join-Path $scriptDir "EXPORT_SECRETS.csv"

# Prepare encrypted export: convert password to SecureString and then to encrypted string
$encryptedRows = @()
foreach ($r in $filled) {
    $secure = ConvertTo-SecureString $r.password -AsPlainText -Force
    $enc = $secure | ConvertFrom-SecureString
    $encryptedRows += [PSCustomObject]@{
        title = $r.title; username = $r.username; password = $enc; URL = $r.URL; notes = $r.notes; environment = $r.environment; service = $r.service; type = $r.type
    }
}
$encryptedRows | Export-Csv -Path $outEncrypted -NoTypeInformation -Encoding UTF8
Write-Host "Encrypted export written to: $outEncrypted" -ForegroundColor Green
Write-Host "Note: The encrypted password values are protected with Windows DPAPI and can only be decrypted by this Windows user on this machine using ConvertTo-SecureString -Key/ -SecureString? No: use ConvertTo-SecureString with ConvertFrom-SecureString reversing under same user context." -ForegroundColor Yellow

# Optionally write plaintext (dangerous) only if user consents
$consent = Read-Host "Write plaintext CSV to $outPlain ? (type YES to confirm)"
if ($consent -eq 'YES') {
    $filled | Export-Csv -Path $outPlain -NoTypeInformation -Encoding UTF8
    Write-Host "Plaintext export written to: $outPlain" -ForegroundColor Red
} else {
    Write-Host "Plaintext export skipped." -ForegroundColor Cyan
}

Write-Host "Done. Import the encrypted CSV into your password manager by decrypting values on this machine, or use the plaintext file if you exported it (remember to delete it after use)." -ForegroundColor Green
