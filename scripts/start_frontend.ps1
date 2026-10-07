$repoRoot = Split-Path -Parent $PSScriptRoot
$frontendDir = Join-Path $repoRoot "frontend"

Set-Location $frontendDir

if (-not (Test-Path ".\node_modules")) {
    Write-Host "Installing frontend dependencies..."
    npm install
}

Write-Host "Starting frontend dev server..."
Write-Host "Open http://localhost:5173"
npm run dev -- --host 0.0.0.0
