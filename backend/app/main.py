from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .core.config import settings
from .core.database import Base, SessionLocal, engine
from .routers import auth, puzzles, scores
from .seed import seed_puzzles_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE"))
        except Exception:
            # Column may already exist in existing databases.
            pass

    async with SessionLocal() as session:
        await seed_puzzles_if_empty(session)

    yield


app = FastAPI(title="SRMESCAPE FastAPI Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5500", "http://127.0.0.1:5500", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


app.include_router(auth.router)
app.include_router(scores.router)
app.include_router(puzzles.router)


@app.get("/")
async def root():
    return {"message": "SRMESCAPE FastAPI backend running"}
