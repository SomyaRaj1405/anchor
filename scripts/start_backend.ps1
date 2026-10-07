$repoRoot = Split-Path -Parent $PSScriptRoot
$backendDir = Join-Path $repoRoot "backend"
$venvPath = Join-Path $backendDir ".venv"

Set-Location $backendDir

if (-not (Test-Path $venvPath)) {
    Write-Host "Creating Python virtual environment..."
    py -m venv .venv
}

& (Join-Path $venvPath "Scripts\Activate.ps1")

Write-Host "Installing backend dependencies..."
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

Write-Host "Starting backend API..."
Write-Host "Open http://localhost:8000/api/health"
uvicorn app.main:app --reload --port 8000
