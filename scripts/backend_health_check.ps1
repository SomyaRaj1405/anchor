$ErrorActionPreference = "Stop"

$url = "http://localhost:8000/api/health"

try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
    $statusCode = [int]$response.StatusCode

    if ($statusCode -ge 200 -and $statusCode -lt 300) {
        Write-Host "Backend health check passed."
        Write-Host $response.Content
        exit 0
    }

    Write-Host "Backend responded with an unexpected status: $statusCode"
    exit 1
}
catch {
    Write-Host "Backend is not running or not reachable at $url"
    Write-Host "Start it with: powershell -ExecutionPolicy Bypass -File .\scripts\start_backend.ps1"
    exit 1
}
