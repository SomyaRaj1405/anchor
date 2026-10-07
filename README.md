# Anchor

**Steady ground for the return to work.**
Evidence-driven career re-entry tool. 36-hour hackathon project, Team Anchor, 2026.

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-backend-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-frontend-646CFF?logo=vite&logoColor=white)

---

## The idea

Most platforms answer a career gap by telling people to become more qualified. **Anchor first checks whether qualification was ever the real barrier.**

Published resume-audit field experiments (24,894 resumes across two studies) show that the main barrier is often *how a career history is presented*, not what the person can do:

- **49% lower callbacks** for women with a career break in India (EV-001, Ashoka University, 2024, 15,872 resumes). Upskilling certificates did not significantly change this.
- **About 15% more callbacks** when a resume shows years worked instead of employment dates (EV-002, UK, 9,022 resumes).

## What is built and what is not

Be clear about this before reading the screens below.

**Built and working**
- A React frontend with sign-in, role-based navigation and eight screens.
- A real data pipeline and analysis in `src/` (cleaning, job-market analysis, skills and personality analysis, integrated insights, a recommendation engine), with outputs in `outputs/` and write-ups in `reports/`.
- An evidence registry (EV-001, EV-002) with sample sizes, methodology and citations.

**Not built yet**
- The backend engines and API layer. `backend/app/main.py` only serves `/api/health`. The diagnose, simulate, transition and audit endpoints are not implemented.
- Real authentication. Sign-in is a demo login with three hardcoded accounts (below). There is no server check.

Because the API is not built, the frontend (`frontend/src/api/client.js`) falls back to sample JSON in `frontend/src/mocks/`.

## Screens

| Screen | Route | What it shows | Data status |
|---|---|---|---|
| Overview | `/` | Project summary and entry points | Static |
| Check a profile | `/diagnose` | Likely barrier for a profile, confidence, next step | Three worked sample cases. The form fields do not change the result. |
| Transition paths | `/transition` | Skill overlap when moving to a new role | Three worked sample cases |
| Explore scenarios | `/simulate` | Pass likelihood under different resume framings | Computed in the browser from the EV-001 and EV-002 coefficients and the hiatus length. The break penalty is capped at 3 years. The base rate and the +5% lifts are modelled assumptions. |
| Screening rules | `/audit` | Which screening rules penalise career breaks | Sample rule set |
| Evidence | `/evidence` | Studies behind every number | Evidence registry JSON |
| Competency ontology | `/ontology` | Skills and roles used for matching | Small illustrative seed |
| Methodology | `/about` | How Anchor works | Static |

## Every number is labelled

| Label | Meaning |
|---|---|
| `EMPIRICAL` | A statistic published in a cited study |
| `MODELLED` | A pattern assigned to the sample profile |
| `SIMULATED` | A scenario projection built from stated assumptions |

## Demo logins

All three accounts use the password `password123`.

| Role | Email | Can open |
|---|---|---|
| Candidate | `candidate@anchor.app` | Overview, Check a profile, Transition paths, Evidence |
| Employer | `employer@anchor.app` | Overview, Explore scenarios, Screening rules, Evidence |
| Reviewer | `reviewer@anchor.app` | Overview, Check a profile, Transition paths, Explore scenarios, Evidence |

The reviewer account is the easiest way to see everything in one session.

## Running locally

**Frontend (this is all you need for the demo)**
```bash
cd frontend
npm install
npm run dev
```
The app opens at `http://localhost:5173`. To check that it builds: `npm run build`.

**Backend (health check only)**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
This serves `http://localhost:8000/api/health`. The frontend does not need it.

## Project structureanchor/
backend/ FastAPI app (health endpoint and data JSON only)
frontend/ React 18 + Vite + React Router app
contract/examples/ request and response examples for the four planned endpoints
src/ data cleaning, analysis and recommendation scripts
data/ source and cleaned datasets
outputs/ figures and tables produced by src/
reports/ written findings from the analysis
notebooks/ exploratory notebook
app.py Streamlit app
docs/ BRD and work files
## Team

| Member | Area | Branch | Work file |
|---|---|---|---|
| **Hamza** | Team lead, API and integration | `hamza-backend` | [Work file](docs/Anchor_Work_Hamza_Team_Lead.docx) |
| **Aditya** | Core engines (diagnostic, intervention, simulation) | `aditya-engines` | [Work file](docs/Anchor_Work_Aditya_Core_Engines.docx) |
| **Somya** | Frontend foundation, Diagnostic and Lab screens, repository | `somya-frontend` | [Work file](docs/Anchor_Work_Somya_Frontend.docx) |
| **Laveesha** | Employer audit and Transition screen | `laveesha-audit` | [Work file](docs/Anchor_Work_Laveesha_Audit_and_Transition.docx) |
| **Aarushi** | Data, evidence registry, landing and evidence screens, QA | `aarushi-data` | [Work file](docs/Anchor_Work_Aarushi_Data_and_Evidence.docx) |

## Documentation

- [Business Requirements Document (BRD v1.0)](docs/Anchor_BRD_v1_0.docx)
- One work file per team member, linked in the Team table above.

## Limitations

- The backend engines and API are not built, so most screens show sample data. Only the scenario simulator computes from its inputs.
- Sign-in is a mocked demo login, not real authentication.
- Anchor shows population-level evidence and modelled scenarios. It does not predict any individual's outcome.
- The two studies were run in different countries. Transfer between labour markets is not claimed.
- The skills and roles ontology is a small illustrative seed, not a validated labour-market model.
- The simulator's base rate and the +5% lifts for competency clusters and availability are modelling assumptions, not published results.