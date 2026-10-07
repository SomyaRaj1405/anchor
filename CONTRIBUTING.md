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

## Daily workflow

1. Work and commit small, often, on your own branch.
2. Push your branch: `git push`
3. When a piece of work runs, merge it into `main`:

   git checkout main
   git pull
   git merge <your-branch>
   git push

4. Go back to your branch and bring in everyone else's work:

   git checkout <your-branch>
   git merge main

Always run `git pull` on `main` before you merge into it, so you never overwrite a teammate's push.

## Integrate early

Merge working pieces into `main` as soon as they run, not at the end. Run the backend and frontend together regularly, so problems show up early and not in the last hour.

## Stay in your lane

- Keep changes inside the folders you own (see the Team table in the README).
- If you need a change in someone else's folder, ask them.
- The API shapes in `contract/examples/` are frozen. Do not change them without telling the team lead.

## Rules for `main`

- Force pushes and deleting `main` are blocked.
- Never rewrite shared history (`git push --force`, `git reset` on pushed commits).
- If a merge conflicts and you are unsure, stop and ask. Do not guess.

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

## Before merging into `main`

- Backend: tests pass with `pytest` from the `backend` folder.
- Frontend: the app starts with `npm run dev` and the build passes with `npm run build`.
