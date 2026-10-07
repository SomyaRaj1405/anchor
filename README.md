<h1 align="center">⚓ Anchor</h1>

<p align="center">
  <b>Steady Ground for the Return to Work.</b><br>
  Evidence-driven workforce intervention intelligence
</p>

<p align="center">
  36-hour hackathon project · Team Anchor · 2026
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-backend-009688?logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-frontend-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/status-in%20progress-orange" alt="Status">
</p>

---

## The idea

Most platforms answer a career gap by telling people to become more qualified. **Anchor first checks whether qualification was ever the real barrier.**

Published field experiments show that the main barrier is often *how a career history is presented*, not what the person can do:

- **49% lower callbacks** for women with a career break in India (Ashoka University, 2024), and upskilling certificates did not significantly change this.
- **About 15% more callbacks** when a resume shows years worked instead of employment dates (Nature Human Behaviour, 2022, UK).

Anchor turns these findings into a working decision-support tool.

## What Anchor does

| Screen | What it answers |
|---|---|
| **Candidate Diagnostic** | Which barriers does this candidate face, and should they reframe, reskill or transition? |
| **Intervention Lab** | How do screening odds change if the same candidate is presented differently? |
| **Transition Intelligence** | Which skills transfer to a new role, which are stale, which are missing? |
| **Employer Screening Audit** | Which screening rules wrongly exclude capable returning talent? |
| **Evidence Registry** | Which studies stand behind every number? |

## Every number is labelled

| Label | Meaning |
|---|---|
| `EMPIRICAL` | A statistic published in a cited study |
| `MODELLED` | A rule-based pattern computed from the candidate profile |
| `SIMULATED` | A scenario projection built from stated assumptions |

The core engines are deterministic: no language model, no randomness. The same input always gives the same output.

## Tech stack

- **Backend:** Python 3.11, FastAPI, Pydantic v2
- **Frontend:** React 18, Vite, React Router
- **Data:** JSON files (ontology, evidence registry, rules). No database needed.

## Project structure

```
anchor/
├── backend/
│   ├── app/
│   │   ├── engines/      diagnostic, simulation, transition, audit
│   │   ├── routers/      API endpoints
│   │   └── data/         ontology, evidence registry, rules, samples
│   └── tests/
├── frontend/             React app (screens and shared components)
├── contract/examples/    frozen API request/response examples
├── scripts/              smoke tests
└── docs/                 BRD and work files
```

## Running locally

**Backend**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

The app opens at `http://localhost:5173` and talks to the API at `http://localhost:8000/api`.

## Team

| Member | Area |
|---|---|
| **Hamza** | Team lead, API and integration |
| **Aditya** | Core engines (diagnostic, intervention, simulation) |
| **Somya** | Frontend foundation, Diagnostic and Lab screens, repository |
| **Laveesha** | Employer audit and Transition screen |
| **Aarushi** | Data, evidence registry, landing and evidence screens, QA |

## Documentation

The business requirements document and one work file per team member are in [`docs/`](docs/).

## Honest limitations

- Anchor shows population-level evidence and modelled scenarios. It does not predict any individual's outcome.
- The two studies were run in different countries; transfer between labour markets is not claimed.
- The skills and roles ontology is a small illustrative seed, not a validated labour-market model.
