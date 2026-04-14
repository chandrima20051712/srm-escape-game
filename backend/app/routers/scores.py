from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from .. import crud, schemas
from ..core.database import get_db
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/scores", tags=["scores"])


@router.post("/submit")
async def submit(payload: schemas.ScoreSubmitRequest, current=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not payload.buildingId or payload.score is None:
        raise HTTPException(status_code=400, detail="Missing required fields")

    score = await crud.submit_score(
        db,
        user_id=int(current["id"]),
        building_id=payload.buildingId,
        score=payload.score,
        lives_remaining=payload.livesRemaining,
        time_taken=payload.timeTaken,
    )

    return {
        "id": score.id,
        "user_id": score.user_id,
        "building_id": score.building_id,
        "score": score.score,
        "completed_at": score.completed_at,
        "lives_remaining": score.lives_remaining,
        "time_taken": score.time_taken,
    }


@router.get("/user")
async def user_scores(current=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await crud.get_user_scores(db, int(current["id"]))


@router.get("/best/{building_id}")
async def best_score(building_id: str, current=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    row = await crud.get_user_best_score(db, int(current["id"]), building_id)
    return row or {}


@router.get("/leaderboard")
async def leaderboard(limit: int = Query(default=50), db: AsyncSession = Depends(get_db)):
    return await crud.get_leaderboard(db, limit)


@router.get("/rank")
async def rank(current=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    r = await crud.get_user_rank(db, int(current["id"]))
    return {"rank": r if r is not None else "N/A"}
