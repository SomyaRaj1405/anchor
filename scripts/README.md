# Scripts

This folder is intentionally reserved for automation and local run helpers.

At the moment, the repository does not reference any scripts here directly, so it is safe to leave this as a lightweight placeholder until the team adds actual automation.

Suggested future contents:
- frontend startup helper
- backend startup helper
- data refresh or preprocessing scripts
- project cleanup and validation commands
- smoke-test checks for local services

Current scripts included:
- `start_frontend.ps1` — starts the Vite frontend on port 5173
- `start_backend.ps1` — creates a venv when needed and starts FastAPI on port 8000
- `start_all.ps1` — launches frontend and backend together
- `check_environment.ps1` — verifies Python, Node, npm, and folder presence
- `backend_health_check.ps1` — pings http://localhost:8000/api/health to confirm the backend is running

For now, this file keeps the folder purposeful and avoids an empty project folder.
