# FastAPI Backend Migration TODO

## Step 1: [DONE] Project Setup & Cleanup
- ✅ Create TODO.md
- ✅ Delete all Node.js files in backend/
- ✅ Create Python venv in backend/
- ✅ Create requirements.txt and install deps
- ✅ Copy/reuse .env (update if needed)
- ✅ Create core config/security/database files

## Step 2: [DONE] Database & Models
- ✅ Create SQLAlchemy models (User, Score, Puzzle) matching schemas
- ✅ Create config/database.py (asyncpg engine/session)
- ✅ Init DB tables (equivalent to create*Table)

## Step 3: [DONE] Schemas & CRUD
- ✅ Pydantic schemas for all endpoints (UserBase, PuzzleCreate etc.)
- ✅ CRUD modules for User/Score/Puzzle (all operations)

## Step 4: [DONE] Auth & Security
- ✅ JWT utils (create/access/verify tokens)
- ✅ Password hash/verify
- ✅ Email reset (log-based placeholder)

## Step 5: [DONE] Routers & Main App
- ✅ Create routers/auth.py, puzzles.py, scores.py (exact endpoints)
- ✅ main.py: app setup, CORS, routers, table init/seeding

## Step 6: [IN PROGRESS] Seeding & Testing
- ✅ Seed puzzles from data/puzzles.js (Node bridge -> JSON)
- ✅ Test server: uvicorn main:app --port 5000 (startup reached, blocked on DB auth)
- Verify endpoints match (curl tests)

## Step 7: [PENDING] Frontend Integration
- Test frontend API calls
- ✅ Update TODO progress

## Step 8: [PENDING] Cleanup & Complete
- Remove Node package.json/lock
- attempt_completion
