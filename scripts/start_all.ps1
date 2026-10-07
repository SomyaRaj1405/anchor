$scriptDir = $PSScriptRoot
$frontendScript = Join-Path $scriptDir "start_frontend.ps1"
$backendScript = Join-Path $scriptDir "start_backend.ps1"

Write-Host "Starting frontend and backend in separate terminals..."
Start-Process powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File $frontendScript
Start-Process powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File $backendScript

Write-Host "Both services were started."
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend: http://localhost:8000/api/health"
