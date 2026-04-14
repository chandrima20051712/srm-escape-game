# SRMESCAPE FastAPI Backend

## Setup

1. Create and activate venv:
   - PowerShell:
     - `python -m venv .venv`
     - `.\.venv\Scripts\Activate.ps1`
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Create env file:
   - `Copy-Item .env.example .env`
   - Default setup uses SQLite (no PostgreSQL needed).
4. Run server:
   - `python run.py`

Server runs on `http://localhost:5000`.

## Optional: PostgreSQL Instead of SQLite

If you want PostgreSQL, set this in `.env`:

- `DB_DRIVER=postgres`
- `DB_USER=postgres`
- `DB_PASSWORD=...`
- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_NAME=srmescape`

## Endpoints

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin/register`
- `POST /api/auth/admin/login`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/scores/submit`
- `GET /api/scores/user`
- `GET /api/scores/best/{buildingId}`
- `GET /api/scores/leaderboard`
- `GET /api/scores/rank`
- `GET /api/puzzles/building/{buildingId}`
- `GET /api/puzzles/{id}`
- `POST /api/puzzles`
- `PUT /api/puzzles/{id}`
- `DELETE /api/puzzles/{id}`
- `GET /api/puzzles`

`/api/puzzles` create/update/delete/list endpoints require admin auth token.
