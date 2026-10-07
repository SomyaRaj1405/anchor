# Contributing to Anchor

This is a 36-hour hackathon project, so the rules are short.

## Branches

Each person works on their own branch:

| Member | Branch |
|---|---|
| Hamza | `hamza-backend` |
| Aditya | `aditya-engines` |
| Somya | `somya-frontend` |
| Laveesha | `laveesha-audit` |
| Aarushi | `aarushi-data` |

Do not commit directly to `main`. Open a pull request from your branch into `main`.

## Daily workflow

1. Update your branch: `git checkout <your-branch>` then `git merge main`
2. Do your work and commit small, often.
3. Push: `git push`
4. Open a pull request into `main` when a piece of work is ready.
5. The team lead reviews and merges.

## Stay in your lane

- Keep changes inside the folders you own (see the Team table in the README).
- If you need a change in someone else's folder, ask them or open a pull request they can review.
- The API shapes in `contract/examples/` are frozen. Do not change them without telling the team lead.

## Commit messages

Use a short prefix, then a plain description:

- `feat:` new functionality
- `fix:` bug fix
- `docs:` documentation only
- `chore:` setup, config, tooling
- `test:` tests

Example: `feat: add diagnostic screen form`

## Never commit

- `.env` files, API keys, passwords or tokens. This repository is public.
- Build output or dependency folders (`node_modules/`, `.venv/`, `dist/`).

If a secret is committed by mistake, tell the team lead immediately so it can be rotated.

## Before opening a pull request

- Backend: tests pass with `pytest` from the `backend` folder.
- Frontend: the app starts with `npm run dev` and the build passes with `npm run build`.
- Your branch has the latest `main` merged in.
