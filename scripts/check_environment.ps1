$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot

function Test-Command($name) {
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    if ($null -eq $cmd) {
        Write-Host "[MISSING] $name"
        return $false
    }

    Write-Host "[OK] $name -> $($cmd.Source)"
    return $true
}

Write-Host "Anchor environment check"
Write-Host "Repository: $repoRoot"
Write-Host ""

$pythonOk = Test-Command "python"
$nodeOk = Test-Command "node"
$npmOk = Test-Command "npm"

Write-Host ""
$frontendExists = Test-Path (Join-Path $repoRoot "frontend")
$backendExists = Test-Path (Join-Path $repoRoot "backend")

Write-Host "[CHECK] Frontend folder exists: $frontendExists"
Write-Host "[CHECK] Backend folder exists: $backendExists"

if (-not $frontendExists -or -not $backendExists) {
    throw "Expected frontend and backend folders were not found."
}

Write-Host ""
Write-Host "Quick next steps:"
Write-Host "  1) Frontend: powershell -ExecutionPolicy Bypass -File .\scripts\start_frontend.ps1"
Write-Host "  2) Backend: powershell -ExecutionPolicy Bypass -File .\scripts\start_backend.ps1"
Write-Host "  3) Both: powershell -ExecutionPolicy Bypass -File .\scripts\start_all.ps1"

if (-not ($pythonOk -and $nodeOk -and $npmOk)) {
    Write-Host ""
    Write-Host "One or more required tools are missing. Install Python, Node.js, and npm before running the app."
    exit 1
}

Write-Host ""
Write-Host "Environment looks ready."
